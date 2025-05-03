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

// Adicionar isso no início do arquivo, após as funções existentes

// Dados dos usuários para o exemplo
const users = [
    {
        email: 'admin@flowbnb.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador',
        securityQuestion: 'pet',
        securityAnswer: 'rex'
    },
    {
        email: 'coproprietario@flowbnb.com',
        password: 'coprop123',
        role: 'coproprietario',
        name: 'Co-proprietário',
        propertyAccess: 'property2',
        securityQuestion: 'city',
        securityAnswer: 'rio'
    }
];

// Armazena os usuários no localStorage para persistência
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Chama a função para inicializar os usuários quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
    // Outras funções existentes de inicialização...
});

// Função de recuperação de senha
function recoverPassword() {
    const email = document.getElementById('recoveryEmail').value;
    const question = document.getElementById('securityQuestion').value;
    const answer = document.getElementById('securityAnswer').value.toLowerCase();
    
    const usersData = JSON.parse(localStorage.getItem('users')) || users;
    const user = usersData.find(u => u.email === email);
    
    const resultElement = document.getElementById('recoveryResult');
    resultElement.classList.remove('d-none', 'alert-success', 'alert-danger');
    
    if (!user) {
        resultElement.classList.add('alert-danger');
        resultElement.textContent = 'E-mail não encontrado.';
        resultElement.classList.remove('d-none');
        return;
    }
    
    if (user.securityQuestion === question && user.securityAnswer === answer.toLowerCase()) {
        // Gera uma nova senha temporária
        const tempPassword = generateTemporaryPassword();
        
        // Atualiza a senha do usuário
        user.password = tempPassword;
        localStorage.setItem('users', JSON.stringify(usersData));
        
        resultElement.classList.add('alert-success');
        resultElement.innerHTML = `Senha temporária gerada: <strong>${tempPassword}</strong><br>
                                   Por favor, anote esta senha e use-a para fazer login.`;
        resultElement.classList.remove('d-none');
    } else {
        resultElement.classList.add('alert-danger');
        resultElement.textContent = 'Pergunta de segurança ou resposta incorreta.';
        resultElement.classList.remove('d-none');
    }
}

// Gera uma senha temporária aleatória
function generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Modificar a função handleLogin para usar os usuários do localStorage
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const usersData = JSON.parse(localStorage.getItem('users')) || users;
    const user = usersData.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        
        if (user.propertyAccess) {
            localStorage.setItem('propertyAccess', user.propertyAccess);
        }
        
        window.location.href = 'pages/dashboard.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
}
