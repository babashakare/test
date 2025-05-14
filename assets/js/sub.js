const timersCount = 1;

function fetchAndDisplayDates() {
    fetch('https://raw.githubusercontent.com/babashakare/site/refs/heads/master/streamer/stimer')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const dates = data.split('\n').map(date => date.trim()).filter(date => date);
            const today = new Date();
            const results = [];

            for (let i = 0; i < Math.min(timersCount, dates.length); i++) {
                const date = new Date(dates[i]);
                const timeDiff = date - today;
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (daysDiff > 0) {
                    results.push(تعداد روز تا تاریخ ${dates[i]}: ${daysDiff} روز);
                } else {
                    results.push('تاریخ گذشته است');
                }
            }

            for (let i = 0; i < results.length; i++) {
                const el = document.getElementById('sub' + (i + 1));
                if (el) {
                    el.innerText = results[i];
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// بارگذاری اولیه تاریخ‌ها
fetchAndDisplayDates();

// به‌روزرسانی هر 10 ساعت (36000000 میلی‌ثانیه)
setInterval(fetchAndDisplayDates, 36000000);