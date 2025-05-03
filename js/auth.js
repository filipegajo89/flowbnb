// Função básica para verificar o login
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Se estiver na página de login e já estiver logado, redireciona para o dashboard
    if (isLoggedIn === 'true' && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // Se estiver em outra página e não estiver logado, redireciona para o login
    if (isLoggedIn !== 'true' && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Função para realizar o login
function handleLogin(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validação simples
    if (email === 'admin@flowbnb.com' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Administrador');
        window.location.href = 'dashboard.html';
    } else if (email === 'coproprietario@flowbnb.com' && password === 'coprop123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'coproprietario');
        localStorage.setItem('userName', 'Co-proprietário');
        localStorage.setItem('propertyAccess', 'property2');
        window.location.href = 'dashboard.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
}

// Função para realizar o logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('propertyAccess');
    window.location.href = 'index.html';
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', function() {
    // Verifica status de login
    checkLoginStatus();
    
    // Adiciona evento ao formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Atualiza nome do usuário
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
});
