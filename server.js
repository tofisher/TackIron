const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

// Simple visitor tracking
let visitorStats = {
    pageViews: {},
    uniqueVisitors: new Set(),
    referrers: {},
    browsers: {},
    operatingSystems: {},
    countries: {},
    sessions: {}
};

// Protected routes that require authentication
const protectedRoutes = ['/user-stats.html'];

// Valid credentials for demo purposes
const validCredentials = {
    'admin': 'admin123',
    'tackiron': 'password123'
};

const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    
    // Default to index.html
    let filePath = '.' + parsedUrl.pathname;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Track visitor
    trackVisitor(req);

    // Check if route is protected
    if (protectedRoutes.includes(parsedUrl.pathname)) {
        // Check for authentication
        const authHeader = req.headers.authorization;
        let isAuthenticated = false;
        
        if (authHeader) {
            // Basic authentication
            const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
            const username = auth[0];
            const password = auth[1];
            
            if (validCredentials[username] === password) {
                isAuthenticated = true;
            }
        }
        
        // If not authenticated, request authentication
        if (!isAuthenticated) {
            res.writeHead(401, {
                'WWW-Authenticate': 'Basic realm="Tack Iron Admin"',
                'Content-Type': 'text/html'
            });
            res.end('Authentication required');
            return;
        }
    }
    
    // Handle API requests
    if (parsedUrl.pathname === '/api/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getVisitorStats()));
        return;
    }
    
    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set the content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }

    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile('./404.html', (err, content) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

/**
 * Track visitor information
 * @param {http.IncomingMessage} req - The request object
 */
function trackVisitor(req) {
    // Get page path
    const parsedUrl = url.parse(req.url);
    const page = parsedUrl.pathname || '/';
    
    // Increment page view
    visitorStats.pageViews[page] = (visitorStats.pageViews[page] || 0) + 1;
    
    // Track unique visitor using IP (in a real app, would use cookies or other methods)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    visitorStats.uniqueVisitors.add(ip);
    
    // Track referrer
    const referrer = req.headers.referer || 'direct';
    visitorStats.referrers[referrer] = (visitorStats.referrers[referrer] || 0) + 1;
    
    // Track browser and OS
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Very simple browser detection
    let browser = 'Other';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
        browser = 'Edge';
    }
    
    visitorStats.browsers[browser] = (visitorStats.browsers[browser] || 0) + 1;
    
    // Very simple OS detection
    let os = 'Other';
    if (userAgent.includes('Windows')) {
        os = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
        os = 'macOS';
    } else if (userAgent.includes('Linux')) {
        os = 'Linux';
    } else if (userAgent.includes('Android')) {
        os = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        os = 'iOS';
    }
    
    visitorStats.operatingSystems[os] = (visitorStats.operatingSystems[os] || 0) + 1;
    
    // Track session
    if (!visitorStats.sessions[ip]) {
        visitorStats.sessions[ip] = {
            startTime: Date.now(),
            lastActivity: Date.now(),
            pageViews: 1,
            pages: [page]
        };
    } else {
        const session = visitorStats.sessions[ip];
        session.lastActivity = Date.now();
        session.pageViews++;
        if (!session.pages.includes(page)) {
            session.pages.push(page);
        }
    }
}

/**
 * Get visitor statistics in a format suitable for the dashboard
 * @returns {Object} Visitor statistics
 */
function getVisitorStats() {
    // Calculate total page views
    const totalPageViews = Object.values(visitorStats.pageViews).reduce((sum, views) => sum + views, 0);
    
    // Get unique visitors count
    const uniqueVisitors = visitorStats.uniqueVisitors.size;
    
    // Calculate average session duration
    let totalDuration = 0;
    let activeSessions = 0;
    
    for (const ip in visitorStats.sessions) {
        const session = visitorStats.sessions[ip];
        const duration = session.lastActivity - session.startTime;
        
        // Only count sessions that have more than one page view
        if (session.pageViews > 1) {
            totalDuration += duration;
            activeSessions++;
        }
    }
    
    const avgSessionDuration = activeSessions > 0 ? Math.floor(totalDuration / activeSessions) : 0;
    
    // Calculate bounce rate (percentage of sessions with only one page view)
    const totalSessions = Object.keys(visitorStats.sessions).length;
    const bounceSessions = Object.values(visitorStats.sessions).filter(session => session.pageViews === 1).length;
    const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0;
    
    // Format top pages
    const topPages = Object.entries(visitorStats.pageViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([page, views]) => ({
            page: page === '/' ? 'Homepage' : page.replace(/^\/|\.html$/g, '').replace(/-/g, ' '),
            views
        }));
    
    // Format traffic sources
    const trafficSources = {};
    let totalReferrers = 0;
    
    for (const referrer in visitorStats.referrers) {
        totalReferrers += visitorStats.referrers[referrer];
        
        if (referrer === 'direct') {
            trafficSources.Direct = (trafficSources.Direct || 0) + visitorStats.referrers[referrer];
        } else if (referrer.includes('google')) {
            trafficSources['Organic Search'] = (trafficSources['Organic Search'] || 0) + visitorStats.referrers[referrer];
        } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) {
            trafficSources['Social Media'] = (trafficSources['Social Media'] || 0) + visitorStats.referrers[referrer];
        } else if (referrer.includes('mail')) {
            trafficSources.Email = (trafficSources.Email || 0) + visitorStats.referrers[referrer];
        } else {
            trafficSources.Referral = (trafficSources.Referral || 0) + visitorStats.referrers[referrer];
        }
    }
    
    // Convert to percentages
    for (const source in trafficSources) {
        trafficSources[source] = Math.round((trafficSources[source] / totalReferrers) * 100);
    }
    
    // Ensure all sources are represented
    const defaultSources = ['Direct', 'Organic Search', 'Referral', 'Social Media', 'Email', 'Other'];
    defaultSources.forEach(source => {
        if (!trafficSources[source]) {
            trafficSources[source] = 0;
        }
    });
    
    // Format device breakdown
    const deviceBreakdown = {
        Desktop: 0,
        Mobile: 0,
        Tablet: 0
    };
    
    // In a real app, we would detect device type from user agent
    // For demo purposes, we'll use a fixed distribution
    deviceBreakdown.Desktop = 52;
    deviceBreakdown.Mobile = 38;
    deviceBreakdown.Tablet = 10;
    
    return {
        totalPageViews,
        uniqueVisitors,
        avgSessionDuration,
        bounceRate,
        topPages,
        trafficSources,
        deviceBreakdown,
        browsers: visitorStats.browsers,
        operatingSystems: visitorStats.operatingSystems
    };
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
