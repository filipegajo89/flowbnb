document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o nome do usuário na sidebar
    updateUserInfo();
    
    // Obtém o ID da propriedade da URL (ex: ?id=property1)
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id') || 'property1'; // Default para property1
    
    // Destaca a propriedade atual no menu
    highlightCurrentProperty(propertyId);
    
    // Carrega os dados da propriedade
    loadPropertyData(propertyId);
    
    // Verifica permissões do usuário
    checkUserPermissions();
});

function updateUserInfo() {
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
}

function highlightCurrentProperty(propertyId) {
    // Remove a classe active de todos os links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adiciona a classe active ao link da propriedade atual
    const currentPropertyLink = document.getElementById(`${propertyId}Link`);
    if (currentPropertyLink) {
        currentPropertyLink.classList.add('active');
    }
    
    // Atualiza o título da página
    document.getElementById('propertyTitle').textContent = getPropertyName(propertyId);
}

function getPropertyName(propertyId) {
    const propertyNames = {
        'property1': 'Apartamento 1',
        'property2': 'Apartamento 2',
        'property3': 'Apartamento 3'
    };
    
    return propertyNames[propertyId] || 'Propriedade';
}

function checkUserPermissions() {
    const userRole = localStorage.getItem('userRole');
    const propertyAccess = localStorage.getItem('propertyAccess');
    
    // Se for co-proprietário, verifica acesso
    if (userRole === 'coproprietario') {
        const urlParams = new URLSearchParams(window.location.search);
        const currentProperty = urlParams.get('id') || 'property1';
        
        // Se não tiver acesso a esta propriedade, redireciona
        if (currentProperty !== propertyAccess) {
            alert('Você não tem acesso a esta propriedade.');
            window.location.href = `property.html?id=${propertyAccess}`;
        }
        
        // Desativa links para propriedades sem acesso
        const propertyLinks = document.querySelectorAll('.nav-pills .nav-link');
        propertyLinks.forEach(link => {
            if (link.getAttribute('onclick') && !link.getAttribute('onclick').includes(propertyAccess)) {
                if (!link.getAttribute('onclick').includes('showReports') && !link.getAttribute('onclick').includes('Dashboard')) {
                    link.classList.add('disabled');
                }
            }
        });
    }
}

// Modificar a função loadPropertyData no arquivo js/property.js
function loadPropertyData(propertyId) {
    // Tenta carregar dados do localStorage
    const allProperties = JSON.parse(localStorage.getItem('propertiesData')) || {};
    const propertyData = allProperties[propertyId];
    
    // Se não houver dados no localStorage, usa os dados de exemplo
    if (!propertyData || !propertyData.transactions || propertyData.transactions.length === 0) {
        // Use o código existente para carregar dados de exemplo
        loadSamplePropertyData(propertyId);
        return;
    }
    
    // Calcula métricas para exibição
    const transactions = propertyData.transactions;
    
    // Prepara dados para exibição
    const monthlyData = transactions.slice(0, 12).map(t => ({
        month: convertPeriodToMonthName(t.period),
        income: t.totalIncome,
        expenses: t.totalExpenses,
        result: t.result
    })).reverse(); // Inverte para ordem cronológica
    
    // Calcula distribuição de receitas
    const incomeBySource = {
        airbnb: transactions.reduce((sum, t) => sum + t.airbnb, 0),
        booking: transactions.reduce((sum, t) => sum + t.booking, 0),
        direct: transactions.reduce((sum, t) => sum + t.direct, 0)
    };
    
    // Prepara objeto com todos os dados
    const displayData = {
        name: getPropertyName(propertyId),
        summary: {
            income: propertyData.metrics?.totalIncome || 0,
            expenses: propertyData.metrics?.totalExpenses || 0,
            result: propertyData.metrics?.result || 0,
            profitability: propertyData.metrics?.profitability || 0
        },
        incomeBySource,
        monthlyData,
        transactions: transactions.map(t => ({
            period: t.period,
            airbnb: t.airbnb,
            booking: t.booking,
            direct: t.direct,
            condominium: t.condominium,
            iptu: t.iptu,
            electricity: t.electricity,
            internet: t.internet,
            platforms: t.platforms,
            result: t.result
        }))
    };
    
    // Atualiza a interface com os dados
    updatePropertyInterface(displayData);
}

