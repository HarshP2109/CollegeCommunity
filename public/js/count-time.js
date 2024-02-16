document.addEventListener('DOMContentLoaded', function() {
    updateTimeSpent();
    resetTimeSpent();
});

// Function to update the time spent on the website
function updateTimeSpent() {
    let timeSpent = localStorage.getItem('timeSpent');
    if (!timeSpent) {
        timeSpent = 0;
    } else {
        timeSpent = parseInt(timeSpent);
    }

    // Update time spent every second
    setInterval(function() {
        timeSpent++;
        localStorage.setItem('timeSpent', timeSpent);
        let min = timeSpent / 60;
        min  = Math.floor(min);
        let sec = timeSpent % 60;
        // document.getElementById('timeSpent').innerText = timeSpent + 's';
        if(min == 0)
        document.getElementById('timeSpent').innerText = sec + 's';
        else
        document.getElementById('timeSpent').innerText = min + 'm' + sec + 's';
    }, 1000);
}

// Function to reset time spent every other day
function resetTimeSpent() {
    let lastResetDate = localStorage.getItem('lastResetDate');
    if (!lastResetDate) {
        lastResetDate = new Date().getDate();
        localStorage.setItem('lastResetDate', lastResetDate);
    } else {
        lastResetDate = parseInt(lastResetDate);
    }

    // Check if it's time to reset
    setInterval(function() {
        let currentDate = new Date().getDate();
        if (currentDate !== lastResetDate) {
            localStorage.setItem('timeSpent', 0);
            localStorage.setItem('lastResetDate', currentDate);
        }
    }, 1000); // Check every second
}
