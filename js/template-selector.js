// Variáveis globais
let selectedTemplate = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeSelector();
    setupEventListeners();
});

// Inicializar seletor
function initializeSelector() {
    // Animar entrada dos templates
    animateTemplates();
    
    // Verificar se há template pré-selecionado na URL
    const urlParams = new URLSearchParams(window.location.search);
    const preselected = urlParams.get('template');
    if (preselected) {
        selectTemplate(preselected);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de seleção de template
    const selectButtons = document.querySelectorAll('.select-template-btn');
    selectButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const template = this.getAttribute('data-template');
            selectTemplate(template);
        });
    });

    // Clique no preview do template
    const templatePreviews = document.querySelectorAll('.template-preview');
    templatePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const template = this.closest('.template-option').getAttribute('data-template');
            previewTemplate(template);
        });
    });

    // Modais
    setupModalListeners();
    
    // Formulário de contato
    setupContactForm();
}

// Selecionar template
function selectTemplate(templateName) {
    selectedTemplate = templateName;
    
    // Atualizar visual dos templates
    updateTemplateSelection(templateName);
    
    // Mostrar modal de contato
    showContactModal(templateName);
}

// Atualizar seleção visual
function updateTemplateSelection(templateName) {
    const templateOptions = document.querySelectorAll('.template-option');
    
    templateOptions.forEach(option => {
        const template = option.getAttribute('data-template');
        if (template === templateName) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Visualizar template
function previewTemplate(templateName) {
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('templatePreview');
    const selectBtn = document.getElementById('selectFromPreview');
    
    // Configurar iframe
    iframe.src = `templates/${templateName}/index.html`;
    
    // Configurar botão de seleção
    selectBtn.setAttribute('data-template', templateName);
    
    // Mostrar modal
    modal.classList.add('active');
}

// Mostrar modal de contato
function showContactModal(templateName) {
    const modal = document.getElementById('contactModal');
    const templateInput = document.getElementById('selectedTemplate');
    
    // Preencher template selecionado
    templateInput.value = getTemplateName(templateName);
    
    // Mostrar modal
    modal.classList.add('active');
}

// Obter nome do template
function getTemplateName(templateKey) {
    const names = {
        romantico: 'Template Romântico',
        amizade: 'Template Amizade',
        profissional: 'Template Profissional'
    };
    return names[templateKey] || templateKey;
}

// Configurar listeners dos modais
function setupModalListeners() {
    // Modal de preview
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const selectFromPreview = document.getElementById('selectFromPreview');

    closePreview.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    closePreviewBtn.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    selectFromPreview.addEventListener('click', function() {
        const template = this.getAttribute('data-template');
        previewModal.classList.remove('active');
        selectTemplate(template);
    });

    // Modal de contato
    const contactModal = document.getElementById('contactModal');
    const closeContact = document.getElementById('closeContact');
    const cancelContact = document.getElementById('cancelContact');

    closeContact.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });

    cancelContact.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });

    // Fechar modal clicando fora
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });

    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });
}

// Configurar formulário de contato
function setupContactForm() {
    const submitBtn = document.getElementById('submitContact');
    const form = document.getElementById('contactForm');

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        submitContactForm();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });
}

// Enviar formulário de contato
function submitContactForm() {
    const formData = {
        name: document.getElementById('clientName').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        template: selectedTemplate,
        eventType: document.getElementById('eventType').value.trim(),
        message: document.getElementById('clientMessage').value.trim(),
        agreeTerms: document.getElementById('agreeTerms').checked
    };

    // Validar dados
    if (!validateForm(formData)) {
        return;
    }

    // Mostrar loading
    const submitBtn = document.getElementById('submitContact');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simular envio (em produção, enviaria para servidor)
    setTimeout(() => {
        // Sucesso
        showSuccessMessage();
        
        // Resetar formulário
        document.getElementById('contactForm').reset();
        
        // Fechar modal
        document.getElementById('contactModal').classList.remove('active');
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirecionar ou mostrar próximos passos
        showNextSteps(formData);
    }, 2000);
}

