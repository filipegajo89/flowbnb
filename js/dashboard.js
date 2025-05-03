document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o nome do usuário na sidebar
    updateUserInfo();
    
    // Carrega os dados de exemplo
    loadSampleData();
    
    // Verifica permissões do usuário
    checkUserPermissions();
    
    // Inicializa os gráficos
    initCharts();
});

function updateUserInfo() {
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
}

function checkUserPermissions() {
    const userRole = localStorage.getItem('userRole');
    const propertyAccess = localStorage.getItem('propertyAccess');
    
    // Se for co-proprietário, desativa links para propriedades que não tem acesso
    if (userRole === 'coproprietario') {
        const propertyLinks = document.querySelectorAll('.nav-pills .nav-link');
        
        propertyLinks.forEach(link => {
            // Verifica se o link contém onclick que acessa uma propriedade
            if (link.getAttribute('onclick') && !link.getAttribute('onclick').includes(propertyAccess)) {
                // Se não for dashboard ou relatórios e não for a propriedade com acesso
                if (!link.getAttribute('onclick').includes('showReports') && !link.classList.contains('active')) {
                    link.classList.add('disabled');
                }
            }
        });
    }
}

function loadSampleData() {
    // Dados de exemplo baseados nas suas planilhas
    const sampleData = {
        totalIncome: 45000,
        totalExpenses: 15000,
        netResult: 30000,
        properties: [
            {
                id: 'property1',
                name: 'Apartamento 1',
                income: 20000,
                expenses: 7000,
                result: 13000,
                profitability: 65
            },
            {
                id: 'property2',
                name: 'Apartamento 2',
                income: 15000,
                expenses: 5000,
                result: 10000,
                profitability: 66.67
            },
            {
                id: 'property3',
                name: 'Apartamento 3',
                income: 10000,
                expenses: 3000,
                result: 7000,
                profitability: 70
            }
        ],
        incomeBySource: {
            airbnb: 25000,
            booking: 15000,
            direct: 5000
        },
        monthlyData: [
            { month: 'Jan', income: 12000, expenses: 4000 },
            { month: 'Feb', income: 14000, expenses: 5000 },
            { month: 'Mar', income: 16000, expenses: 5500 },
            { month: 'Apr', income: 15000, expenses: 4800 },
            { month: 'May', income: 18000, expenses: 6000 }
        ]
    };
    
    // Atualiza os valores no dashboard
    document.getElementById('totalIncome').textContent = formatCurrency(sampleData.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(sampleData.totalExpenses);
    document.getElementById('netResult').textContent = formatCurrency(sampleData.netResult);
    
    // Atualiza a tabela de propriedades
    const tableBody = document.getElementById('propertiesSummary');
    tableBody.innerHTML = '';
    
    sampleData.properties.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${property.name}</td>
            <td class="text-income">R$ ${formatCurrency(property.income)}</td>
            <td class="text-expense">R$ ${formatCurrency(property.expenses)}</td>
            <td>R$ ${formatCurrency(property.result)}</td>
            <td>${property.profitability.toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Armazena os dados para uso nos gráficos
    window.dashboardData = sampleData;
}

function initCharts() {
    const data = window.dashboardData;
    
    if (!data) return;
    
    // Gráfico de Evolução de Receitas e Despesas
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    new Chart(incomeExpenseCtx, {
        type: 'line',
        data: {
            labels: data.monthlyData.map(item => item.month),
            datasets: [
                {
                    label: 'Receitas',
                    data: data.monthlyData.map(item => item.income),
                    borderColor: '#51cf66',
                    backgroundColor: 'rgba(81, 207, 102, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Despesas',
                    data: data.monthlyData.map(item => item.expenses),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Mudar para true
            height: 300, // Definir altura fixa
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
    
    // Gráfico de Pizza para Distribuição de Receitas
    const incomeSourcesCtx = document.getElementById('incomePieChart').getContext('2d');
    new Chart(incomeSourcesCtx, {
        type: 'pie',
        data: {
            labels: ['Airbnb', 'Booking', 'Diretas'],
            datasets: [{
                data: [
                    data.incomeBySource.airbnb,
                    data.incomeBySource.booking,
                    data.incomeBySource.direct
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

function loadProperty(propertyId) {
    // Em uma versão completa, aqui redirecionaria para a página da propriedade
    // Por enquanto, apenas alertamos
    alert(`Carregando propriedade: ${propertyId}`);
    
    // Na implementação real, você redirecionaria para:
    // window.location.href = `property.html?id=${propertyId}`;
}

function showReports() {
    // Em uma versão completa, aqui redirecionaria para a página de relatórios
    alert('Carregando relatórios');
    
    // Na implementação real, você redirecionaria para:
    // window.location.href = 'reports.html';
}

function changePeriod(period) {
    // Em uma versão completa, aqui atualizaria os dados com base no período selecionado
    alert(`Período alterado para: ${period}`);
    
    // Na implementação real, você recarregaria os dados e atualizaria os gráficos
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
