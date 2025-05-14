
        // --- بخش اول: محاسبه تعداد روزهای گذشته از تاریخ ثابت ---
        function calculateDaysPassedFromFixed() {
            const startDate = new Date(2020, 3, 20);
            const today = new Date();
            startDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = today - startDate;
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        function msUntilMidnight() {
            const now = new Date();
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            return nextMidnight - now;
        }

        function updateFixedDays() {
            const daysPassed = calculateDaysPassedFromFixed();
            document.getElementById('daysPassed').textContent = `${daysPassed}`;
        }

        function scheduleMidnightUpdate() {
            setTimeout(() => {
                updateFixedDays();
                setInterval(updateFixedDays, 24 * 60 * 60 * 1000);
            }, msUntilMidnight());
        }

        // --- بخش دوم: بارگذاری داده‌ها (اعداد) ---
        function fetchData() {
            const url = 'https://raw.githubusercontent.com/babashakare/site/refs/heads/master/streamer/babamoji';

            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const lines = data.split('\n');
                    const numberDisplays = [
                        document.getElementById('numberDisplay1'),
                        document.getElementById('numberDisplay2'),
                        document.getElementById('numberDisplay3'),
                        document.getElementById('numberDisplay4'),
                        document.getElementById('numberDisplay5')
                    ];

                    for (let i = 0; i < numberDisplays.length; i++) {
                        if (i < lines.length) {
                            const number = parseInt(lines[i], 10);
                            numberDisplays[i].innerText = !isNaN(number) ? number : 'عدد معتبر پیدا نشد';
                        } else {
                            numberDisplays[i].innerText = 'عدد معتبر پیدا نشد';
                        }
                    }
                })
                .catch(error => {
                    console.error('خطا در دریافت داده‌ها:', error);
                    const numberDisplays = [
                        document.getElementById('numberDisplay1'),
                        document.getElementById('numberDisplay2'),
                        document.getElementById('numberDisplay3'),
                        document.getElementById('numberDisplay4'),
                        document.getElementById('numberDisplay5')
                    ];
                    numberDisplays.forEach(el => el.innerText = 'خطا در دریافت داده‌ها');
                });
        }

        // --- بخش سوم: تایمر شمارش معکوس تا تاریخ‌های هدف ---
        const targetDates = [
            { id: 'timed1', date: '2020-04-14T00:00:00', outputId: 'out1' },
            { id: 'timed2', date: '2023-10-01T00:00:00', outputId: 'out2' },
            { id: 'timed3', date: '2024-01-01T00:00:00', outputId: 'out3' },
            { id: 'timed4', date: '2023-12-25T00:00:00', outputId: 'out4' },
            { id: 'timed5', date: '2023-11-11T00:00:00', outputId: 'out5' }
        ];

        function formatTimeDiff(diffMs) {
            if (diffMs <= 0) return 'پایان مسابقه';

            let remaining = diffMs / 1000; // ثانیه
            const days = Math.floor(remaining / (24 * 3600));
            remaining -= days * 24 * 3600;
            const hours = Math.floor(remaining / 3600);
            remaining -= hours * 3600;
            const minutes = Math.floor(remaining / 60);

            let result = [];
            if (days > 0) result.push(`${days}:`);
            if (hours > 0) result.push(`${hours}:`);
            if (minutes > 0) result.push(`${minutes}`);
            if (result.length === 0) result.push('کمتر از 1 دقیقه');
			

            return result.join('') + '';
        }

        function updateCountdowns() {
            const now = new Date();
            targetDates.forEach(({ id, date, outputId }) => {
                const target = new Date(date);
                const diff = target - now;
                const timeElem = document.getElementById(id);
                const outputElem = document.getElementById(outputId);

                timeElem.textContent = formatTimeDiff(diff);

                // بررسی وضعیت زمان
                if (diff > 0) {
                    outputElem.textContent = 'فعال'; // هنوز به تاریخ نرسیده
                    outputElem.className = 'on'; // اضافه کردن کلاس on
                } else {
                    outputElem.textContent = 'غیرفعال'; // از تاریخ گذشته
                    outputElem.className = 'off'; // اضافه کردن کلاس off
                }
            });
        }

        function startCountdownUpdates() {
            updateCountdowns();
            setInterval(updateCountdowns, 60 * 1000); // هر 60 ثانیه به روز شود
        }

        // تابع ترکیب به روز رسانی داده‌ها و تایمرها
        function updateData() {
            fetchData().then(() => {
                startCountdownUpdates();
            });
        }

        window.onload = function() {
            // بخش اول
            scheduleMidnightUpdate();
            updateFixedDays();

            // بخش دوم و سوم
            updateData();
            setInterval(updateData, 10000); // هر ۱۰ ثانیه به روزرسانی داده‌ها و تایمرها
        };