// Adicionar função auxiliar para converter período em nome do mês
function convertPeriodToMonthName(period) {
    if (!period) return '';
    
    const months = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const parts = period.split('/');
    if (parts.length === 2) {
        const monthIndex = parseInt(parts[0]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${months[monthIndex]}/${parts[1].slice(-2)}`;
        }
    }
    
    return period;
}

function updatePropertyInterface(propertyData) {
    // Atualiza os cards de resumo
    document.getElementById('propertyIncome').textContent = formatCurrency(propertyData.summary.income);
    document.getElementById('propertyExpenses').textContent = formatCurrency(propertyData.summary.expenses);
    document.getElementById('propertyResult').textContent = formatCurrency(propertyData.summary.result);
    document.getElementById('propertyProfitability').textContent = propertyData.summary.profitability.toFixed(2);
    
    // Preenche a tabela de transações
    const tableBody = document.getElementById('transactionsTable');
    tableBody.innerHTML = '';
    
    propertyData.transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.period}</td>
            <td class="text-income">R$ ${formatCurrency(transaction.airbnb)}</td>
            <td class="text-income">R$ ${formatCurrency(transaction.booking)}</td>
            <td class="text-income">R$ ${formatCurrency(transaction.direct)}</td>
            <td class="text-expense">R$ ${formatCurrency(transaction.condominium)}</td>
            <td class="text-expense">R$ ${formatCurrency(transaction.iptu)}</td>
            <td class="text-expense">R$ ${formatCurrency(transaction.electricity)}</td>
            <td class="text-expense">R$ ${formatCurrency(transaction.internet)}</td>
            <td class="text-expense">R$ ${formatCurrency(transaction.platforms)}</td>
            <td>R$ ${formatCurrency(transaction.result)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editTransaction('${transaction.period}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction('${transaction.period}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Inicializa os gráficos
    initPropertyCharts(propertyData);
    
    // Armazena os dados para uso futuro
    window.currentPropertyData = propertyData;
}

function initPropertyCharts(propertyData) {
    // Gráfico de evolução mensal
    const monthlyChartCtx = document.getElementById('propertyMonthlyChart').getContext('2d');
    new Chart(monthlyChartCtx, {
        type: 'line',
        data: {
            labels: propertyData.monthlyData.map(item => item.month),
            datasets: [
                {
                    label: 'Receitas',
                    data: propertyData.monthlyData.map(item => item.income),
                    borderColor: '#51cf66',
                    backgroundColor: 'rgba(81, 207, 102, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Despesas',
                    data: propertyData.monthlyData.map(item => item.expenses),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Resultado',
                    data: propertyData.monthlyData.map(item => item.result),
                    borderColor: '#339af0',
                    backgroundColor: 'rgba(51, 154, 240, 0.2)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
    
    // Gráfico de fontes de receita
    const incomeSourcesCtx = document.getElementById('propertyIncomeSourcesChart').getContext('2d');
    new Chart(incomeSourcesCtx, {
        type: 'pie',
        data: {
            labels: ['Airbnb', 'Booking', 'Diretas'],
            datasets: [{
                data: [
                    propertyData.incomeBySource.airbnb,
                    propertyData.incomeBySource.booking,
                    propertyData.incomeBySource.direct
                ],
                backgroundColor: [
                    '#00AB67', // Verde da logo
                    '#0C3C60', // Azul da logo
                    '#ffd43b' // Amarelo para contraste
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2) + '%';
                            return `R$ ${value.toLocaleString('pt-BR')} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

function saveTransaction() {
    // Em uma versão completa, aqui salvaria a transação
    alert('Transação salva com sucesso!');
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
    modal.hide();
    
    // Na implementação real, você recarregaria os dados
}

function editTransaction(period) {
    // Em uma versão completa, aqui abriria o modal com os dados da transação
    alert(`Editando transação do período: ${period}`);
}

function deleteTransaction(period) {
    // Em uma versão completa, aqui confirmaria e excluiria a transação
    const confirmDelete = confirm(`Tem certeza que deseja excluir a transação do período ${period}?`);
    
    if (confirmDelete) {
        alert(`Transação do período ${period} excluída com sucesso!`);
        // Na implementação real, você recarregaria os dados
    }
}

function changePropertyPeriod(period) {
    // Em uma versão completa, aqui atualizaria os dados com base no período selecionado
    alert(`Período alterado para: ${period}`);
    
    // Na implementação real, você recarregaria os dados e atualizaria os gráficos
}

function loadProperty(propertyId) {
    // Redireciona para a página da propriedade
    window.location.href = `property.html?id=${propertyId}`;
}

function showReports() {
    // Em uma versão completa, aqui redirecionaria para a página de relatórios
    alert('Carregando relatórios');
    
    // Na implementação real, você redirecionaria para:
    // window.location.href = 'reports.html';
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
