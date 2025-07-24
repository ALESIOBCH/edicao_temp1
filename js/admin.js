// Variáveis globais
let currentSection = 'templates';
let clients = [
    {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        template: 'romantico',
        status: 'active',
        notes: 'Cliente preferencial'
    },
    {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@email.com',
        template: 'amizade',
        status: 'pending',
        notes: 'Aguardando aprovação'
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    setupEventListeners();
    loadClients();
});

// Inicializar administração
function initializeAdmin() {
    // Mostrar seção inicial
    showSection('templates');
    
    // Verificar autenticação (simulado)
    checkAuthentication();
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            updateNavigation(this);
        });
    });

    // Botões de template
    const editButtons = document.querySelectorAll('.btn-edit');
    const previewButtons = document.querySelectorAll('.btn-preview');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            editTemplate(template);
        });
    });

    previewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            previewTemplate(template);
        });
    });

    // Modais
    setupModalListeners();
    
    // Clientes
    setupClientListeners();
}

// Mostrar seção
function showSection(sectionName) {
    // Ocultar todas as seções
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar seção selecionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
}

// Atualizar navegação
function updateNavigation(activeButton) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Editar template
function editTemplate(templateName) {
    const modal = document.getElementById('templateModal');
    const nameInput = document.getElementById('templateName');
    const descInput = document.getElementById('templateDesc');
    const categorySelect = document.getElementById('templateCategory');

    // Preencher dados do template
    const templateData = getTemplateData(templateName);
    nameInput.value = templateData.name;
    descInput.value = templateData.description;
    categorySelect.value = templateName;

    // Mostrar modal
    modal.classList.add('active');
}

// Visualizar template
function previewTemplate(templateName) {
    // Abrir template em nova aba com parâmetro admin
    const templateUrl = `templates/${templateName}/index.html?admin=true`;
    window.open(templateUrl, '_blank');
}

// Obter dados do template
function getTemplateData(templateName) {
    const templates = {
        romantico: {
            name: 'Template Romântico',
            description: 'Ideal para aniversários de namoro e momentos românticos',
            category: 'romantico'
        },
        amizade: {
            name: 'Template Amizade',
            description: 'Perfeito para celebrar aniversários de amigos',
            category: 'amizade'
        },
        profissional: {
            name: 'Template Profissional',
            description: 'Ideal para reconhecimento de funcionários',
            category: 'profissional'
        }
    };

    return templates[templateName] || {};
}

// Configurar listeners dos modais
function setupModalListeners() {
    // Modal de template
    const templateModal = document.getElementById('templateModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveTemplate = document.getElementById('saveTemplate');

    closeModal.addEventListener('click', () => {
        templateModal.classList.remove('active');
    });

    cancelEdit.addEventListener('click', () => {
        templateModal.classList.remove('active');
    });

    saveTemplate.addEventListener('click', () => {
        saveTemplateChanges();
    });

    // Modal de cliente
    const clientModal = document.getElementById('clientModal');
    const closeClientModal = document.getElementById('closeClientModal');
    const cancelClient = document.getElementById('cancelClient');
    const saveClient = document.getElementById('saveClient');
    const addClientBtn = document.getElementById('addClient');

    addClientBtn.addEventListener('click', () => {
        clientModal.classList.add('active');
    });

    closeClientModal.addEventListener('click', () => {
        clientModal.classList.remove('active');
    });

    cancelClient.addEventListener('click', () => {
        clientModal.classList.remove('active');
    });

    saveClient.addEventListener('click', () => {
        saveNewClient();
    });

    // Fechar modal clicando fora
    templateModal.addEventListener('click', (e) => {
        if (e.target === templateModal) {
            templateModal.classList.remove('active');
        }
    });

    clientModal.addEventListener('click', (e) => {
        if (e.target === clientModal) {
            clientModal.classList.remove('active');
        }
    });
}

// Salvar alterações do template
function saveTemplateChanges() {
    const nameInput = document.getElementById('templateName');
    const descInput = document.getElementById('templateDesc');
    const categorySelect = document.getElementById('templateCategory');

    // Validar dados
    if (!nameInput.value.trim()) {
        showNotification('Por favor, preencha o nome do template', 'error');
        return;
    }

    // Simular salvamento
    showNotification('Template atualizado com sucesso!', 'success');
    
    // Fechar modal
    document.getElementById('templateModal').classList.remove('active');
    
    // Atualizar interface (simulado)
    updateTemplateCard(categorySelect.value, nameInput.value, descInput.value);
}

// Atualizar card do template
function updateTemplateCard(templateName, name, description) {
    const templateCard = document.querySelector(`[data-template="${templateName}"]`);
    if (templateCard) {
        const nameElement = templateCard.querySelector('.template-name');
        const descElement = templateCard.querySelector('.template-desc');
        
        if (nameElement) nameElement.textContent = name;
        if (descElement) descElement.textContent = description;
    }
}

// Configurar listeners de clientes
function setupClientListeners() {
    // Event delegation para botões da tabela
    const tableBody = document.getElementById('clientsTableBody');
    
    tableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-icon');
        if (!button) return;

        const row = button.closest('tr');
        const clientId = getClientIdFromRow(row);

        if (button.title === 'Editar') {
            editClient(clientId);
        } else if (button.title === 'Visualizar') {
            viewClient(clientId);
        } else if (button.title === 'Excluir') {
            deleteClient(clientId);
        }
    });
}

