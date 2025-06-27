document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'admin123') {
    sessionStorage.setItem('auth', 'true');
    window.location.href = 'main.html';
  } else {
    document.getElementById('error').classList.remove('hidden');
  }
});
