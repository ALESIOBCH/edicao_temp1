// Drag and Drop Template Editor
class DragDropTemplateEditor {
    constructor() {
        this.currentTemplate = 'romantico';
        this.selectedElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.elementCounter = 0;
        
        this.templateData = {
            title: '',
            subtitle: '',
            message: '',
            images: [],
            videos: [],
            music: null,
            colors: {
                background: '#ff6b9d',
                title: '#ffffff',
                text: '#333333'
            },
            fonts: {
                title: 'Dancing Script',
                text: 'Poppins'
            },
            sizes: {
                title: 48,
                text: 16
            },
            elements: [] // Store all draggable elements
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTemplate();
        this.setupColorSync();
        this.setupRangeSync();
        this.addDragDropControls();
        this.setupPreviewCommunication();
    }

    addDragDropControls() {
        // Create drag and drop control panel
        const sidebar = document.querySelector('.editor-sidebar .sidebar-content');
        
        // Add drag and drop section
        const dragDropSection = document.createElement('div');
        dragDropSection.className = 'editor-section';
        dragDropSection.innerHTML = `
            <h3 class="section-title">
                <i class="fas fa-arrows-alt"></i>
                Elementos Arrastáveis
            </h3>
            <div class="drag-drop-controls">
                <button class="btn-primary add-element-btn" data-type="text">
                    <i class="fas fa-font"></i>
                    Adicionar Texto
                </button>
                <button class="btn-primary add-element-btn" data-type="image">
                    <i class="fas fa-image"></i>
                    Adicionar Imagem
                </button>
                <button class="btn-primary add-element-btn" data-type="video">
                    <i class="fas fa-video"></i>
                    Adicionar Vídeo
                </button>
            </div>
            <div class="element-properties" id="elementProperties" style="display: none;">
                <h4>Propriedades do Elemento</h4>
                <div class="property-controls" id="propertyControls">
                    <!-- Dynamic property controls will be added here -->
                </div>
            </div>
        `;
        
        // Insert after the template selection section
        const templateSection = document.querySelector('.editor-section');
        templateSection.parentNode.insertBefore(dragDropSection, templateSection.nextSibling);
        
        // Add styles for drag and drop
        this.addDragDropStyles();
        
        // Bind drag and drop events
        this.bindDragDropEvents();
    }

    addDragDropStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .drag-drop-controls {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .add-element-btn {
                padding: 12px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s;
            }
            
            .add-element-btn:hover {
                background: #2563eb;
                transform: translateY(-1px);
            }
            
            .draggable-element {
                position: absolute;
                cursor: move;
                border: 2px dashed transparent;
                transition: border-color 0.2s;
                min-width: 100px;
                min-height: 50px;
                z-index: 10;
            }
            
            .draggable-element:hover {
                border-color: #3b82f6;
            }
            
            .draggable-element.selected {
                border-color: #ef4444;
                border-style: solid;
            }
            
            .draggable-element.dragging {
                opacity: 0.7;
                z-index: 1000;
            }
            
            .element-controls {
                position: absolute;
                top: -30px;
                right: 0;
                display: flex;
                gap: 5px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            
            .draggable-element:hover .element-controls,
            .draggable-element.selected .element-controls {
                opacity: 1;
            }
            
            .element-control-btn {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            
            .edit-btn {
                background: #3b82f6;
            }
            
            .delete-btn {
                background: #ef4444;
            }
            
            .resize-handle {
                position: absolute;
                bottom: -5px;
                right: -5px;
                width: 10px;
                height: 10px;
                background: #3b82f6;
                cursor: se-resize;
                border-radius: 2px;
            }
            
            .element-properties {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 15px;
                margin-top: 15px;
            }
            
            .property-group {
                margin-bottom: 15px;
            }
            
            .property-group:last-child {
                margin-bottom: 0;
            }
            
            .property-label {
                display: block;
                font-size: 12px;
                font-weight: 500;
                color: #374151;
                margin-bottom: 5px;
            }
            
            .property-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .property-range {
                width: 100%;
                margin: 5px 0;
            }
            
            .preview-container {
                position: relative;
                overflow: visible;
            }
            
            .preview-container iframe {
                pointer-events: none;
            }
            
            .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 5;
                pointer-events: none;
            }
            
            .drop-zone {
                position: absolute;
                border: 2px dashed #3b82f6;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 8px;
                display: none;
                align-items: center;
                justify-content: center;
                color: #3b82f6;
                font-weight: 500;
                z-index: 15;
            }
            
            .drop-zone.active {
                display: flex;
            }
            
            @media (max-width: 768px) {
                .draggable-element {
                    min-width: 80px;
                    min-height: 40px;
                }
                
                .element-controls {
                    top: -25px;
                }
                
                .element-control-btn {
                    width: 20px;
                    height: 20px;
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindDragDropEvents() {
        // Add element buttons
        document.querySelectorAll('.add-element-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.addElement(type);
            });
        });
        
        // Preview container events for dropping
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            // Create overlay for drag and drop
            const overlay = document.createElement('div');
            overlay.className = 'preview-overlay';
            previewContainer.appendChild(overlay);
            
            // Create drop zone
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.textContent = 'Solte o elemento aqui';
            previewContainer.appendChild(dropZone);
            
            overlay.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('active');
            });
            
            overlay.addEventListener('dragleave', (e) => {
                if (!previewContainer.contains(e.relatedTarget)) {
                    dropZone.classList.remove('active');
                }
            });
            
            overlay.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('active');
                this.handleElementDrop(e);
            });
        }
    }

    addElement(type) {
        this.elementCounter++;
        const elementId = `element_${type}_${this.elementCounter}`;
        
        const element = {
            id: elementId,
            type: type,
            content: this.getDefaultContent(type),
            position: { x: 50, y: 50 + (this.elementCounter * 60) },
            size: { width: 200, height: 100 },
            style: this.getDefaultStyle(type),
            properties: this.getDefaultProperties(type)
        };
        
        this.templateData.elements.push(element);
        this.createDraggableElement(element);
        this.updatePreview();
    }

    getDefaultContent(type) {
        switch (type) {
            case 'text':
                return `Texto ${this.elementCounter}`;
            case 'image':
                return null; // Will be set when image is uploaded
            case 'video':
                return null; // Will be set when video is uploaded
            default:
                return '';
        }
    }

    getDefaultStyle(type) {
        switch (type) {
            case 'text':
                return {
                    fontSize: '16px',
                    fontFamily: 'Poppins',
                    color: '#333333',
                    fontWeight: 'normal',
                    textAlign: 'left'
                };
            case 'image':
                return {
                    borderRadius: '8px',
                    objectFit: 'cover'
                };
            case 'video':
                return {
                    borderRadius: '8px'
                };
            default:
                return {};
        }
    }

    getDefaultProperties(type) {
        switch (type) {
            case 'text':
                return {
                    editable: true,
                    resizable: true,
                    draggable: true
                };
            case 'image':
                return {
                    editable: false,
                    resizable: true,
                    draggable: true,
                    uploadable: true
                };
            case 'video':
                return {
                    editable: false,
                    resizable: true,
                    draggable: true,
                    uploadable: true,
                    controls: true
                };
            default:
                return {
                    editable: false,
                    resizable: true,
                    draggable: true
                };
        }
    }

    createDraggableElement(element) {
        const previewContainer = document.querySelector('.preview-container');
        const draggableEl = document.createElement('div');
        draggableEl.className = 'draggable-element';
        draggableEl.dataset.elementId = element.id;
        draggableEl.style.left = element.position.x + 'px';
        draggableEl.style.top = element.position.y + 'px';
        draggableEl.style.width = element.size.width + 'px';
        draggableEl.style.height = element.size.height + 'px';
        
        // Create element content
        let content = '';
        switch (element.type) {
            case 'text':
                content = `<div class="text-content" style="font-size: ${element.style.fontSize}; font-family: ${element.style.fontFamily}; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${element.style.textAlign};">${element.content}</div>`;
                break;
            case 'image':
                content = element.content ? 
                    `<img src="${element.content}" style="width: 100%; height: 100%; object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius};" alt="Imagem">` :
                    `<div style="width: 100%; height: 100%; background: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; border-radius: ${element.style.borderRadius};"><i class="fas fa-image"></i> Clique para adicionar imagem</div>`;
                break;
            case 'video':
                content = element.content ?
                    `<video src="${element.content}" style="width: 100%; height: 100%; border-radius: ${element.style.borderRadius};" ${element.properties.controls ? 'controls' : ''}></video>` :
                    `<div style="width: 100%; height: 100%; background: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; border-radius: ${element.style.borderRadius};"><i class="fas fa-video"></i> Clique para adicionar vídeo</div>`;
                break;
        }
        
        draggableEl.innerHTML = `
            ${content}
            <div class="element-controls">
                <button class="element-control-btn edit-btn" onclick="dragDropEditor.editElement('${element.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="element-control-btn delete-btn" onclick="dragDropEditor.deleteElement('${element.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="resize-handle"></div>
        `;
        
        // Add event listeners
        this.addElementEventListeners(draggableEl, element);
        
        previewContainer.appendChild(draggableEl);
    }

    addElementEventListeners(draggableEl, element) {
        // Click to select
        draggableEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element.id);
        });
        
        // Double click to edit (for text elements)
        if (element.type === 'text') {
            draggableEl.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.editElementInline(element.id);
            });
        }
        
        // File upload (for image/video elements)
        if (element.type === 'image' || element.type === 'video') {
            draggableEl.addEventListener('click', (e) => {
                if (!element.content) {
                    e.stopPropagation();
                    this.uploadFile(element.id, element.type);
                }
            });
        }
        
        // Drag functionality
        draggableEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                this.startResize(e, element.id);
            } else if (!e.target.closest('.element-controls')) {
                this.startDrag(e, element.id);
            }
        });
    }

    startDrag(e, elementId) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedElement = elementId;
        
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            draggableEl.classList.add('dragging');
            
            const rect = draggableEl.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            const handleMouseMove = (e) => {
                if (this.isDragging) {
                    const previewContainer = document.querySelector('.preview-container');
                    const containerRect = previewContainer.getBoundingClientRect();
                    
                    const newX = e.clientX - containerRect.left - this.dragOffset.x;
                    const newY = e.clientY - containerRect.top - this.dragOffset.y;
                    
                    // Constrain to container bounds
                    const maxX = containerRect.width - element.size.width;
                    const maxY = containerRect.height - element.size.height;
                    
                    element.position.x = Math.max(0, Math.min(newX, maxX));
                    element.position.y = Math.max(0, Math.min(newY, maxY));
                    
                    draggableEl.style.left = element.position.x + 'px';
                    draggableEl.style.top = element.position.y + 'px';
                }
            };
            
            const handleMouseUp = () => {
                this.isDragging = false;
                draggableEl.classList.remove('dragging');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                this.updatePreview();
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    startResize(e, elementId) {
        e.preventDefault();
        e.stopPropagation();
        
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.size.width;
            const startHeight = element.size.height;
            
            const handleMouseMove = (e) => {
                const newWidth = Math.max(50, startWidth + (e.clientX - startX));
                const newHeight = Math.max(30, startHeight + (e.clientY - startY));
                
                element.size.width = newWidth;
                element.size.height = newHeight;
                
                draggableEl.style.width = newWidth + 'px';
                draggableEl.style.height = newHeight + 'px';
            };
            
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                this.updatePreview();
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    selectElement(elementId) {
        // Remove previous selection
        document.querySelectorAll('.draggable-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new element
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        if (draggableEl) {
            draggableEl.classList.add('selected');
            this.selectedElement = elementId;
            this.showElementProperties(elementId);
        }
    }

    showElementProperties(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (!element) return;
        
        const propertiesPanel = document.getElementById('elementProperties');
        const controlsContainer = document.getElementById('propertyControls');
        
        let controls = '';
        
        switch (element.type) {
            case 'text':
                controls = `
                    <div class="property-group">
                        <label class="property-label">Conteúdo</label>
                        <input type="text" class="property-input" value="${element.content}" onchange="dragDropEditor.updateElementProperty('${elementId}', 'content', this.value)">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Tamanho da Fonte</label>
                        <input type="range" class="property-range" min="12" max="72" value="${parseInt(element.style.fontSize)}" onchange="dragDropEditor.updateElementStyle('${elementId}', 'fontSize', this.value + 'px')">
                        <span>${element.style.fontSize}</span>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Família da Fonte</label>
                        <select class="property-input" onchange="dragDropEditor.updateElementStyle('${elementId}', 'fontFamily', this.value)">
                            <option value="Poppins" ${element.style.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins</option>
                            <option value="Dancing Script" ${element.style.fontFamily === 'Dancing Script' ? 'selected' : ''}>Dancing Script</option>
                            <option value="Inter" ${element.style.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                            <option value="Playfair Display" ${element.style.fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Cor</label>
                        <input type="color" class="property-input" value="${element.style.color}" onchange="dragDropEditor.updateElementStyle('${elementId}', 'color', this.value)">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Alinhamento</label>
                        <select class="property-input" onchange="dragDropEditor.updateElementStyle('${elementId}', 'textAlign', this.value)">
                            <option value="left" ${element.style.textAlign === 'left' ? 'selected' : ''}>Esquerda</option>
                            <option value="center" ${element.style.textAlign === 'center' ? 'selected' : ''}>Centro</option>
                            <option value="right" ${element.style.textAlign === 'right' ? 'selected' : ''}>Direita</option>
                        </select>
                    </div>
                `;
                break;
            case 'image':
                controls = `
                    <div class="property-group">
                        <label class="property-label">Imagem</label>
                        <button class="property-input" onclick="dragDropEditor.uploadFile('${elementId}', 'image')">
                            ${element.content ? 'Alterar Imagem' : 'Adicionar Imagem'}
                        </button>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Ajuste</label>
                        <select class="property-input" onchange="dragDropEditor.updateElementStyle('${elementId}', 'objectFit', this.value)">
                            <option value="cover" ${element.style.objectFit === 'cover' ? 'selected' : ''}>Cobrir</option>
                            <option value="contain" ${element.style.objectFit === 'contain' ? 'selected' : ''}>Conter</option>
                            <option value="fill" ${element.style.objectFit === 'fill' ? 'selected' : ''}>Preencher</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Borda Arredondada</label>
                        <input type="range" class="property-range" min="0" max="50" value="${parseInt(element.style.borderRadius)}" onchange="dragDropEditor.updateElementStyle('${elementId}', 'borderRadius', this.value + 'px')">
                        <span>${element.style.borderRadius}</span>
                    </div>
                `;
                break;
            case 'video':
                controls = `
                    <div class="property-group">
                        <label class="property-label">Vídeo</label>
                        <button class="property-input" onclick="dragDropEditor.uploadFile('${elementId}', 'video')">
                            ${element.content ? 'Alterar Vídeo' : 'Adicionar Vídeo'}
                        </button>
                    </div>
                    <div class="property-group">
                        <label class="property-label">Controles</label>
                        <input type="checkbox" ${element.properties.controls ? 'checked' : ''} onchange="dragDropEditor.updateElementProperty('${elementId}', 'controls', this.checked)">
                    </div>
                    <div class="property-group">
                        <label class="property-label">Borda Arredondada</label>
                        <input type="range" class="property-range" min="0" max="50" value="${parseInt(element.style.borderRadius)}" onchange="dragDropEditor.updateElementStyle('${elementId}', 'borderRadius', this.value + 'px')">
                        <span>${element.style.borderRadius}</span>
                    </div>
                `;
                break;
        }
        
        controlsContainer.innerHTML = controls;
        propertiesPanel.style.display = 'block';
    }

    updateElementProperty(elementId, property, value) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (element) {
            if (property === 'content') {
                element.content = value;
            } else {
                element.properties[property] = value;
            }
            this.refreshElement(elementId);
            this.updatePreview();
        }
    }

    updateElementStyle(elementId, styleProperty, value) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (element) {
            element.style[styleProperty] = value;
            this.refreshElement(elementId);
            this.updatePreview();
            
            // Update the property panel display
            const rangeSpan = document.querySelector(`#propertyControls input[onchange*="${styleProperty}"] + span`);
            if (rangeSpan) {
                rangeSpan.textContent = value;
            }
        }
    }

    refreshElement(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            // Remove old content
            const controls = draggableEl.querySelector('.element-controls');
            const resizeHandle = draggableEl.querySelector('.resize-handle');
            
            // Create new content
            let content = '';
            switch (element.type) {
                case 'text':
                    content = `<div class="text-content" style="font-size: ${element.style.fontSize}; font-family: ${element.style.fontFamily}; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${element.style.textAlign};">${element.content}</div>`;
                    break;
                case 'image':
                    content = element.content ? 
                        `<img src="${element.content}" style="width: 100%; height: 100%; object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius};" alt="Imagem">` :
                        `<div style="width: 100%; height: 100%; background: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; border-radius: ${element.style.borderRadius};"><i class="fas fa-image"></i> Clique para adicionar imagem</div>`;
                    break;
                case 'video':
                    content = element.content ?
                        `<video src="${element.content}" style="width: 100%; height: 100%; border-radius: ${element.style.borderRadius};" ${element.properties.controls ? 'controls' : ''}></video>` :
                        `<div style="width: 100%; height: 100%; background: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; border-radius: ${element.style.borderRadius};"><i class="fas fa-video"></i> Clique para adicionar vídeo</div>`;
                    break;
            }
            
            // Update content
            draggableEl.innerHTML = content;
            draggableEl.appendChild(controls);
            draggableEl.appendChild(resizeHandle);
        }
    }

    uploadFile(elementId, type) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'image' ? 'image/*' : 'video/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.updateElementProperty(elementId, 'content', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    editElement(elementId) {
        this.selectElement(elementId);
    }

    editElementInline(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && element.type === 'text' && draggableEl) {
            const textContent = draggableEl.querySelector('.text-content');
            if (textContent) {
                const currentText = element.content;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.style.cssText = textContent.style.cssText;
                input.style.border = '2px solid #3b82f6';
                input.style.background = 'white';
                
                textContent.replaceWith(input);
                input.focus();
                input.select();
                
                const saveEdit = () => {
                    element.content = input.value;
                    this.refreshElement(elementId);
                    this.updatePreview();
                };
                
                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            }
        }
    }

    deleteElement(elementId) {
        if (confirm('Tem certeza que deseja excluir este elemento?')) {
            // Remove from data
            this.templateData.elements = this.templateData.elements.filter(el => el.id !== elementId);
            
            // Remove from DOM
            const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
            if (draggableEl) {
                draggableEl.remove();
            }
            
            // Hide properties panel if this element was selected
            if (this.selectedElement === elementId) {
                document.getElementById('elementProperties').style.display = 'none';
                this.selectedElement = null;
            }
            
            this.updatePreview();
        }
    }

    // Existing methods from the original editor
    bindEvents() {
        // Template selection
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.currentTemplate = e.target.value;
            this.loadTemplate();
        });

        // Text inputs
        document.getElementById('mainTitle').addEventListener('input', (e) => {
            this.templateData.title = e.target.value;
            this.updatePreview();
        });

        document.getElementById('subtitle').addEventListener('input', (e) => {
            this.templateData.subtitle = e.target.value;
            this.updatePreview();
        });

        document.getElementById('mainMessage').addEventListener('input', (e) => {
            this.templateData.message = e.target.value;
            this.updatePreview();
        });

        // Typography controls
        document.getElementById('titleFont').addEventListener('change', (e) => {
            this.templateData.fonts.title = e.target.value;
            this.updatePreview();
        });

        document.getElementById('textFont').addEventListener('change', (e) => {
            this.templateData.fonts.text = e.target.value;
            this.updatePreview();
        });

        document.getElementById('titleSize').addEventListener('input', (e) => {
            this.templateData.sizes.title = e.target.value;
            this.updatePreview();
        });

        document.getElementById('textSize').addEventListener('input', (e) => {
            this.templateData.sizes.text = e.target.value;
            this.updatePreview();
        });

        // Color controls
        document.getElementById('backgroundColor').addEventListener('change', (e) => {
            this.templateData.colors.background = e.target.value;
            this.updatePreview();
        });

        document.getElementById('titleColor').addEventListener('change', (e) => {
            this.templateData.colors.title = e.target.value;
            this.updatePreview();
        });

        document.getElementById('textColor').addEventListener('change', (e) => {
            this.templateData.colors.text = e.target.value;
            this.updatePreview();
        });

        // Action buttons
        document.getElementById('downloadTemplate').addEventListener('click', () => {
            this.showDownloadModal();
        });

        // Preview controls
        document.getElementById('previewDesktop').addEventListener('click', () => {
            this.setPreviewMode('desktop');
        });

        document.getElementById('previewTablet').addEventListener('click', () => {
            this.setPreviewMode('tablet');
        });

        document.getElementById('previewMobile').addEventListener('click', () => {
            this.setPreviewMode('mobile');
        });

        // Click outside to deselect
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.draggable-element') && !e.target.closest('.element-properties')) {
                document.querySelectorAll('.draggable-element.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                document.getElementById('elementProperties').style.display = 'none';
                this.selectedElement = null;
            }
        });

        // Modal controls
        this.setupModals();
    }

    setupColorSync() {
        // Sync color picker with text input
        const colorInputs = [
            { picker: 'backgroundColor', text: 'backgroundColorText' },
            { picker: 'titleColor', text: 'titleColorText' },
            { picker: 'textColor', text: 'textColorText' }
        ];

        colorInputs.forEach(({ picker, text }) => {
            const pickerEl = document.getElementById(picker);
            const textEl = document.getElementById(text);

            if (pickerEl && textEl) {
                pickerEl.addEventListener('change', () => {
                    textEl.value = pickerEl.value;
                });

                textEl.addEventListener('input', () => {
                    if (this.isValidColor(textEl.value)) {
                        pickerEl.value = textEl.value;
                        pickerEl.dispatchEvent(new Event('change'));
                    }
                });
            }
        });
    }

    setupRangeSync() {
        // Sync range inputs with value display
        const ranges = [
            { range: 'titleSize', value: 'titleSizeValue', suffix: 'px' },
            { range: 'textSize', value: 'textSizeValue', suffix: 'px' }
        ];

        ranges.forEach(({ range, value, suffix }) => {
            const rangeEl = document.getElementById(range);
            const valueEl = document.getElementById(value);

            if (rangeEl && valueEl) {
                rangeEl.addEventListener('input', () => {
                    valueEl.textContent = rangeEl.value + suffix;
                });
            }
        });
    }

    loadTemplate() {
        const templatePath = `templates/${this.currentTemplate}/index.html`;
        document.getElementById('previewFrame').src = templatePath;
        
        // Clear existing draggable elements
        document.querySelectorAll('.draggable-element').forEach(el => el.remove());
        this.templateData.elements = [];
        document.getElementById('elementProperties').style.display = 'none';
        
        // Load template-specific data
        this.loadTemplateData();
    }

    loadTemplateData() {
        // Reset template data
        this.templateData = {
            title: this.getDefaultTitle(),
            subtitle: this.getDefaultSubtitle(),
            message: this.getDefaultMessage(),
            images: [],
            videos: [],
            music: null,
            colors: this.getDefaultColors(),
            fonts: this.getDefaultFonts(),
            sizes: this.getDefaultSizes(),
            elements: []
        };

        // Update form fields
        this.updateFormFields();
    }

    getDefaultTitle() {
        const titles = {
            romantico: 'Nossa História de Amor',
            amizade: 'Celebrando Nossa Amizade',
            profissional: 'Reconhecimento Profissional'
        };
        return titles[this.currentTemplate] || '';
    }

    getDefaultSubtitle() {
        const subtitles = {
            romantico: 'Uma lembrança especial para você',
            amizade: 'Momentos inesquecíveis juntos',
            profissional: 'Parabéns pelo seu excelente trabalho'
        };
        return subtitles[this.currentTemplate] || '';
    }

    getDefaultMessage() {
        const messages = {
            romantico: 'Meu amor, cada dia ao seu lado é uma nova página em nossa história de amor...',
            amizade: 'Amigo, você é uma das pessoas mais especiais da minha vida...',
            profissional: 'Seu dedicação e profissionalismo são exemplares...'
        };
        return messages[this.currentTemplate] || '';
    }

    getDefaultColors() {
        const colors = {
            romantico: { background: '#ff6b9d', title: '#ffffff', text: '#333333' },
            amizade: { background: '#4ade80', title: '#ffffff', text: '#1f2937' },
            profissional: { background: '#3b82f6', title: '#ffffff', text: '#1e293b' }
        };
        return colors[this.currentTemplate] || { background: '#ff6b9d', title: '#ffffff', text: '#333333' };
    }

    getDefaultFonts() {
        return {
            title: 'Dancing Script',
            text: 'Poppins'
        };
    }

    getDefaultSizes() {
        return {
            title: 48,
            text: 16
        };
    }

    updateFormFields() {
        document.getElementById('mainTitle').value = this.templateData.title;
        document.getElementById('subtitle').value = this.templateData.subtitle;
        document.getElementById('mainMessage').value = this.templateData.message;
        
        document.getElementById('titleFont').value = this.templateData.fonts.title;
        document.getElementById('textFont').value = this.templateData.fonts.text;
        
        document.getElementById('titleSize').value = this.templateData.sizes.title;
        document.getElementById('textSize').value = this.templateData.sizes.text;
        document.getElementById('titleSizeValue').textContent = this.templateData.sizes.title + 'px';
        document.getElementById('textSizeValue').textContent = this.templateData.sizes.text + 'px';
        
        document.getElementById('backgroundColor').value = this.templateData.colors.background;
        document.getElementById('titleColor').value = this.templateData.colors.title;
        document.getElementById('textColor').value = this.templateData.colors.text;
        document.getElementById('backgroundColorText').value = this.templateData.colors.background;
        document.getElementById('titleColorText').value = this.templateData.colors.title;
        document.getElementById('textColorText').value = this.templateData.colors.text;
    }

    setupPreviewCommunication() {
        // Listen for messages from the iframe
        window.addEventListener('message', (event) => {
            if (event.data.type === 'templateReady') {
                this.updatePreview();
            }
        });
    }

    updatePreview() {
        // Send data to preview iframe
        const iframe = document.getElementById('previewFrame');
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'updateTemplate',
                data: this.templateData
            }, '*');
        }
    }

    setPreviewMode(mode) {
        const container = document.querySelector('.preview-container');
        const buttons = document.querySelectorAll('.preview-controls .btn-icon');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`preview${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
        
        container.className = `preview-container ${mode}`;
    }

    setupModals() {
        // Download modal
        if (document.getElementById('closeDownloadModal')) {
            document.getElementById('closeDownloadModal').addEventListener('click', () => {
                document.getElementById('downloadModal').classList.remove('active');
            });
        }

        if (document.getElementById('cancelDownload')) {
            document.getElementById('cancelDownload').addEventListener('click', () => {
                document.getElementById('downloadModal').classList.remove('active');
            });
        }

        if (document.getElementById('confirmDownload')) {
            document.getElementById('confirmDownload').addEventListener('click', () => {
                this.downloadTemplate();
            });
        }
    }

    showDownloadModal() {
        document.getElementById('downloadModal').classList.add('active');
        document.getElementById('downloadFileName').value = `memoria-digital-${this.currentTemplate}`;
    }

    async downloadTemplate() {
        const downloadType = document.querySelector('input[name="downloadType"]:checked').value;
        const fileName = document.getElementById('downloadFileName').value || 'memoria-digital-template';

        if (downloadType === 'html') {
            await this.downloadHTML(fileName);
        } else if (downloadType === 'pdf') {
            await this.downloadPDF(fileName);
        }

        document.getElementById('downloadModal').classList.remove('active');
    }

    async downloadHTML(fileName) {
        try {
            // Show loading state
            const downloadBtn = document.getElementById('confirmDownload');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
            downloadBtn.disabled = true;
            
            // Load JSZip
            const JSZip = await this.loadJSZip();
            
            // Create a complete HTML package with all files
            const templateHTML = await this.generateCompleteHTML();
            
            // Create a zip file with all assets
            const zipBlob = await this.createZipPackage(templateHTML, fileName, JSZip);
            
            // Download the zip file
            this.downloadBlob(zipBlob, `${fileName}.zip`);
            
            // Reset button state
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Erro ao gerar download:', error);
            alert('Erro ao gerar o download. Tente novamente.');
            
            // Reset button state
            const downloadBtn = document.getElementById('confirmDownload');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar';
            downloadBtn.disabled = false;
        }
    }

    async loadJSZip() {
        // Load JSZip from CDN if not already loaded
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                if (window.JSZip) {
                    resolve(window.JSZip);
                } else {
                    reject(new Error('JSZip failed to load'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    }

    async createZipPackage(html, fileName, JSZip) {
        const zip = new JSZip();
        
        // Add main HTML file
        zip.file('index.html', html);
        
        // Add CSS files
        try {
            const cssResponse = await fetch(`templates/${this.currentTemplate}/style.css`);
            if (cssResponse.ok) {
                const cssContent = await cssResponse.text();
                const customCSS = this.generateCustomCSS();
                zip.file('style.css', cssContent + '\n\n/* Custom Styles */\n' + customCSS);
            }
        } catch (error) {
            console.warn('Erro ao carregar CSS:', error);
        }
        
        // Add JavaScript files
        try {
            const jsResponse = await fetch(`templates/${this.currentTemplate}/script.js`);
            if (jsResponse.ok) {
                const jsContent = await jsResponse.text();
                zip.file('script.js', jsContent);
            }
        } catch (error) {
            console.warn('Erro ao carregar JavaScript:', error);
        }
        
        // Add template images
        const templateImages = ['couple-silhouette.png', 'heart-decoration.png', 'bg-romantic.jpg'];
        for (const imageName of templateImages) {
            try {
                const imageResponse = await fetch(`templates/${this.currentTemplate}/${imageName}`);
                if (imageResponse.ok) {
                    const imageBlob = await imageResponse.blob();
                    zip.file(imageName, imageBlob);
                }
            } catch (error) {
                console.warn(`Erro ao carregar imagem ${imageName}:`, error);
            }
        }
        
        // Add custom images
        let imageCounter = 1;
        for (const element of this.templateData.elements) {
            if (element.type === 'image' && element.content && element.content.startsWith('data:')) {
                try {
                    const base64Data = element.content.split(',')[1];
                    const extension = this.getFileExtensionFromDataURL(element.content);
                    zip.file(`images/custom_image_${imageCounter}.${extension}`, base64Data, { base64: true });
                    imageCounter++;
                } catch (error) {
                    console.warn('Erro ao processar imagem personalizada:', error);
                }
            }
        }
        
        // Add custom videos
        let videoCounter = 1;
        for (const element of this.templateData.elements) {
            if (element.type === 'video' && element.content && element.content.startsWith('data:')) {
                try {
                    const base64Data = element.content.split(',')[1];
                    const extension = this.getFileExtensionFromDataURL(element.content);
                    zip.file(`videos/custom_video_${videoCounter}.${extension}`, base64Data, { base64: true });
                    videoCounter++;
                } catch (error) {
                    console.warn('Erro ao processar vídeo personalizado:', error);
                }
            }
        }
        
        // Add music if exists
        if (this.templateData.music && this.templateData.music.url && this.templateData.music.url.startsWith('data:')) {
            try {
                const base64Data = this.templateData.music.url.split(',')[1];
                const extension = this.getFileExtensionFromDataURL(this.templateData.music.url);
                zip.file(`romantic-music.${extension}`, base64Data, { base64: true });
            } catch (error) {
                console.warn('Erro ao processar música:', error);
            }
        }
        
        // Generate zip blob with compression
        return await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        });
    }

    async generateCompleteHTML() {
        // Get the current template HTML
        const response = await fetch(`templates/${this.currentTemplate}/index.html`);
        let html = await response.text();
        
        // Replace placeholders with actual data
        html = html.replace(/{{title}}/g, this.templateData.title || 'Nossa História de Amor');
        html = html.replace(/{{subtitle}}/g, this.templateData.subtitle || 'Uma lembrança especial para você');
        html = html.replace(/{{message}}/g, this.templateData.message || 'Meu amor, cada dia ao seu lado é uma nova página em nossa história de amor...');

        // Update editable elements with current data
        html = this.updateEditableElementsInHTML(html);

        // Add custom elements
        let customElementsHTML = '';
        let imageCounter = 1;
        let videoCounter = 1;
        
        this.templateData.elements.forEach((element) => {
            let elementHTML = '';
            const style = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px; width: ${element.size.width}px; height: ${element.size.height}px; z-index: 10;`;
            
            switch (element.type) {
                case 'text':
                    elementHTML = `<div style="${style} font-size: ${element.style.fontSize}; font-family: '${element.style.fontFamily}', sans-serif; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; display: flex; align-items: center; justify-content: ${element.style.textAlign};">${element.content}</div>`;
                    break;
                case 'image':
                    if (element.content) {
                        const imageSrc = element.content.startsWith('data:') ? `images/custom_image_${imageCounter}.${this.getFileExtensionFromDataURL(element.content)}` : element.content;
                        elementHTML = `<img src="${imageSrc}" style="${style} object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius};" alt="Imagem personalizada">`;
                        imageCounter++;
                    }
                    break;
                case 'video':
                    if (element.content) {
                        const videoSrc = element.content.startsWith('data:') ? `videos/custom_video_${videoCounter}.${this.getFileExtensionFromDataURL(element.content)}` : element.content;
                        elementHTML = `<video src="${videoSrc}" style="${style} border-radius: ${element.style.borderRadius};" ${element.properties.controls ? 'controls' : ''}></video>`;
                        videoCounter++;
                    }
                    break;
            }
            customElementsHTML += elementHTML + '\n';
        });

        // Insert custom content before the footer
        const footerIndex = html.indexOf('<footer');
        if (footerIndex !== -1) {
            html = html.slice(0, footerIndex) + customElementsHTML + html.slice(footerIndex);
        } else {
            // If no footer found, add before closing body tag
            const bodyCloseIndex = html.lastIndexOf('</body>');
            if (bodyCloseIndex !== -1) {
                html = html.slice(0, bodyCloseIndex) + customElementsHTML + html.slice(bodyCloseIndex);
            }
        }
        
        // Update music source if custom music exists
        if (this.templateData.music && this.templateData.music.url && this.templateData.music.url.startsWith('data:')) {
            const extension = this.getFileExtensionFromDataURL(this.templateData.music.url);
            html = html.replace('src="romantic-music.mp3"', `src="romantic-music.${extension}"`);
        }
        
        return html;
    }

    updateEditableElementsInHTML(html) {
        // Update all editable elements with current values from the editor
        const editableFields = {
            'title': this.templateData.title,
            'subtitle': this.templateData.subtitle,
            'message': this.templateData.message,
            'gallery-title': 'Nossos Momentos Especiais',
            'message-title': 'Minha Mensagem Para Você',
            'timeline-title': 'Nossa Linha do Tempo',
            'signature': 'Com todo meu amor, [Seu Nome]',
            'footer': 'Feito com amor para você ❤️'
        };

        // Replace content in data-field elements
        Object.entries(editableFields).forEach(([field, value]) => {
            if (value) {
                const regex = new RegExp(`(<[^>]*data-field="${field}"[^>]*>)([^<]*)(</[^>]*>)`, 'gi');
                html = html.replace(regex, `$1${value}$3`);
            }
        });

        return html;
    }

    generateCustomCSS() {
        return `
            :root {
                --bg-color: ${this.templateData.colors.background};
                --title-color: ${this.templateData.colors.title};
                --text-color: ${this.templateData.colors.text};
                --title-font: '${this.templateData.fonts.title}', cursive;
                --text-font: '${this.templateData.fonts.text}', sans-serif;
                --title-size: ${this.templateData.sizes.title}px;
                --text-size: ${this.templateData.sizes.text}px;
            }
            
            body {
                background: var(--bg-color) !important;
                font-family: var(--text-font);
                font-size: var(--text-size);
                color: var(--text-color);
            }
            
            .main-title, h1 {
                font-family: var(--title-font) !important;
                font-size: var(--title-size) !important;
                color: var(--title-color) !important;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .main-title, h1 {
                    font-size: calc(var(--title-size) * 0.8) !important;
                }
                
                body {
                    font-size: calc(var(--text-size) * 0.9);
                }
            }
            
            @media (max-width: 480px) {
                .main-title, h1 {
                    font-size: calc(var(--title-size) * 0.6) !important;
                }
                
                body {
                    font-size: calc(var(--text-size) * 0.8);
                }
            }
        `;
    }

    getFileExtensionFromDataURL(dataURL) {
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const extensions = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
            'video/ogg': 'ogv'
        };
        return extensions[mimeType] || 'bin';
    }

    async downloadPDF(fileName) {
        alert('Funcionalidade de PDF em desenvolvimento');
    }

    // Utility functions
    isValidColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the drag and drop template editor
const dragDropEditor = new DragDropTemplateEditor();

// Handle messages from preview iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'templateReady') {
        dragDropEditor.updatePreview();
    }
});

