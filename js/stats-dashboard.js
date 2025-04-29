/**
 * Statistics Dashboard functionality for Tack Iron website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if we're on the stats dashboard page
    if (document.querySelector('.admin-dashboard')) {
        initCharts();
        initRealTimeUpdates();
    }
});

/**
 * Initialize all charts on the dashboard
 */
function initCharts() {
    // Traffic over time chart
    initTrafficChart();
    
    // Top pages chart
    initPagesChart();
    
    // Traffic sources chart
    initSourcesChart();
    
    // Device breakdown chart
    initDevicesChart();
}

/**
 * Initialize traffic over time chart
 */
function initTrafficChart() {
    const ctx = document.getElementById('traffic-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from an API
    const labels = ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25', 'Apr 26', 'Apr 27'];
    const pageViewsData = [1850, 1720, 1950, 2100, 1800, 2300, 2650];
    const visitorsData = [620, 580, 650, 700, 580, 750, 820];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Page Views',
                    data: pageViewsData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Unique Visitors',
                    data: visitorsData,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Initialize top pages chart
 */
function initPagesChart() {
    const ctx = document.getElementById('pages-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from an API
    const data = {
        labels: [
            'Homepage',
            'Strategic Project Execution',
            'Scaling Businesses',
            'Contact',
            'Strategic Placement',
            'Startup Growth Structure'
        ],
        datasets: [{
            data: [4250, 2180, 1950, 1620, 1380, 1078],
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#f1c40f',
                '#e74c3c',
                '#9b59b6',
                '#1abc9c'
            ],
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} views`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Initialize traffic sources chart
 */
function initSourcesChart() {
    const ctx = document.getElementById('sources-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from an API
    const data = {
        labels: [
            'Direct',
            'Organic Search',
            'Referral',
            'Social Media',
            'Email',
            'Other'
        ],
        datasets: [{
            data: [35, 25, 15, 12, 8, 5],
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#f1c40f',
                '#e74c3c',
                '#9b59b6',
                '#95a5a6'
            ],
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

/**
 * Initialize device breakdown chart
 */
function initDevicesChart() {
    const ctx = document.getElementById('devices-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from an API
    const data = {
        labels: [
            'Desktop',
            'Mobile',
            'Tablet'
        ],
        datasets: [{
            data: [52, 38, 10],
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#f1c40f'
            ],
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize real-time updates for the dashboard
 */
function initRealTimeUpdates() {
    // In a real application, this would use WebSockets or Server-Sent Events
    // For demo purposes, we'll use a simple interval to simulate real-time updates
    
    // Update active users count every 5-10 seconds
    setInterval(updateActiveUsers, getRandomInterval(5000, 10000));
    
    // Update page views count every 3-7 seconds
    setInterval(updatePageViews, getRandomInterval(3000, 7000));
    
    // Update real-time table every 8-15 seconds
    setInterval(updateRealTimeTable, getRandomInterval(8000, 15000));
}

/**
 * Update active users count
 */
function updateActiveUsers() {
    const activeUsersElement = document.getElementById('active-users');
    if (!activeUsersElement) return;
    
    // Get current value
    let currentValue = parseInt(activeUsersElement.textContent);
    
    // Generate a random change (-2 to +3)
    const change = Math.floor(Math.random() * 6) - 2;
    
    // Ensure value doesn't go below 1
    currentValue = Math.max(1, currentValue + change);
    
    // Update the element
    activeUsersElement.textContent = currentValue;
    
    // If value changed, add a brief highlight effect
    if (change !== 0) {
        activeUsersElement.classList.add('highlight');
        setTimeout(() => {
            activeUsersElement.classList.remove('highlight');
        }, 1000);
    }
}

/**
 * Update page views count
 */
function updatePageViews() {
    const pageViewsElement = document.getElementById('rt-pageviews');
    if (!pageViewsElement) return;
    
    // Get current value
    let currentValue = parseInt(pageViewsElement.textContent);
    
    // Generate a random change (0 to +3)
    const change = Math.floor(Math.random() * 4);
    
    // Update the value
    currentValue += change;
    
    // Update the element
    pageViewsElement.textContent = currentValue;
    
    // If value changed, add a brief highlight effect
    if (change !== 0) {
        pageViewsElement.classList.add('highlight');
        setTimeout(() => {
            pageViewsElement.classList.remove('highlight');
        }, 1000);
    }
}

/**
 * Update real-time table with simulated user activity
 */
function updateRealTimeTable() {
    const tableBody = document.querySelector('#real-time-table tbody');
    if (!tableBody) return;
    
    // 30% chance to update an existing row, 70% chance to leave as is
    if (Math.random() < 0.3) {
        // Get all rows
        const rows = tableBody.querySelectorAll('tr');
        
        // Select a random row
        const randomRowIndex = Math.floor(Math.random() * rows.length);
        const row = rows[randomRowIndex];
        
        // Update time on page
        const timeCell = row.querySelector('td:last-child');
        const timeParts = timeCell.textContent.split(' ');
        
        // Parse current time
        let minutes = parseInt(timeParts[0].substring(0, timeParts[0].indexOf('m')));
        let seconds = parseInt(timeParts[0].substring(timeParts[0].indexOf('m') + 2, timeParts[0].indexOf('s')));
        
        // Add 10-30 seconds
        seconds += Math.floor(Math.random() * 21) + 10;
        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
        
        // Update the cell
        if (timeParts.length > 1 && timeParts[1] === 'avg.') {
            timeCell.textContent = `${minutes}m ${seconds}s avg.`;
        } else {
            timeCell.textContent = `${minutes}m ${seconds}s`;
        }
        
        // Highlight the updated row
        row.classList.add('highlight-row');
        setTimeout(() => {
            row.classList.remove('highlight-row');
        }, 2000);
    }
}

/**
 * Get a random interval between min and max
 * @param {number} min - Minimum interval in milliseconds
 * @param {number} max - Maximum interval in milliseconds
 * @returns {number} - Random interval in milliseconds
 */
function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Refresh dashboard data based on selected date range
 * In a real application, this would fetch data from an API
 * @param {string} range - Selected date range
 * @param {string} startDate - Start date for custom range (optional)
 * @param {string} endDate - End date for custom range (optional)
 */
function refreshDashboardData(range, startDate, endDate) {
    // For demo purposes, we'll just update the date range text
    console.log(`Refreshing dashboard data for range: ${range}`);
    
    if (range === 'custom' && startDate && endDate) {
        console.log(`Custom date range: ${startDate} to ${endDate}`);
    }
    
    // Simulate loading state
    document.querySelectorAll('.stat-number').forEach(el => {
        el.classList.add('loading');
    });
    
    // Simulate API delay
    setTimeout(() => {
        // Update stats with random variations
        updateStatWithRandomVariation('total-pageviews', 12458, 0.1);
        updateStatWithRandomVariation('unique-visitors', 3842, 0.08);
        updateStatWithRandomVariation('avg-duration', '3m 24s', 0.15, true);
        updateStatWithRandomVariation('bounce-rate', '42.8%', 0.05, true);
        
        // Remove loading state
        document.querySelectorAll('.stat-number').forEach(el => {
            el.classList.remove('loading');
        });
        
        // Reinitialize charts with "new" data
        initCharts();
    }, 800);
}

/**
 * Update a stat with random variation
 * @param {string} elementId - ID of the element to update
 * @param {number|string} baseValue - Base value to vary from
 * @param {number} variationFactor - How much to vary (0.1 = 10%)
 * @param {boolean} isFormatted - Whether the value is formatted (e.g. "3m 24s" or "42.8%")
 */
function updateStatWithRandomVariation(elementId, baseValue, variationFactor, isFormatted = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (!isFormatted) {
        // Numeric value
        const numericValue = typeof baseValue === 'number' ? baseValue : parseInt(baseValue.replace(/,/g, ''));
        const variation = Math.floor(numericValue * variationFactor * (Math.random() * 2 - 1));
        const newValue = Math.max(0, numericValue + variation);
        
        // Format with commas
        element.textContent = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (baseValue.includes('m') && baseValue.includes('s')) {
        // Time format (e.g. "3m 24s")
        const minutesPart = parseInt(baseValue.split('m')[0]);
        const secondsPart = parseInt(baseValue.split('m')[1].split('s')[0]);
        
        // Convert to seconds, apply variation, convert back
        const totalSeconds = minutesPart * 60 + secondsPart;
        const variation = Math.floor(totalSeconds * variationFactor * (Math.random() * 2 - 1));
        const newTotalSeconds = Math.max(0, totalSeconds + variation);
        
        const newMinutes = Math.floor(newTotalSeconds / 60);
        const newSeconds = newTotalSeconds % 60;
        
        element.textContent = `${newMinutes}m ${newSeconds}s`;
    } else if (baseValue.includes('%')) {
        // Percentage format (e.g. "42.8%")
        const percentValue = parseFloat(baseValue);
        const variation = percentValue * variationFactor * (Math.random() * 2 - 1);
        const newValue = Math.max(0, Math.min(100, percentValue + variation)).toFixed(1);
        
        element.textContent = `${newValue}%`;
    }
}
