const SHEET_ID = '140jA1gwOT9sDSnbqG6n4ImvMzeBqOlqQVDkx-E2fsLc';
const API_KEY = 'AIzaSyCqTK7h_iC0y4PvoKs8kplrMsIbyMY-kZ0'; // کلید API شما
const RANGE = 'Sheet1!A2:D5'; // نام شیت و رنج داده‌ها

function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    $.get(url, function(data) {
        console.log(data); // برای بررسی داده‌ها
        if (data.values) {
            displayData(data.values);
        } else {
            $('#results').html('<p>داده‌ای برای نمایش وجود ندارد.</p>');
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching data: ", textStatus, errorThrown);
        $('#results').html('<p>خطا در بارگذاری داده‌ها.</p>');
    });
}

function displayData(rows) {
    let resultsHtml = '';
    rows.forEach(row => {
        resultsHtml += `<p>تاریخ: ${row[0]} - نام کاربری: ${row[1]} - بج نامبر: ${row[2]} - میزان پرداخت: ${row[3]}</p>`;
    });
    $('#results').html(resultsHtml);
}

// بارگذاری اولیه داده‌ها
fetchData();

// به‌روزرسانی هر 1 دقیقه
setInterval(fetchData, 60000);
