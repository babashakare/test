const timersCount = 6;
const timers = [];

function parseDateString(dateStr) {
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (
    isNaN(year) || isNaN(month) || isNaN(day) ||
    year < 1970 || month < 1 || month > 12 || day < 1 || day > 31
  ) {
    return null;
  }
  return new Date(year, month - 1, day, 0, 0, 0);
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function updateTimer(timer) {
  const now = new Date();
  if (!timer.targetDate) {
    timer.element.textContent = 'بدون وقت';
    return false;
  }
  let diff = timer.targetDate - now;
  if(diff <= 0) {
    timer.element.textContent = 'زمان استراحت تموم شده';
    return false;
  }

  diff %= (1000 * 60 * 60 * 24); // Remove days from the difference

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  // تغییرات برای نمایش ماه، روز، ساعت، دقیقه و ثانیه
  const days = Math.floor((timer.targetDate - now) / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30); // تقریبی برای ماه
  const remainingDays = days % 30;

  timer.element.textContent = 
    months + ':' + remainingDays + ':' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  return true;
}

function tickAll() {
  let running = false;
  timers.forEach(timer => {
    if (updateTimer(timer)) running = true;
  });
  if (!running && intervalId) {
    clearInterval(intervalId);
  }
}

function initTimers(dateLines) {
  for(let i = 0; i < timersCount; i++) {
    const el = document.getElementById('timer' + (i + 1));
    let targetDate = null;
    if (dateLines && dateLines[i]) {
      targetDate = parseDateString(dateLines[i]);
    }
    timers.push({ element: el, targetDate });
    if (!targetDate) {
      el.textContent = 'وقت نامشخص';
    }
  }
  tickAll();
  intervalId = setInterval(tickAll, 1000);
}

function fetchAndInit() {
  return fetch('https://raw.githubusercontent.com/babashakare/site/refs/heads/master/streamer/stimer')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      const lines = text.split(/\r?\n/).slice(0, timersCount);
      initTimers(lines);
    });
}

function fetchAndUpdateDates() {
  fetch('https://raw.githubusercontent.com/babashakare/site/refs/heads/master/streamer/stimer')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.text();
    })
    .then(text => {
      const lines = text.split(/\r?\n/).slice(0, timersCount);
      for (let i = 0; i < timersCount; i++) {
        const newDate = lines[i] ? parseDateString(lines[i]) : null;
        if (newDate?.getTime() !== timers[i].targetDate?.getTime()) {
          timers[i].targetDate = newDate;
          if (!newDate) {
            timers[i].element.textContent = 'وقت نامشخص';
          }
        }
      }
    })
    .catch(e => {
      console.warn('Error updating dates:', e);
    });
}

let intervalId = null;
fetchAndInit()
  .catch(() => {
    initTimers(null);
  });

setInterval(fetchAndUpdateDates, 10000);
