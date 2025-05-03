document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário já está logado
    checkLoginStatus();
    
    // Adiciona evento de submit ao formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Se estiver na página de login e já estiver logado, redireciona para o dashboard
    if (isLoggedIn === 'true' && window.location.pathname.includes('index.html')) {
        window.location.href = 'pages/dashboard.html';
    }
    
    // Se estiver em outra página e não estiver logado, redireciona para o login
    if (isLoggedIn !== 'true' && !window.location.pathname.includes('index.html')) {
        window.location.href = '../index.html';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validação simples - em uma versão real, você usaria uma API ou Firebase
    if (email === 'admin@flowbnb.com' && password === 'admin123') {
        // Usuário admin tem acesso a todas as propriedades
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Administrador');
        window.location.href = 'pages/dashboard.html';
    } else if (email === 'coproprietario@flowbnb.com' && password === 'coprop123') {
        // Co-proprietário tem acesso limitado
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'coproprietario');
        localStorage.setItem('userName', 'Co-proprietário');
        localStorage.setItem('propertyAccess', 'property2'); // ID da propriedade que ele tem acesso
        window.location.href = 'pages/dashboard.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('propertyAccess');
    window.location.href = '../index.html';
}
