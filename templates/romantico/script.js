// Variáveis globais
let editMode = false;
let currentEditingElement = null;
let originalContent = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplate();
    setupEventListeners();
    loadSavedContent();
});

// Inicializar template
function initializeTemplate() {
    // Animações de entrada
    animateElements();
    
    // Configurar música de fundo
    setupBackgroundMusic();
    
    // Salvar conteúdo original
    saveOriginalContent();
}

// Configurar event listeners
function setupEventListeners() {
    // Controle de música
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
    });

    // Controles de edição
    const toggleEdit = document.getElementById('toggleEdit');
    const saveChanges = document.getElementById('saveChanges');
    const imageUpload = document.getElementById('imageUpload');
    const musicUpload = document.getElementById('musicUpload');

    if (toggleEdit) {
        toggleEdit.addEventListener('click', toggleEditMode);
    }

    if (saveChanges) {
        saveChanges.addEventListener('click', saveAllChanges);
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    if (musicUpload) {
        musicUpload.addEventListener('change', handleMusicUpload);
    }

    // Event listeners para elementos editáveis
    setupEditableElements();
}

// Configurar música de fundo
function setupBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    // Tentar reproduzir automaticamente (pode ser bloqueado pelo navegador)
    backgroundMusic.volume = 0.3;
    
    // Reproduzir quando o usuário interagir com a página
    document.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => {
                console.log('Autoplay bloqueado pelo navegador');
            });
        }
    }, { once: true });
}

// Salvar conteúdo original
function saveOriginalContent() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field');
        originalContent[field] = element.innerHTML || element.textContent;
    });
}

// Alternar modo de edição
function toggleEditMode() {
    editMode = !editMode;
    const body = document.body;
    const toggleBtn = document.getElementById('toggleEdit');
    
    if (editMode) {
        body.classList.add('edit-mode');
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
        showEditMessage();
    } else {
        body.classList.remove('edit-mode');
        toggleBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
        restoreOriginalContent();
    }
}

// Configurar elementos editáveis
function setupEditableElements() {
    const editableTexts = document.querySelectorAll('.editable:not(.editable-image)');
    const editableImages = document.querySelectorAll('.editable-image');

    // Textos editáveis
    editableTexts.forEach(element => {
        element.addEventListener('click', function() {
            if (editMode) {
                makeTextEditable(this);
            }
        });
    });

    // Imagens editáveis
    editableImages.forEach(element => {
        element.addEventListener('click', function() {
            if (editMode) {
                selectImageToEdit(this);
            }
        });
    });
}

// Tornar texto editável
function makeTextEditable(element) {
    if (currentEditingElement) {
        finishTextEditing(currentEditingElement);
    }

    currentEditingElement = element;
    const currentText = element.textContent;
    
    // Criar input ou textarea baseado no tamanho do conteúdo
    const isLongText = currentText.length > 100;
    const input = document.createElement(isLongText ? 'textarea' : 'input');
    
    input.value = currentText;
    input.style.cssText = `
        width: 100%;
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid #d81b60;
        border-radius: 5px;
        padding: 8px;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        resize: ${isLongText ? 'vertical' : 'none'};
        min-height: ${isLongText ? '100px' : 'auto'};
    `;

    // Substituir elemento temporariamente
    element.style.display = 'none';
    element.parentNode.insertBefore(input, element.nextSibling);
    input.focus();
    input.select();

    // Event listeners para salvar
    input.addEventListener('blur', () => finishTextEditing(element, input));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLongText) {
            e.preventDefault();
            finishTextEditing(element, input);
        }
        if (e.key === 'Escape') {
            finishTextEditing(element, input, true);
        }
    });
}

// Finalizar edição de texto
function finishTextEditing(element, input = null, cancel = false) {
    if (!input) {
        input = element.nextSibling;
    }

    if (input && input.tagName && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
        if (!cancel) {
            element.textContent = input.value;
        }
        input.remove();
        element.style.display = '';
    }

    currentEditingElement = null;
}

// Selecionar imagem para editar
function selectImageToEdit(imageElement) {
    const imageUpload = document.getElementById('imageUpload');
    imageUpload.setAttribute('data-target', imageElement.getAttribute('data-field'));
    imageUpload.click();
}

// Manipular upload de imagem
function handleImageUpload(event) {
    const file = event.target.files[0];
    const targetField = event.target.getAttribute('data-target');
    
    if (file && targetField) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const targetImage = document.querySelector(`[data-field="${targetField}"]`);
            if (targetImage) {
                targetImage.src = e.target.result;
                showSuccessMessage('Imagem atualizada com sucesso!');
            }
        };
        reader.readAsDataURL(file);
    }
}

// Manipular upload de música
function handleMusicUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const backgroundMusic = document.getElementById('backgroundMusic');
            backgroundMusic.src = e.target.result;
            backgroundMusic.load();
            showSuccessMessage('Música de fundo atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    }
}

// Salvar todas as alterações
function saveAllChanges() {
    const data = {};
    const editableElements = document.querySelectorAll('.editable');
    
    editableElements.forEach(element => {
        const field = element.getAttribute('data-field');
        if (element.classList.contains('editable-image')) {
            data[field] = element.src;
        } else {
            data[field] = element.textContent;
        }
    });

    // Salvar no localStorage
    localStorage.setItem('romanticTemplate', JSON.stringify(data));
    
    // Sair do modo de edição
    editMode = false;
    document.body.classList.remove('edit-mode');
    document.getElementById('toggleEdit').innerHTML = '<i class="fas fa-edit"></i> Editar';
    
    showSuccessMessage('Alterações salvas com sucesso!');
}

// Carregar conteúdo salvo
function loadSavedContent() {
    const savedData = localStorage.getItem('romanticTemplate');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(field => {
            const element = document.querySelector(`[data-field="${field}"]`);
            if (element) {
                if (element.classList.contains('editable-image')) {
                    element.src = data[field];
                } else {
                    element.textContent = data[field];
                }
            }
        });
    }
}

// Restaurar conteúdo original
function restoreOriginalContent() {
    Object.keys(originalContent).forEach(field => {
        const element = document.querySelector(`[data-field="${field}"]`);
        if (element && !element.classList.contains('editable-image')) {
            element.innerHTML = originalContent[field];
        }
    });
}

// Animações de elementos
function animateElements() {
    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.photo-item, .message-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Mostrar mensagem de edição
function showEditMessage() {
    showSuccessMessage('Modo de edição ativado! Clique nos textos e imagens para editar.');
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Função para mostrar controles de edição (para administradores)
function showEditControls() {
    const editControls = document.getElementById('editControls');
    if (editControls) {
        editControls.style.display = 'flex';
    }
}

// Função para ocultar controles de edição
function hideEditControls() {
    const editControls = document.getElementById('editControls');
    if (editControls) {
        editControls.style.display = 'none';
    }
}

// Verificar se é administrador (para mostrar controles)
function checkAdminAccess() {
    // Esta função pode ser expandida para verificar autenticação
    const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
    if (isAdmin) {
        showEditControls();
    }
}

// Verificar acesso de administrador na inicialização
document.addEventListener('DOMContentLoaded', checkAdminAccess);

