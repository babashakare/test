  const iframe = document.getElementById('embedFrame');
  const errorMessage = document.getElementById('errorMessage');
  // Try to detect loading error (limited due to iframe cross-origin restrictions)
  iframe.addEventListener('error', () => {
    errorMessage.style.display = 'block';
  });
  // Optional: timeout fallback if iframe doesn't load in 10 seconds
  setTimeout(() => {
    if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML.trim() === "") {
      errorMessage.style.display = 'block';
    }
  }, 10000);