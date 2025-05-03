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

function loadPropertyData(propertyId) {
    // Dados de exemplo baseados nas suas planilhas
    const samplePropertyData = {
        property1: {
            name: 'Apartamento 1',
            summary: {
                income: 15000,
                expenses: 5000,
                result: 10000,
                profitability: 66.67
            },
            incomeBySource: {
                airbnb: 9000,
                booking: 4000,
                direct: 2000
            },
            monthlyData: [
                { month: 'Jan', income: 3000, expenses: 1000, result: 2000 },
                { month: 'Feb', income: 3500, expenses: 1200, result: 2300 },
                { month: 'Mar', income: 4000, expenses: 1400, result: 2600 },
                { month: 'Apr', income: 4500, expenses: 1400, result: 3100 }
            ],
            transactions: [
                {
                    period: '04/2025',
                    airbnb: 4500,
                    booking: 0,
                    direct: 0,
                    condominium: 1000,
                    iptu: 0,
                    electricity: 150,
                    internet: 100,
                    platforms: 150,
                    result: 3100
                },
                {
                    period: '03/2025',
                    airbnb: 4000,
                    booking: 0,
                    direct: 0,
                    condominium: 1000,
                    iptu: 0,
                    electricity: 200,
                    internet: 100,
                    platforms: 100,
                    result: 2600
                },
                {
                    period: '02/2025',
                    airbnb: 3500,
                    booking: 0,
                    direct: 0,
                    condominium: 1000,
                    iptu: 0,
                    electricity: 120,
                    internet: 80,
                    platforms: 0,
                    result: 2300
                },
                {
                    period: '01/2025',
                    airbnb: 3000,
                    booking: 0,
                    direct: 0,
                    condominium: 1000,
                    iptu: 0,
                    electricity: 0,
                    internet: 0,
                    platforms: 0,
                    result: 2000
                }
            ]
        },
        // Dados similares para outras propriedades...
        property2: {
            name: 'Apartamento 2',
            summary: {
                income: 12000,
                expenses: 4500,
                result: 7500,
                profitability: 62.50
            },
            // Dados similares para property1...
            transactions: [
                {
                    period: '04/2025',
                    airbnb: 4000,
                    booking: 0,
                    direct: 0,
                    condominium: 900,
                    iptu: 0,
                    electricity: 150,
                    internet: 100,
                    platforms: 150,
                    result: 2700
                },
                // Mais transações...
            ]
        },
        property3: {
            name: 'Apartamento 3',
            summary: {
                income: 10000,
                expenses: 3500,
                result: 6500,
                profitability: 65.00
            },
            // Dados similares para property1...
            transactions: [
                {
                    period: '04/2025',
                    airbnb: 3500,
                    booking: 0,
                    direct: 0,
                    condominium: 800,
                    iptu: 0,
                    electricity: 120,
                    internet: 100,
                    platforms: 100,
                    result: 2380
                },
                // Mais transações...
            ]
        }
    };
    
    // Obtém os dados da propriedade selecionada
    const propertyData = samplePropertyData[propertyId] || samplePropertyData.property1;
    
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