// Validar formulário
function validateForm(data) {
    // Nome obrigatório
    if (!data.name) {
        showNotification('Por favor, preencha seu nome', 'error');
        document.getElementById('clientName').focus();
        return false;
    }

    // Email obrigatório e válido
    if (!data.email) {
        showNotification('Por favor, preencha seu email', 'error');
        document.getElementById('clientEmail').focus();
        return false;
    }

    if (!isValidEmail(data.email)) {
        showNotification('Por favor, insira um email válido', 'error');
        document.getElementById('clientEmail').focus();
        return false;
    }

    // Termos obrigatórios
    if (!data.agreeTerms) {
        showNotification('Por favor, aceite os termos de uso', 'error');
        return false;
    }

    return true;
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar mensagem de sucesso
function showSuccessMessage() {
    showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
}

// Mostrar próximos passos
function showNextSteps(formData) {
    // Criar modal de próximos passos
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Solicitação Enviada!</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="success-message">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h4>Obrigado, ${formData.name}!</h4>
                    <p>Sua solicitação para o <strong>${getTemplateName(formData.template)}</strong> foi recebida.</p>
                </div>
                <div style="margin-top: 2rem;">
                    <h4>Próximos passos:</h4>
                    <ol style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Nossa equipe analisará sua solicitação</li>
                        <li>Entraremos em contato em até 24 horas</li>
                        <li>Definiremos os detalhes da sua lembrança digital</li>
                        <li>Criaremos seu template personalizado</li>
                    </ol>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                    <p><strong>Email de confirmação:</strong> ${formData.email}</p>
                    <p><strong>Template escolhido:</strong> ${getTemplateName(formData.template)}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="this.closest('.modal').remove(); window.location.href='index.html'">
                    <i class="fas fa-home"></i>
                    Voltar ao Início
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Animar templates
function animateTemplates() {
    const templates = document.querySelectorAll('.template-option');
    
    templates.forEach((template, index) => {
        template.style.opacity = '0';
        template.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            template.style.transition = 'all 0.6s ease';
            template.style.opacity = '1';
            template.style.transform = 'translateY(0)';
        }, index * 200);
    });
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
    
    .template-option.selected {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
    
    .template-option.selected .template-overlay {
        opacity: 1;
    }
    
    .template-option.selected .template-bg {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Função para compartilhar template
function shareTemplate(templateName) {
    const url = `${window.location.origin}/template-selector.html?template=${templateName}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Template ${getTemplateName(templateName)} - Memória Digital`,
            text: 'Confira este template incrível para lembranças digitais!',
            url: url
        });
    } else {
        // Fallback para copiar URL
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copiado para a área de transferência!', 'success');
        });
    }
}

// Função para favoritar template
function favoriteTemplate(templateName) {
    const favorites = JSON.parse(localStorage.getItem('favoriteTemplates') || '[]');
    
    if (favorites.includes(templateName)) {
        // Remover dos favoritos
        const index = favorites.indexOf(templateName);
        favorites.splice(index, 1);
        showNotification('Template removido dos favoritos', 'info');
    } else {
        // Adicionar aos favoritos
        favorites.push(templateName);
        showNotification('Template adicionado aos favoritos!', 'success');
    }
    
    localStorage.setItem('favoriteTemplates', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// Atualizar botões de favorito
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favoriteTemplates') || '[]');
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const template = btn.getAttribute('data-template');
        const icon = btn.querySelector('i');
        
        if (favorites.includes(template)) {
            icon.className = 'fas fa-heart';
            btn.classList.add('favorited');
        } else {
            icon.className = 'far fa-heart';
            btn.classList.remove('favorited');
        }
    });
}

// Função para filtrar templates
function filterTemplates(category) {
    const templates = document.querySelectorAll('.template-option');
    
    templates.forEach(template => {
        const templateCategory = template.getAttribute('data-template');
        
        if (category === 'all' || templateCategory === category) {
            template.style.display = 'block';
        } else {
            template.style.display = 'none';
        }
    });
}

// Função para buscar templates
function searchTemplates(query) {
    const templates = document.querySelectorAll('.template-option');
    const searchTerm = query.toLowerCase();
    
    templates.forEach(template => {
        const title = template.querySelector('.template-title').textContent.toLowerCase();
        const description = template.querySelector('.template-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            template.style.display = 'block';
        } else {
            template.style.display = 'none';
        }
    });
}

// Inicializar favoritos ao carregar
document.addEventListener('DOMContentLoaded', updateFavoriteButtons);