// Obter ID do cliente da linha
function getClientIdFromRow(row) {
    const cells = row.querySelectorAll('td');
    const email = cells[1].textContent;
    const client = clients.find(c => c.email === email);
    return client ? client.id : null;
}

// Editar cliente
function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Preencher modal com dados do cliente
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientTemplate').value = client.template;
    document.getElementById('clientNotes').value = client.notes || '';

    // Mostrar modal
    document.getElementById('clientModal').classList.add('active');
    
    // Armazenar ID para edição
    document.getElementById('saveClient').setAttribute('data-editing', clientId);
}

// Visualizar cliente
function viewClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Abrir template do cliente
    const templateUrl = `templates/${client.template}/index.html?client=${clientId}`;
    window.open(templateUrl, '_blank');
}

// Excluir cliente
function deleteClient(clientId) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    // Remover cliente da lista
    clients = clients.filter(c => c.id !== clientId);
    
    // Atualizar tabela
    loadClients();
    
    showNotification('Cliente excluído com sucesso!', 'success');
}

// Salvar novo cliente
function saveNewClient() {
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const template = document.getElementById('clientTemplate').value;
    const notes = document.getElementById('clientNotes').value.trim();
    const editingId = document.getElementById('saveClient').getAttribute('data-editing');

    // Validar dados
    if (!name || !email) {
        showNotification('Por favor, preencha nome e email', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor, insira um email válido', 'error');
        return;
    }

    if (editingId) {
        // Editar cliente existente
        const clientIndex = clients.findIndex(c => c.id == editingId);
        if (clientIndex !== -1) {
            clients[clientIndex] = {
                ...clients[clientIndex],
                name,
                email,
                template,
                notes
            };
        }
        document.getElementById('saveClient').removeAttribute('data-editing');
        showNotification('Cliente atualizado com sucesso!', 'success');
    } else {
        // Criar novo cliente
        const newClient = {
            id: Date.now(),
            name,
            email,
            template,
            status: 'pending',
            notes
        };

        clients.push(newClient);
        showNotification('Cliente criado com sucesso!', 'success');
    }

    // Limpar formulário
    clearClientForm();
    
    // Fechar modal
    document.getElementById('clientModal').classList.remove('active');
    
    // Atualizar tabela
    loadClients();
}

// Limpar formulário de cliente
function clearClientForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientTemplate').value = 'romantico';
    document.getElementById('clientNotes').value = '';
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Carregar clientes na tabela
function loadClients() {
    const tableBody = document.getElementById('clientsTableBody');
    
    tableBody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${getTemplateName(client.template)}</td>
            <td><span class="status ${client.status}">${getStatusText(client.status)}</span></td>
            <td>
                <button class="btn-icon" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon danger" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Obter nome do template
function getTemplateName(templateKey) {
    const names = {
        romantico: 'Romântico',
        amizade: 'Amizade',
        profissional: 'Profissional'
    };
    return names[templateKey] || templateKey;
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        active: 'Ativo',
        pending: 'Pendente',
        inactive: 'Inativo'
    };
    return texts[status] || status;
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Verificar autenticação (simulado)
function checkAuthentication() {
    // Em um sistema real, verificaria token de autenticação
    const isAuthenticated = true; // Simulado
    
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Funções de utilidade para exportação/importação
function exportClients() {
    const dataStr = JSON.stringify(clients, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'clientes.json';
    link.click();
    
    showNotification('Dados exportados com sucesso!', 'success');
}

function importClients(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedClients = JSON.parse(e.target.result);
            clients = importedClients;
            loadClients();
            showNotification('Dados importados com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao importar dados', 'error');
        }
    };
    reader.readAsText(file);
}

// Função para gerar QR Code (simulado)
function generateQRCode(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const url = `${window.location.origin}/templates/${client.template}/index.html?client=${clientId}`;
    
    // Em um sistema real, usaria uma biblioteca de QR Code
    showNotification(`QR Code gerado para: ${url}`, 'success');
}

// Estatísticas do dashboard
function updateDashboardStats() {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const pendingClients = clients.filter(c => c.status === 'pending').length;
    
    // Atualizar elementos da interface (se existirem)
    const statsElements = {
        total: document.getElementById('totalClients'),
        active: document.getElementById('activeClients'),
        pending: document.getElementById('pendingClients')
    };
    
    if (statsElements.total) statsElements.total.textContent = totalClients;
    if (statsElements.active) statsElements.active.textContent = activeClients;
    if (statsElements.pending) statsElements.pending.textContent = pendingClients;
}

// Inicializar estatísticas
document.addEventListener('DOMContentLoaded', updateDashboardStats);

