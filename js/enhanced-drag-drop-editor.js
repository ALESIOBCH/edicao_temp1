// Enhanced Drag and Drop Template Editor with Image Gallery
class EnhancedDragDropEditor {
    constructor() {
        this.currentTemplate = 'romantico';
        this.selectedElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.elementCounter = 0;
        this.imageGalleryCounter = 0;
        
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
            elements: [],
            imageGalleries: []
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTemplate();
        this.setupColorSync();
        this.setupRangeSync();
        this.addEnhancedDragDropControls();
        this.setupPreviewCommunication();
        this.setupImageUploadHandling();
    }

    addEnhancedDragDropControls() {
        const sidebar = document.querySelector('.editor-sidebar .sidebar-content');
        
        // Replace existing drag-drop section or add new one
        let dragDropSection = document.querySelector('.drag-drop-section');
        if (!dragDropSection) {
            dragDropSection = document.createElement('div');
            dragDropSection.className = 'editor-section drag-drop-section';
            
            // Insert after the template selection section
            const templateSection = document.querySelector('.editor-section');
            templateSection.parentNode.insertBefore(dragDropSection, templateSection.nextSibling);
        }
        
        dragDropSection.innerHTML = `
            <h3 class="section-title">
                <i class="fas fa-magic"></i>
                Elementos Arrastáveis
            </h3>
            <div class="drag-drop-controls">
                <button class="btn-element" data-type="title">
                    <i class="fas fa-heading"></i>
                    <span>Título</span>
                </button>
                <button class="btn-element" data-type="text">
                    <i class="fas fa-font"></i>
                    <span>Caixa de Texto</span>
                </button>
                <button class="btn-element" data-type="image">
                    <i class="fas fa-image"></i>
                    <span>Imagem</span>
                </button>
                <button class="btn-element" data-type="image-gallery">
                    <i class="fas fa-images"></i>
                    <span>Galeria de Imagens</span>
                </button>
                <button class="btn-element" data-type="video">
                    <i class="fas fa-video"></i>
                    <span>Vídeo</span>
                </button>
                <button class="btn-element" data-type="shape">
                    <i class="fas fa-shapes"></i>
                    <span>Forma</span>
                </button>
            </div>
            <div class="element-properties" id="elementProperties" style="display: none;">
                <h4 class="properties-title">
                    <i class="fas fa-cog"></i>
                    Propriedades do Elemento
                </h4>
                <div class="property-controls" id="propertyControls">
                    <!-- Dynamic property controls will be added here -->
                </div>
            </div>
        `;
        
        this.addEnhancedStyles();
        this.bindEnhancedDragDropEvents();
    }

    addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Drag and Drop Styles */
            .drag-drop-controls {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .btn-element {
                padding: 12px 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .btn-element:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
            }
            
            .btn-element i {
                font-size: 16px;
            }
            
            .btn-element span {
                font-weight: 500;
                font-size: 10px;
            }
            
            .draggable-element {
                position: absolute;
                cursor: move;
                border: 2px dashed transparent;
                transition: all 0.2s ease;
                min-width: 50px;
                min-height: 30px;
                z-index: 10;
                user-select: none;
            }
            
            .draggable-element:hover {
                border-color: #3b82f6;
                box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
            }
            
            .draggable-element.selected {
                border-color: #ef4444;
                border-style: solid;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
            }
            
            .draggable-element.dragging {
                opacity: 0.8;
                z-index: 1000;
                transform: rotate(2deg);
            }
            
            .element-controls {
                position: absolute;
                top: -35px;
                right: -2px;
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s;
                z-index: 20;
            }
            
            .draggable-element:hover .element-controls,
            .draggable-element.selected .element-controls {
                opacity: 1;
            }
            
            .element-control-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .edit-btn {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            }
            
            .edit-btn:hover {
                background: linear-gradient(135deg, #2563eb, #1e40af);
                transform: scale(1.1);
            }
            
            .delete-btn {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            .delete-btn:hover {
                background: linear-gradient(135deg, #dc2626, #b91c1c);
                transform: scale(1.1);
            }
            
            .duplicate-btn {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .duplicate-btn:hover {
                background: linear-gradient(135deg, #059669, #047857);
                transform: scale(1.1);
            }
            
            .resize-handles {
                position: absolute;
                inset: -4px;
                pointer-events: none;
            }
            
            .resize-handle {
                position: absolute;
                background: #3b82f6;
                border: 2px solid white;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                pointer-events: auto;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .draggable-element:hover .resize-handle,
            .draggable-element.selected .resize-handle {
                opacity: 1;
            }
            
            .resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
            .resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
            .resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
            .resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
            .resize-handle.n { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
            .resize-handle.s { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
            .resize-handle.w { left: -6px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
            .resize-handle.e { right: -6px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
            
            .element-properties {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border: 1px solid #cbd5e1;
                border-radius: 12px;
                padding: 16px;
                margin-top: 16px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            
            .properties-title {
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .property-group {
                margin-bottom: 12px;
            }
            
            .property-group:last-child {
                margin-bottom: 0;
            }
            
            .property-label {
                display: block;
                font-size: 12px;
                font-weight: 500;
                color: #475569;
                margin-bottom: 6px;
            }
            
            .property-input, .property-select {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 13px;
                background: white;
                transition: all 0.2s;
            }
            
            .property-input:focus, .property-select:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
            
            .property-range {
                width: 100%;
                margin: 8px 0;
                accent-color: #3b82f6;
            }
            
            .range-display {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #64748b;
                margin-top: 4px;
            }
            
            .color-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .property-color {
                width: 40px;
                height: 32px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .property-input.color-text {
                flex: 1;
                font-family: 'Courier New', monospace;
                font-size: 12px;
            }
            
            /* Image Gallery Styles */
            .image-gallery {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                align-items: flex-start;
                min-height: 100px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                border: 2px dashed rgba(255, 255, 255, 0.3);
            }
            
            .gallery-image {
                position: relative;
                border-radius: 6px;
                overflow: hidden;
                cursor: move;
                transition: transform 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .gallery-image:hover {
                transform: scale(1.05);
                z-index: 10;
            }
            
            .gallery-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            
            .gallery-image-controls {
                position: absolute;
                top: 4px;
                right: 4px;
                display: flex;
                gap: 2px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            
            .gallery-image:hover .gallery-image-controls {
                opacity: 1;
            }
            
            .gallery-control-btn {
                width: 20px;
                height: 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .gallery-add-btn {
                width: 80px;
                height: 80px;
                border: 2px dashed rgba(255, 255, 255, 0.5);
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .gallery-add-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.8);
                color: white;
            }
            
            /* Shape Styles */
            .shape-element {
                border-radius: 8px;
                transition: all 0.2s;
            }
            
            .shape-element.circle {
                border-radius: 50%;
            }
            
            .shape-element.triangle {
                width: 0 !important;
                height: 0 !important;
                background: transparent !important;
                border-style: solid;
            }
            
            /* Preview Enhancements */
            .preview-container {
                position: relative;
                overflow: visible;
                background: #f8fafc;
                border-radius: 8px;
            }
            
            .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 5;
                pointer-events: none;
                border-radius: 8px;
            }
            
            .drop-zone {
                position: absolute;
                border: 3px dashed #3b82f6;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
                border-radius: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                color: #3b82f6;
                font-weight: 600;
                font-size: 16px;
                z-index: 15;
                backdrop-filter: blur(4px);
            }
            
            .drop-zone.active {
                display: flex;
                animation: dropZonePulse 1s infinite;
            }
            
            @keyframes dropZonePulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.02); }
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .drag-drop-controls {
                    grid-template-columns: 1fr;
                }
                
                .btn-element {
                    flex-direction: row;
                    padding: 10px 12px;
                }
                
                .btn-element i {
                    font-size: 14px;
                }
                
                .btn-element span {
                    font-size: 12px;
                }
                
                .draggable-element {
                    min-width: 40px;
                    min-height: 25px;
                }
                
                .element-controls {
                    top: -30px;
                }
                
                .element-control-btn {
                    width: 24px;
                    height: 24px;
                    font-size: 10px;
                }
                
                .resize-handle {
                    width: 16px;
                    height: 16px;
                }
            }
            
            /* Animation Classes */
            .fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .bounce-in {
                animation: bounceIn 0.5s ease-out;
            }
            
            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0.3);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(0.9);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEnhancedDragDropEvents() {
        // Enhanced element buttons
        document.querySelectorAll('.btn-element').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.addEnhancedElement(type);
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
        
        // Enhanced preview container events
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            // Create or update overlay
            let overlay = previewContainer.querySelector('.preview-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'preview-overlay';
                previewContainer.appendChild(overlay);
            }
            
            // Create or update drop zone
            let dropZone = previewContainer.querySelector('.drop-zone');
            if (!dropZone) {
                dropZone = document.createElement('div');
                dropZone.className = 'drop-zone';
                dropZone.innerHTML = '<i class="fas fa-magic"></i> Solte o elemento aqui';
                previewContainer.appendChild(dropZone);
            }
            
            // Enhanced drag and drop events
            overlay.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('active');
                dropZone.style.left = '20px';
                dropZone.style.top = '20px';
                dropZone.style.right = '20px';
                dropZone.style.bottom = '20px';
            });
            
            overlay.addEventListener('dragleave', (e) => {
                if (!previewContainer.contains(e.relatedTarget)) {
                    dropZone.classList.remove('active');
                }
            });
            
            overlay.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('active');
                this.handleEnhancedElementDrop(e);
            });
        }
    }

    addEnhancedElement(type) {
        this.elementCounter++;
        const elementId = `element_${type}_${this.elementCounter}`;
        
        const element = {
            id: elementId,
            type: type,
            content: this.getEnhancedDefaultContent(type),
            position: { x: 50 + (this.elementCounter * 20), y: 50 + (this.elementCounter * 20) },
            size: this.getEnhancedDefaultSize(type),
            style: this.getEnhancedDefaultStyle(type),
            properties: this.getEnhancedDefaultProperties(type)
        };
        
        this.templateData.elements.push(element);
        this.createEnhancedDraggableElement(element);
        this.updatePreview();
        
        // Auto-select the new element
        setTimeout(() => {
            this.selectElement(elementId);
        }, 100);
    }

    getEnhancedDefaultContent(type) {
        switch (type) {
            case 'title':
                return `Título ${this.elementCounter}`;
            case 'text':
                return `Texto personalizado ${this.elementCounter}`;
            case 'image':
                return null;
            case 'image-gallery':
                return [];
            case 'video':
                return null;
            case 'shape':
                return '';
            default:
                return '';
        }
    }

    getEnhancedDefaultSize(type) {
        switch (type) {
            case 'title':
                return { width: 300, height: 60 };
            case 'text':
                return { width: 250, height: 100 };
            case 'image':
                return { width: 200, height: 150 };
            case 'image-gallery':
                return { width: 400, height: 120 };
            case 'video':
                return { width: 300, height: 200 };
            case 'shape':
                return { width: 100, height: 100 };
            default:
                return { width: 200, height: 100 };
        }
    }

    getEnhancedDefaultStyle(type) {
        switch (type) {
            case 'title':
                return {
                    fontSize: '32px',
                    fontFamily: 'Dancing Script',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                };
            case 'text':
                return {
                    fontSize: '16px',
                    fontFamily: 'Poppins',
                    color: '#333333',
                    fontWeight: 'normal',
                    textAlign: 'left',
                    lineHeight: '1.5',
                    padding: '12px'
                };
            case 'image':
                return {
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                };
            case 'image-gallery':
                return {
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    imageSize: '80px'
                };
            case 'video':
                return {
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                };
            case 'shape':
                return {
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    border: 'none',
                    shapeType: 'rectangle'
                };
            default:
                return {};
        }
    }

    getEnhancedDefaultProperties(type) {
        const baseProperties = {
            editable: true,
            resizable: true,
            draggable: true,
            rotatable: false
        };

        switch (type) {
            case 'title':
                return { ...baseProperties, multiline: false };
            case 'text':
                return { ...baseProperties, multiline: true };
            case 'image':
                return { ...baseProperties, uploadable: true, editable: false };
            case 'image-gallery':
                return { ...baseProperties, uploadable: true, editable: false, multipleImages: true };
            case 'video':
                return { ...baseProperties, uploadable: true, editable: false, controls: true };
            case 'shape':
                return { ...baseProperties, editable: false };
            default:
                return baseProperties;
        }
    }

    createEnhancedDraggableElement(element) {
        const previewContainer = document.querySelector('.preview-container');
        const draggableEl = document.createElement('div');
        draggableEl.className = 'draggable-element fade-in';
        draggableEl.dataset.elementId = element.id;
        draggableEl.style.left = element.position.x + 'px';
        draggableEl.style.top = element.position.y + 'px';
        draggableEl.style.width = element.size.width + 'px';
        draggableEl.style.height = element.size.height + 'px';
        
        // Create element content based on type
        const content = this.generateElementContent(element);
        
        draggableEl.innerHTML = `
            ${content}
            <div class="element-controls">
                <button class="element-control-btn edit-btn" onclick="enhancedEditor.editElement('${element.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="element-control-btn duplicate-btn" onclick="enhancedEditor.duplicateElement('${element.id}')" title="Duplicar">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="element-control-btn delete-btn" onclick="enhancedEditor.deleteElement('${element.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="resize-handles">
                <div class="resize-handle nw" data-direction="nw"></div>
                <div class="resize-handle n" data-direction="n"></div>
                <div class="resize-handle ne" data-direction="ne"></div>
                <div class="resize-handle w" data-direction="w"></div>
                <div class="resize-handle e" data-direction="e"></div>
                <div class="resize-handle sw" data-direction="sw"></div>
                <div class="resize-handle s" data-direction="s"></div>
                <div class="resize-handle se" data-direction="se"></div>
            </div>
        `;
        
        // Add enhanced event listeners
        this.addEnhancedElementEventListeners(draggableEl, element);
        
        previewContainer.appendChild(draggableEl);
        
        // Add bounce-in animation
        setTimeout(() => {
            draggableEl.classList.add('bounce-in');
        }, 50);
    }

    generateElementContent(element) {
        switch (element.type) {
            case 'title':
                return `<div class="title-content" style="font-size: ${element.style.fontSize}; font-family: '${element.style.fontFamily}', serif; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; text-shadow: ${element.style.textShadow}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${element.style.textAlign}; white-space: nowrap; overflow: hidden;">${element.content}</div>`;
            
            case 'text':
                return `<div class="text-content" style="font-size: ${element.style.fontSize}; font-family: '${element.style.fontFamily}', sans-serif; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; line-height: ${element.style.lineHeight}; padding: ${element.style.padding}; width: 100%; height: 100%; overflow: auto;">${element.content}</div>`;
            
            case 'image':
                return element.content ? 
                    `<img src="${element.content}" style="width: 100%; height: 100%; object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius}; border: ${element.style.border}; box-shadow: ${element.style.boxShadow};" alt="Imagem">` :
                    `<div class="image-placeholder" style="width: 100%; height: 100%; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border: 2px dashed #d1d5db; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6b7280; border-radius: ${element.style.borderRadius}; cursor: pointer;"><i class="fas fa-image" style="font-size: 24px; margin-bottom: 8px;"></i><span style="font-size: 12px;">Clique para adicionar</span></div>`;
            
            case 'image-gallery':
                return this.generateImageGalleryContent(element);
            
            case 'video':
                return element.content ?
                    `<video src="${element.content}" style="width: 100%; height: 100%; border-radius: ${element.style.borderRadius}; box-shadow: ${element.style.boxShadow};" ${element.properties.controls ? 'controls' : ''}></video>` :
                    `<div class="video-placeholder" style="width: 100%; height: 100%; background: linear-gradient(135deg, #1f2937, #374151); border: 2px dashed #4b5563; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; border-radius: ${element.style.borderRadius}; cursor: pointer;"><i class="fas fa-video" style="font-size: 24px; margin-bottom: 8px;"></i><span style="font-size: 12px;">Clique para adicionar</span></div>`;
            
            case 'shape':
                return this.generateShapeContent(element);
            
            default:
                return '<div>Elemento desconhecido</div>';
        }
    }

    generateImageGalleryContent(element) {
        const images = Array.isArray(element.content) ? element.content : [];
        const imageSize = element.style.imageSize || '80px';
        
        let imagesHTML = '';
        images.forEach((image, index) => {
            imagesHTML += `
                <div class="gallery-image" style="width: ${imageSize}; height: ${imageSize};" data-index="${index}">
                    <img src="${image}" alt="Imagem ${index + 1}">
                    <div class="gallery-image-controls">
                        <button class="gallery-control-btn" style="background: #ef4444;" onclick="enhancedEditor.removeGalleryImage('${element.id}', ${index})" title="Remover">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="image-gallery" style="gap: ${element.style.gap}; padding: ${element.style.padding}; border-radius: ${element.style.borderRadius};">
                ${imagesHTML}
                <div class="gallery-add-btn" onclick="enhancedEditor.addGalleryImage('${element.id}')" style="width: ${imageSize}; height: ${imageSize};">
                    <i class="fas fa-plus"></i>
                    <span>Adicionar</span>
                </div>
            </div>
        `;
    }

    generateShapeContent(element) {
        const shapeType = element.style.shapeType || 'rectangle';
        
        switch (shapeType) {
            case 'circle':
                return `<div class="shape-element circle" style="width: 100%; height: 100%; background: ${element.style.backgroundColor}; border: ${element.style.border};"></div>`;
            case 'triangle':
                const size = Math.min(element.size.width, element.size.height);
                return `<div class="shape-element triangle" style="border-left: ${size/2}px solid transparent; border-right: ${size/2}px solid transparent; border-bottom: ${size}px solid ${element.style.backgroundColor};"></div>`;
            default: // rectangle
                return `<div class="shape-element" style="width: 100%; height: 100%; background: ${element.style.backgroundColor}; border-radius: ${element.style.borderRadius}; border: ${element.style.border};"></div>`;
        }
    }

    addEnhancedElementEventListeners(draggableEl, element) {
        // Click to select
        draggableEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element.id);
        });
        
        // Double click to edit (for text elements)
        if (element.type === 'text' || element.type === 'title') {
            draggableEl.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.editElementInline(element.id);
            });
        }
        
        // File upload (for image/video elements)
        if (element.type === 'image' || element.type === 'video') {
            const placeholder = draggableEl.querySelector('.image-placeholder, .video-placeholder');
            if (placeholder) {
                placeholder.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.uploadFile(element.id, element.type);
                });
            }
        }
        
        // Enhanced drag functionality
        draggableEl.addEventListener('mousedown', (e) => {
            const resizeHandle = e.target.closest('.resize-handle');
            if (resizeHandle) {
                this.startEnhancedResize(e, element.id, resizeHandle.dataset.direction);
            } else if (!e.target.closest('.element-controls') && !e.target.closest('.gallery-add-btn') && !e.target.closest('.gallery-control-btn')) {
                this.startEnhancedDrag(e, element.id);
            }
        });
    }

    startEnhancedDrag(e, elementId) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedElement = elementId;
        
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            draggableEl.classList.add('dragging');
            
            const rect = draggableEl.getBoundingClientRect();
            const containerRect = document.querySelector('.preview-container').getBoundingClientRect();
            
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            const handleMouseMove = (e) => {
                if (this.isDragging) {
                    const newX = e.clientX - containerRect.left - this.dragOffset.x;
                    const newY = e.clientY - containerRect.top - this.dragOffset.y;
                    
                    // Enhanced bounds checking
                    const maxX = containerRect.width - element.size.width;
                    const maxY = containerRect.height - element.size.height;
                    
                    element.position.x = Math.max(0, Math.min(newX, maxX));
                    element.position.y = Math.max(0, Math.min(newY, maxY));
                    
                    draggableEl.style.left = element.position.x + 'px';
                    draggableEl.style.top = element.position.y + 'px';
                    
                    // Show snap guides (optional enhancement)
                    this.showSnapGuides(element);
                }
            };
            
            const handleMouseUp = () => {
                this.isDragging = false;
                draggableEl.classList.remove('dragging');
                this.hideSnapGuides();
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                this.updatePreview();
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    startEnhancedResize(e, elementId, direction) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.size.width;
            const startHeight = element.size.height;
            const startPosX = element.position.x;
            const startPosY = element.position.y;
            
            const handleMouseMove = (e) => {
                if (this.isResizing) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newX = startPosX;
                    let newY = startPosY;
                    
                    // Handle different resize directions
                    switch (direction) {
                        case 'se': // Southeast
                            newWidth = Math.max(50, startWidth + deltaX);
                            newHeight = Math.max(30, startHeight + deltaY);
                            break;
                        case 'sw': // Southwest
                            newWidth = Math.max(50, startWidth - deltaX);
                            newHeight = Math.max(30, startHeight + deltaY);
                            newX = startPosX + (startWidth - newWidth);
                            break;
                        case 'ne': // Northeast
                            newWidth = Math.max(50, startWidth + deltaX);
                            newHeight = Math.max(30, startHeight - deltaY);
                            newY = startPosY + (startHeight - newHeight);
                            break;
                        case 'nw': // Northwest
                            newWidth = Math.max(50, startWidth - deltaX);
                            newHeight = Math.max(30, startHeight - deltaY);
                            newX = startPosX + (startWidth - newWidth);
                            newY = startPosY + (startHeight - newHeight);
                            break;
                        case 'n': // North
                            newHeight = Math.max(30, startHeight - deltaY);
                            newY = startPosY + (startHeight - newHeight);
                            break;
                        case 's': // South
                            newHeight = Math.max(30, startHeight + deltaY);
                            break;
                        case 'w': // West
                            newWidth = Math.max(50, startWidth - deltaX);
                            newX = startPosX + (startWidth - newWidth);
                            break;
                        case 'e': // East
                            newWidth = Math.max(50, startWidth + deltaX);
                            break;
                    }
                    
                    // Update element data
                    element.size.width = newWidth;
                    element.size.height = newHeight;
                    element.position.x = newX;
                    element.position.y = newY;
                    
                    // Update DOM
                    draggableEl.style.width = newWidth + 'px';
                    draggableEl.style.height = newHeight + 'px';
                    draggableEl.style.left = newX + 'px';
                    draggableEl.style.top = newY + 'px';
                }
            };
            
            const handleMouseUp = () => {
                this.isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                this.updatePreview();
                
                // Refresh element content if needed
                this.refreshElement(elementId);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    showSnapGuides(element) {
        // Optional: Show visual guides for snapping to other elements
        // Implementation can be added here for enhanced UX
    }

    hideSnapGuides() {
        // Hide snap guides
        document.querySelectorAll('.snap-guide').forEach(guide => guide.remove());
    }

    duplicateElement(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (element) {
            const duplicatedElement = JSON.parse(JSON.stringify(element));
            this.elementCounter++;
            duplicatedElement.id = `element_${element.type}_${this.elementCounter}`;
            duplicatedElement.position.x += 20;
            duplicatedElement.position.y += 20;
            
            this.templateData.elements.push(duplicatedElement);
            this.createEnhancedDraggableElement(duplicatedElement);
            this.updatePreview();
            
            // Select the duplicated element
            setTimeout(() => {
                this.selectElement(duplicatedElement.id);
            }, 100);
        }
    }

    addGalleryImage(elementId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const element = this.templateData.elements.find(el => el.id === elementId);
                    if (element) {
                        if (!Array.isArray(element.content)) {
                            element.content = [];
                        }
                        element.content.push(e.target.result);
                        this.refreshElement(elementId);
                        this.updatePreview();
                    }
                };
                reader.readAsDataURL(file);
            });
        };
        
        input.click();
    }

    removeGalleryImage(elementId, imageIndex) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (element && Array.isArray(element.content)) {
            element.content.splice(imageIndex, 1);
            this.refreshElement(elementId);
            this.updatePreview();
        }
    }

    setupImageUploadHandling() {
        // Enhanced image upload with drag and drop support
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                this.handleBulkImageUpload(imageFiles);
            }
        });
    }

    handleBulkImageUpload(files) {
        if (files.length === 1) {
            // Single image - create image element
            this.addEnhancedElement('image');
            const lastElement = this.templateData.elements[this.templateData.elements.length - 1];
            
            const reader = new FileReader();
            reader.onload = (e) => {
                lastElement.content = e.target.result;
                this.refreshElement(lastElement.id);
                this.updatePreview();
            };
            reader.readAsDataURL(files[0]);
        } else {
            // Multiple images - create image gallery
            this.addEnhancedElement('image-gallery');
            const lastElement = this.templateData.elements[this.templateData.elements.length - 1];
            lastElement.content = [];
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    lastElement.content.push(e.target.result);
                    this.refreshElement(lastElement.id);
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // Enhanced property controls
    showElementProperties(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        if (!element) return;
        
        const propertiesPanel = document.getElementById('elementProperties');
        const controlsContainer = document.getElementById('propertyControls');
        
        let controls = this.generateEnhancedPropertyControls(element);
        
        controlsContainer.innerHTML = controls;
        propertiesPanel.style.display = 'block';
        propertiesPanel.classList.add('fade-in');
    }

    generateEnhancedPropertyControls(element) {
        let controls = '';
        
        // Common controls for all elements
        controls += `
            <div class="property-group">
                <label class="property-label">Posição X</label>
                <input type="number" class="property-input" value="${element.position.x}" onchange="enhancedEditor.updateElementPosition('${element.id}', 'x', this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Posição Y</label>
                <input type="number" class="property-input" value="${element.position.y}" onchange="enhancedEditor.updateElementPosition('${element.id}', 'y', this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Largura</label>
                <input type="number" class="property-input" value="${element.size.width}" onchange="enhancedEditor.updateElementSize('${element.id}', 'width', this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Altura</label>
                <input type="number" class="property-input" value="${element.size.height}" onchange="enhancedEditor.updateElementSize('${element.id}', 'height', this.value)">
            </div>
        `;
        
        // Type-specific controls
        switch (element.type) {
            case 'title':
            case 'text':
                controls += this.generateTextPropertyControls(element);
                break;
            case 'image':
                controls += this.generateImagePropertyControls(element);
                break;
            case 'image-gallery':
                controls += this.generateGalleryPropertyControls(element);
                break;
            case 'video':
                controls += this.generateVideoPropertyControls(element);
                break;
            case 'shape':
                controls += this.generateShapePropertyControls(element);
                break;
        }
        
        return controls;
    }

    generateTextPropertyControls(element) {
        return `
            <div class="property-group">
                <label class="property-label">Conteúdo</label>
                <textarea class="property-input" rows="3" onchange="enhancedEditor.updateElementProperty('${element.id}', 'content', this.value)">${element.content}</textarea>
            </div>
            <div class="property-group">
                <label class="property-label">Tamanho da Fonte</label>
                <input type="range" class="property-range" min="12" max="72" value="${parseInt(element.style.fontSize)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'fontSize', this.value + 'px')">
                <div class="range-display">
                    <span>12px</span>
                    <span>${element.style.fontSize}</span>
                    <span>72px</span>
                </div>
            </div>
            <div class="property-group">
                <label class="property-label">Família da Fonte</label>
                <select class="property-select" onchange="enhancedEditor.updateElementStyle('${element.id}', 'fontFamily', this.value)">
                    <option value="Poppins" ${element.style.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins</option>
                    <option value="Dancing Script" ${element.style.fontFamily === 'Dancing Script' ? 'selected' : ''}>Dancing Script</option>
                    <option value="Inter" ${element.style.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                    <option value="Playfair Display" ${element.style.fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                    <option value="Montserrat" ${element.style.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Cor do Texto</label>
                <div class="color-input-wrapper">
                    <input type="color" class="property-color" value="${element.style.color}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'color', this.value)">
                    <input type="text" class="property-input color-text" value="${element.style.color}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'color', this.value)">
                </div>
            </div>
            <div class="property-group">
                <label class="property-label">Alinhamento</label>
                <select class="property-select" onchange="enhancedEditor.updateElementStyle('${element.id}', 'textAlign', this.value)">
                    <option value="left" ${element.style.textAlign === 'left' ? 'selected' : ''}>Esquerda</option>
                    <option value="center" ${element.style.textAlign === 'center' ? 'selected' : ''}>Centro</option>
                    <option value="right" ${element.style.textAlign === 'right' ? 'selected' : ''}>Direita</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Peso da Fonte</label>
                <select class="property-select" onchange="enhancedEditor.updateElementStyle('${element.id}', 'fontWeight', this.value)">
                    <option value="normal" ${element.style.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="bold" ${element.style.fontWeight === 'bold' ? 'selected' : ''}>Negrito</option>
                    <option value="lighter" ${element.style.fontWeight === 'lighter' ? 'selected' : ''}>Mais Leve</option>
                </select>
            </div>
        `;
    }

    generateImagePropertyControls(element) {
        return `
            <div class="property-group">
                <label class="property-label">Imagem</label>
                <button class="property-input" onclick="enhancedEditor.uploadFile('${element.id}', 'image')" style="cursor: pointer;">
                    ${element.content ? 'Alterar Imagem' : 'Adicionar Imagem'}
                </button>
            </div>
            <div class="property-group">
                <label class="property-label">Ajuste da Imagem</label>
                <select class="property-select" onchange="enhancedEditor.updateElementStyle('${element.id}', 'objectFit', this.value)">
                    <option value="cover" ${element.style.objectFit === 'cover' ? 'selected' : ''}>Cobrir</option>
                    <option value="contain" ${element.style.objectFit === 'contain' ? 'selected' : ''}>Conter</option>
                    <option value="fill" ${element.style.objectFit === 'fill' ? 'selected' : ''}>Preencher</option>
                    <option value="scale-down" ${element.style.objectFit === 'scale-down' ? 'selected' : ''}>Reduzir</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Borda Arredondada</label>
                <input type="range" class="property-range" min="0" max="50" value="${parseInt(element.style.borderRadius)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'borderRadius', this.value + 'px')">
                <div class="range-display">
                    <span>0px</span>
                    <span>${element.style.borderRadius}</span>
                    <span>50px</span>
                </div>
            </div>
        `;
    }

    generateGalleryPropertyControls(element) {
        return `
            <div class="property-group">
                <label class="property-label">Adicionar Imagens</label>
                <button class="property-input" onclick="enhancedEditor.addGalleryImage('${element.id}')" style="cursor: pointer;">
                    Adicionar Imagens à Galeria
                </button>
            </div>
            <div class="property-group">
                <label class="property-label">Tamanho das Imagens</label>
                <input type="range" class="property-range" min="60" max="150" value="${parseInt(element.style.imageSize)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'imageSize', this.value + 'px')">
                <div class="range-display">
                    <span>60px</span>
                    <span>${element.style.imageSize}</span>
                    <span>150px</span>
                </div>
            </div>
            <div class="property-group">
                <label class="property-label">Espaçamento</label>
                <input type="range" class="property-range" min="4" max="20" value="${parseInt(element.style.gap)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'gap', this.value + 'px')">
                <div class="range-display">
                    <span>4px</span>
                    <span>${element.style.gap}</span>
                    <span>20px</span>
                </div>
            </div>
        `;
    }

    generateVideoPropertyControls(element) {
        return `
            <div class="property-group">
                <label class="property-label">Vídeo</label>
                <button class="property-input" onclick="enhancedEditor.uploadFile('${element.id}', 'video')" style="cursor: pointer;">
                    ${element.content ? 'Alterar Vídeo' : 'Adicionar Vídeo'}
                </button>
            </div>
            <div class="property-group">
                <label class="property-label">Controles</label>
                <input type="checkbox" ${element.properties.controls ? 'checked' : ''} onchange="enhancedEditor.updateElementProperty('${element.id}', 'controls', this.checked)">
                <span style="margin-left: 8px; font-size: 12px;">Mostrar controles do vídeo</span>
            </div>
            <div class="property-group">
                <label class="property-label">Borda Arredondada</label>
                <input type="range" class="property-range" min="0" max="50" value="${parseInt(element.style.borderRadius)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'borderRadius', this.value + 'px')">
                <div class="range-display">
                    <span>0px</span>
                    <span>${element.style.borderRadius}</span>
                    <span>50px</span>
                </div>
            </div>
        `;
    }

    generateShapePropertyControls(element) {
        return `
            <div class="property-group">
                <label class="property-label">Tipo de Forma</label>
                <select class="property-select" onchange="enhancedEditor.updateElementStyle('${element.id}', 'shapeType', this.value)">
                    <option value="rectangle" ${element.style.shapeType === 'rectangle' ? 'selected' : ''}>Retângulo</option>
                    <option value="circle" ${element.style.shapeType === 'circle' ? 'selected' : ''}>Círculo</option>
                    <option value="triangle" ${element.style.shapeType === 'triangle' ? 'selected' : ''}>Triângulo</option>
                </select>
            </div>
            <div class="property-group">
                <label class="property-label">Cor de Fundo</label>
                <div class="color-input-wrapper">
                    <input type="color" class="property-color" value="${element.style.backgroundColor}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'backgroundColor', this.value)">
                    <input type="text" class="property-input color-text" value="${element.style.backgroundColor}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'backgroundColor', this.value)">
                </div>
            </div>
            <div class="property-group">
                <label class="property-label">Borda Arredondada</label>
                <input type="range" class="property-range" min="0" max="50" value="${parseInt(element.style.borderRadius)}" onchange="enhancedEditor.updateElementStyle('${element.id}', 'borderRadius', this.value + 'px')">
                <div class="range-display">
                    <span>0px</span>
                    <span>${element.style.borderRadius}</span>
                    <span>50px</span>
                </div>
            </div>
        `;
    }

    updateElementPosition(elementId, axis, value) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            element.position[axis] = parseInt(value);
            draggableEl.style[axis === 'x' ? 'left' : 'top'] = value + 'px';
            this.updatePreview();
        }
    }

    updateElementSize(elementId, dimension, value) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            element.size[dimension] = parseInt(value);
            draggableEl.style[dimension] = value + 'px';
            this.refreshElement(elementId);
            this.updatePreview();
        }
    }

    // Inherit and enhance existing methods from the original editor
    bindEvents() {
        // Keep all existing event bindings from the original editor
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

    // Keep all other existing methods and add enhanced versions where needed
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
        }
    }

    refreshElement(elementId) {
        const element = this.templateData.elements.find(el => el.id === elementId);
        const draggableEl = document.querySelector(`[data-element-id="${elementId}"]`);
        
        if (element && draggableEl) {
            // Save controls and resize handles
            const controls = draggableEl.querySelector('.element-controls');
            const resizeHandles = draggableEl.querySelector('.resize-handles');
            
            // Generate new content
            const content = this.generateElementContent(element);
            
            // Update content
            draggableEl.innerHTML = content;
            draggableEl.appendChild(controls);
            draggableEl.appendChild(resizeHandles);
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
        
        if (element && (element.type === 'text' || element.type === 'title') && draggableEl) {
            const textContent = draggableEl.querySelector('.text-content, .title-content');
            if (textContent) {
                const currentText = element.content;
                const input = document.createElement(element.type === 'text' ? 'textarea' : 'input');
                if (element.type === 'text') {
                    input.rows = 3;
                }
                input.value = currentText;
                input.style.cssText = textContent.style.cssText;
                input.style.border = '2px solid #3b82f6';
                input.style.background = 'white';
                input.style.resize = 'none';
                
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
                    if (e.key === 'Enter' && element.type === 'title') {
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
                draggableEl.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    draggableEl.remove();
                }, 300);
            }
            
            // Hide properties panel if this element was selected
            if (this.selectedElement === elementId) {
                document.getElementById('elementProperties').style.display = 'none';
                this.selectedElement = null;
            }
            
            this.updatePreview();
        }
    }

    // Keep all existing methods from the original editor
    setupColorSync() {
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
        
        this.loadTemplateData();
    }

    loadTemplateData() {
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
            elements: [],
            imageGalleries: []
        };

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
        
        document.getElementById('backgroundColor').value = this.templateData.colors.background;
        document.getElementById('titleColor').value = this.templateData.colors.title;
        document.getElementById('textColor').value = this.templateData.colors.text;
        document.getElementById('backgroundColorText').value = this.templateData.colors.background;
        document.getElementById('titleColorText').value = this.templateData.colors.title;
        document.getElementById('textColorText').value = this.templateData.colors.text;
    }

    setupPreviewCommunication() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'templateReady') {
                this.updatePreview();
            }
        });
    }

    updatePreview() {
        const iframe = document.getElementById('previewFrame');
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'updateTemplate',
                data: this.templateData
            }, '*');
        }
    }

    setupModals() {
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
            const downloadBtn = document.getElementById('confirmDownload');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
            downloadBtn.disabled = true;
            
            const JSZip = await this.loadJSZip();
            const templateHTML = await this.generateCompleteHTML();
            const zipBlob = await this.createZipPackage(templateHTML, fileName, JSZip);
            
            this.downloadBlob(zipBlob, `${fileName}.zip`);
            
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Erro ao gerar download:', error);
            alert('Erro ao gerar o download. Tente novamente.');
            
            const downloadBtn = document.getElementById('confirmDownload');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar';
            downloadBtn.disabled = false;
        }
    }

    async loadJSZip() {
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
        
        zip.file('index.html', html);
        
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
        
        try {
            const jsResponse = await fetch(`templates/${this.currentTemplate}/script.js`);
            if (jsResponse.ok) {
                const jsContent = await jsResponse.text();
                zip.file('script.js', jsContent);
            }
        } catch (error) {
            console.warn('Erro ao carregar JavaScript:', error);
        }
        
        // Add custom images and videos
        let imageCounter = 1;
        let videoCounter = 1;
        
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
            } else if (element.type === 'video' && element.content && element.content.startsWith('data:')) {
                try {
                    const base64Data = element.content.split(',')[1];
                    const extension = this.getFileExtensionFromDataURL(element.content);
                    zip.file(`videos/custom_video_${videoCounter}.${extension}`, base64Data, { base64: true });
                    videoCounter++;
                } catch (error) {
                    console.warn('Erro ao processar vídeo personalizado:', error);
                }
            } else if (element.type === 'image-gallery' && Array.isArray(element.content)) {
                element.content.forEach((imageData, index) => {
                    if (imageData.startsWith('data:')) {
                        try {
                            const base64Data = imageData.split(',')[1];
                            const extension = this.getFileExtensionFromDataURL(imageData);
                            zip.file(`images/gallery_${element.id}_${index}.${extension}`, base64Data, { base64: true });
                        } catch (error) {
                            console.warn('Erro ao processar imagem da galeria:', error);
                        }
                    }
                });
            }
        }
        
        return await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
    }

    async generateCompleteHTML() {
        const response = await fetch(`templates/${this.currentTemplate}/index.html`);
        let html = await response.text();
        
        html = html.replace(/{{title}}/g, this.templateData.title || 'Nossa História de Amor');
        html = html.replace(/{{subtitle}}/g, this.templateData.subtitle || 'Uma lembrança especial para você');
        html = html.replace(/{{message}}/g, this.templateData.message || 'Meu amor, cada dia ao seu lado é uma nova página em nossa história de amor...');

        html = this.updateEditableElementsInHTML(html);

        let customElementsHTML = '';
        let imageCounter = 1;
        let videoCounter = 1;
        
        this.templateData.elements.forEach((element) => {
            let elementHTML = '';
            const style = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px; width: ${element.size.width}px; height: ${element.size.height}px; z-index: 10;`;
            
            switch (element.type) {
                case 'title':
                    elementHTML = `<div style="${style} font-size: ${element.style.fontSize}; font-family: '${element.style.fontFamily}', serif; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; text-shadow: ${element.style.textShadow}; display: flex; align-items: center; justify-content: ${element.style.textAlign};">${element.content}</div>`;
                    break;
                case 'text':
                    elementHTML = `<div style="${style} font-size: ${element.style.fontSize}; font-family: '${element.style.fontFamily}', sans-serif; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; line-height: ${element.style.lineHeight}; padding: ${element.style.padding};">${element.content}</div>`;
                    break;
                case 'image':
                    if (element.content) {
                        const imageSrc = element.content.startsWith('data:') ? `images/custom_image_${imageCounter}.${this.getFileExtensionFromDataURL(element.content)}` : element.content;
                        elementHTML = `<img src="${imageSrc}" style="${style} object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius}; box-shadow: ${element.style.boxShadow};" alt="Imagem personalizada">`;
                        imageCounter++;
                    }
                    break;
                case 'video':
                    if (element.content) {
                        const videoSrc = element.content.startsWith('data:') ? `videos/custom_video_${videoCounter}.${this.getFileExtensionFromDataURL(element.content)}` : element.content;
                        elementHTML = `<video src="${videoSrc}" style="${style} border-radius: ${element.style.borderRadius}; box-shadow: ${element.style.boxShadow};" ${element.properties.controls ? 'controls' : ''}></video>`;
                        videoCounter++;
                    }
                    break;
                case 'image-gallery':
                    if (Array.isArray(element.content) && element.content.length > 0) {
                        let galleryHTML = `<div style="${style} display: flex; gap: ${element.style.gap}; flex-wrap: wrap; padding: ${element.style.padding};">`;
                        element.content.forEach((imageData, index) => {
                            const imageSrc = imageData.startsWith('data:') ? `images/gallery_${element.id}_${index}.${this.getFileExtensionFromDataURL(imageData)}` : imageData;
                            galleryHTML += `<img src="${imageSrc}" style="width: ${element.style.imageSize}; height: ${element.style.imageSize}; object-fit: cover; border-radius: 6px;" alt="Galeria ${index + 1}">`;
                        });
                        galleryHTML += '</div>';
                        elementHTML = galleryHTML;
                    }
                    break;
                case 'shape':
                    if (element.style.shapeType === 'circle') {
                        elementHTML = `<div style="${style} background: ${element.style.backgroundColor}; border-radius: 50%;"></div>`;
                    } else if (element.style.shapeType === 'triangle') {
                        const size = Math.min(element.size.width, element.size.height);
                        elementHTML = `<div style="position: absolute; left: ${element.position.x}px; top: ${element.position.y}px; width: 0; height: 0; border-left: ${size/2}px solid transparent; border-right: ${size/2}px solid transparent; border-bottom: ${size}px solid ${element.style.backgroundColor}; z-index: 10;"></div>`;
                    } else {
                        elementHTML = `<div style="${style} background: ${element.style.backgroundColor}; border-radius: ${element.style.borderRadius};"></div>`;
                    }
                    break;
            }
            customElementsHTML += elementHTML + '\n';
        });

        const footerIndex = html.indexOf('<footer');
        if (footerIndex !== -1) {
            html = html.slice(0, footerIndex) + customElementsHTML + html.slice(footerIndex);
        } else {
            const bodyCloseIndex = html.lastIndexOf('</body>');
            if (bodyCloseIndex !== -1) {
                html = html.slice(0, bodyCloseIndex) + customElementsHTML + html.slice(bodyCloseIndex);
            }
        }
        
        return html;
    }

    updateEditableElementsInHTML(html) {
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

// Initialize the enhanced drag and drop template editor
let enhancedEditor;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    enhancedEditor = new EnhancedDragDropEditor();
    console.log('Enhanced editor inicializado:', enhancedEditor);
});

// Handle messages from preview iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'templateReady' && enhancedEditor) {
        enhancedEditor.updatePreview();
    }
});

// Add fade-out animation CSS
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(fadeOutStyle);



// Enhanced Media Management Extensions
class MediaManager {
    constructor(editor) {
        this.editor = editor;
        this.audioContext = null;
        this.backgroundMusic = null;
        this.musicVolume = 0.5;
        this.init();
    }

    init() {
        this.setupAudioContext();
        this.addMediaControls();
        this.setupAdvancedFileHandling();
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API não suportado:', error);
        }
    }

    addMediaControls() {
        const sidebar = document.querySelector('.editor-sidebar .sidebar-content');
        
        // Add media controls section
        const mediaSection = document.createElement('div');
        mediaSection.className = 'editor-section media-controls-section';
        mediaSection.innerHTML = `
            <h3 class="section-title">
                <i class="fas fa-music"></i>
                Controles de Mídia
            </h3>
            <div class="media-controls">
                <div class="control-group">
                    <label class="control-label">
                        <i class="fas fa-volume-up"></i>
                        Música de Fundo
                    </label>
                    <div class="file-upload-area" id="musicUploadArea">
                        <input type="file" id="musicUpload" accept="audio/*" style="display: none;">
                        <div class="upload-placeholder" onclick="document.getElementById('musicUpload').click()">
                            <i class="fas fa-music"></i>
                            <span>Clique para adicionar música</span>
                        </div>
                    </div>
                    <div class="music-controls" id="musicControls" style="display: none;">
                        <div class="music-info">
                            <span id="musicName">Nenhuma música selecionada</span>
                        </div>
                        <div class="player-controls">
                            <button class="control-btn" id="playPauseBtn">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="control-btn" id="stopBtn">
                                <i class="fas fa-stop"></i>
                            </button>
                            <button class="control-btn" id="removeMusicBtn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="volume-control">
                            <label class="volume-label">Volume:</label>
                            <input type="range" id="volumeSlider" min="0" max="100" value="50" class="volume-slider">
                            <span id="volumeValue">50%</span>
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label class="control-label">
                        <i class="fas fa-images"></i>
                        Upload em Lote
                    </label>
                    <div class="bulk-upload-area" id="bulkUploadArea">
                        <input type="file" id="bulkImageUpload" accept="image/*" multiple style="display: none;">
                        <div class="upload-placeholder" onclick="document.getElementById('bulkImageUpload').click()">
                            <i class="fas fa-images"></i>
                            <span>Selecionar múltiplas imagens</span>
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label class="control-label">
                        <i class="fas fa-video"></i>
                        Controles de Vídeo
                    </label>
                    <div class="video-settings">
                        <div class="setting-item">
                            <input type="checkbox" id="autoplayVideos">
                            <label for="autoplayVideos">Reprodução automática</label>
                        </div>
                        <div class="setting-item">
                            <input type="checkbox" id="loopVideos">
                            <label for="loopVideos">Repetir vídeos</label>
                        </div>
                        <div class="setting-item">
                            <input type="checkbox" id="muteVideos">
                            <label for="muteVideos">Silenciar vídeos</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after drag-drop section
        const dragDropSection = document.querySelector('.drag-drop-section');
        dragDropSection.parentNode.insertBefore(mediaSection, dragDropSection.nextSibling);
        
        this.addMediaStyles();
        this.bindMediaEvents();
    }

    addMediaStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Media Controls Styles */
            .media-controls-section {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border: 1px solid #475569;
                color: white;
            }
            
            .media-controls {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .control-group {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .control-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #e2e8f0;
            }
            
            .file-upload-area, .bulk-upload-area {
                border: 2px dashed rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                padding: 16px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.02);
            }
            
            .file-upload-area:hover, .bulk-upload-area:hover {
                border-color: rgba(255, 255, 255, 0.6);
                background: rgba(255, 255, 255, 0.05);
            }
            
            .upload-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .upload-placeholder i {
                font-size: 24px;
                color: #60a5fa;
            }
            
            .upload-placeholder span {
                font-size: 12px;
                font-weight: 500;
            }
            
            .music-controls {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 12px;
                margin-top: 8px;
            }
            
            .music-info {
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                font-size: 12px;
                color: #cbd5e1;
            }
            
            .player-controls {
                display: flex;
                gap: 8px;
                justify-content: center;
                margin-bottom: 12px;
            }
            
            .control-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .control-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            
            .control-btn:active {
                transform: scale(0.95);
            }
            
            .control-btn.playing {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .control-btn.danger {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
            }
            
            .volume-label {
                color: #94a3b8;
                font-weight: 500;
                min-width: 50px;
            }
            
            .volume-slider {
                flex: 1;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
                accent-color: #3b82f6;
            }
            
            #volumeValue {
                color: #60a5fa;
                font-weight: 600;
                min-width: 35px;
                text-align: right;
            }
            
            .video-settings {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .setting-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: #cbd5e1;
            }
            
            .setting-item input[type="checkbox"] {
                accent-color: #3b82f6;
                transform: scale(1.1);
            }
            
            .setting-item label {
                cursor: pointer;
                user-select: none;
            }
            
            /* Drag and Drop Enhancements */
            .drag-over {
                border-color: #3b82f6 !important;
                background: rgba(59, 130, 246, 0.1) !important;
                transform: scale(1.02);
            }
            
            .drag-over::after {
                content: "Solte os arquivos aqui";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(59, 130, 246, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                pointer-events: none;
                z-index: 10;
            }
            
            /* Animation for new elements */
            .media-element-appear {
                animation: mediaElementAppear 0.5s ease-out;
            }
            
            @keyframes mediaElementAppear {
                0% {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.05) translateY(-5px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            /* Loading states */
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                z-index: 20;
            }
            
            .loading-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Progress bar */
            .upload-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .upload-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #60a5fa);
                border-radius: 2px;
                transition: width 0.3s ease;
                width: 0%;
            }
        `;
        document.head.appendChild(style);
    }

    bindMediaEvents() {
        // Music upload
        document.getElementById('musicUpload').addEventListener('change', (e) => {
            this.handleMusicUpload(e.target.files[0]);
        });

        // Bulk image upload
        document.getElementById('bulkImageUpload').addEventListener('change', (e) => {
            this.handleBulkImageUpload(Array.from(e.target.files));
        });

        // Music controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.toggleMusic();
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stopMusic();
        });

        document.getElementById('removeMusicBtn').addEventListener('click', () => {
            this.removeMusic();
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });

        // Video settings
        document.getElementById('autoplayVideos').addEventListener('change', (e) => {
            this.updateVideoSettings('autoplay', e.target.checked);
        });

        document.getElementById('loopVideos').addEventListener('change', (e) => {
            this.updateVideoSettings('loop', e.target.checked);
        });

        document.getElementById('muteVideos').addEventListener('change', (e) => {
            this.updateVideoSettings('muted', e.target.checked);
        });

        // Enhanced drag and drop for entire editor
        this.setupGlobalDragAndDrop();
    }

    handleMusicUpload(file) {
        if (!file) return;

        const musicControls = document.getElementById('musicControls');
        const musicName = document.getElementById('musicName');
        const uploadArea = document.getElementById('musicUploadArea');

        // Show loading
        this.showLoadingState(uploadArea);

        const reader = new FileReader();
        reader.onload = (e) => {
            this.backgroundMusic = new Audio(e.target.result);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;
            
            musicName.textContent = file.name;
            musicControls.style.display = 'block';
            
            // Update template data
            this.editor.templateData.music = {
                name: file.name,
                data: e.target.result,
                volume: this.musicVolume
            };
            
            this.hideLoadingState(uploadArea);
            this.editor.updatePreview();
        };
        
        reader.onerror = () => {
            this.hideLoadingState(uploadArea);
            alert('Erro ao carregar o arquivo de música');
        };
        
        reader.readAsDataURL(file);
    }

    handleBulkImageUpload(files) {
        if (files.length === 0) return;

        const uploadArea = document.getElementById('bulkUploadArea');
        this.showLoadingState(uploadArea);

        // Create progress bar
        const progressBar = this.createProgressBar(uploadArea);
        let loadedCount = 0;

        if (files.length === 1) {
            // Single image - create image element
            this.processSingleImage(files[0], () => {
                loadedCount++;
                this.updateProgress(progressBar, (loadedCount / files.length) * 100);
                if (loadedCount === files.length) {
                    this.hideLoadingState(uploadArea);
                }
            });
        } else {
            // Multiple images - create gallery
            this.editor.addEnhancedElement('image-gallery');
            const galleryElement = this.editor.templateData.elements[this.editor.templateData.elements.length - 1];
            galleryElement.content = [];

            files.forEach(file => {
                this.processImageForGallery(file, galleryElement, () => {
                    loadedCount++;
                    this.updateProgress(progressBar, (loadedCount / files.length) * 100);
                    if (loadedCount === files.length) {
                        this.editor.refreshElement(galleryElement.id);
                        this.editor.updatePreview();
                        this.hideLoadingState(uploadArea);
                        
                        // Auto-select the gallery
                        setTimeout(() => {
                            this.editor.selectElement(galleryElement.id);
                        }, 100);
                    }
                });
            });
        }
    }

    processSingleImage(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editor.addEnhancedElement('image');
            const imageElement = this.editor.templateData.elements[this.editor.templateData.elements.length - 1];
            imageElement.content = e.target.result;
            
            this.editor.refreshElement(imageElement.id);
            this.editor.updatePreview();
            
            // Add appear animation
            const elementDOM = document.querySelector(`[data-element-id="${imageElement.id}"]`);
            if (elementDOM) {
                elementDOM.classList.add('media-element-appear');
            }
            
            callback();
        };
        reader.readAsDataURL(file);
    }

    processImageForGallery(file, galleryElement, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            galleryElement.content.push(e.target.result);
            callback();
        };
        reader.readAsDataURL(file);
    }

    toggleMusic() {
        if (!this.backgroundMusic) return;

        const playPauseBtn = document.getElementById('playPauseBtn');
        const icon = playPauseBtn.querySelector('i');

        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().then(() => {
                icon.className = 'fas fa-pause';
                playPauseBtn.classList.add('playing');
            }).catch(error => {
                console.warn('Erro ao reproduzir música:', error);
            });
        } else {
            this.backgroundMusic.pause();
            icon.className = 'fas fa-play';
            playPauseBtn.classList.remove('playing');
        }
    }

    stopMusic() {
        if (!this.backgroundMusic) return;

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        
        const playPauseBtn = document.getElementById('playPauseBtn');
        const icon = playPauseBtn.querySelector('i');
        icon.className = 'fas fa-play';
        playPauseBtn.classList.remove('playing');
    }

    removeMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic = null;
        }

        document.getElementById('musicControls').style.display = 'none';
        document.getElementById('musicName').textContent = 'Nenhuma música selecionada';
        
        // Update template data
        this.editor.templateData.music = null;
        this.editor.updatePreview();
    }

    setVolume(value) {
        this.musicVolume = value / 100;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
        
        document.getElementById('volumeValue').textContent = value + '%';
        
        // Update template data
        if (this.editor.templateData.music) {
            this.editor.templateData.music.volume = this.musicVolume;
        }
    }

    updateVideoSettings(setting, value) {
        // Update all video elements with new settings
        this.editor.templateData.elements.forEach(element => {
            if (element.type === 'video') {
                element.properties[setting] = value;
                this.editor.refreshElement(element.id);
            }
        });
        
        this.editor.updatePreview();
    }

    setupGlobalDragAndDrop() {
        const previewContainer = document.querySelector('.preview-container');
        
        // Prevent default drag behaviors on the entire editor
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Handle file drops on preview container
        previewContainer.addEventListener('dragenter', (e) => {
            previewContainer.classList.add('drag-over');
        });

        previewContainer.addEventListener('dragleave', (e) => {
            if (!previewContainer.contains(e.relatedTarget)) {
                previewContainer.classList.remove('drag-over');
            }
        });

        previewContainer.addEventListener('drop', (e) => {
            previewContainer.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            const videoFiles = files.filter(file => file.type.startsWith('video/'));
            const audioFiles = files.filter(file => file.type.startsWith('audio/'));

            if (imageFiles.length > 0) {
                this.handleBulkImageUpload(imageFiles);
            }

            if (videoFiles.length > 0) {
                this.handleVideoUpload(videoFiles[0]);
            }

            if (audioFiles.length > 0) {
                this.handleMusicUpload(audioFiles[0]);
            }
        });
    }

    handleVideoUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editor.addEnhancedElement('video');
            const videoElement = this.editor.templateData.elements[this.editor.templateData.elements.length - 1];
            videoElement.content = e.target.result;
            
            // Apply current video settings
            videoElement.properties.autoplay = document.getElementById('autoplayVideos').checked;
            videoElement.properties.loop = document.getElementById('loopVideos').checked;
            videoElement.properties.muted = document.getElementById('muteVideos').checked;
            
            this.editor.refreshElement(videoElement.id);
            this.editor.updatePreview();
            
            // Add appear animation
            const elementDOM = document.querySelector(`[data-element-id="${videoElement.id}"]`);
            if (elementDOM) {
                elementDOM.classList.add('media-element-appear');
            }
            
            // Auto-select the video
            setTimeout(() => {
                this.editor.selectElement(videoElement.id);
            }, 100);
        };
        reader.readAsDataURL(file);
    }

    showLoadingState(container) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        container.style.position = 'relative';
        container.appendChild(loadingOverlay);
    }

    hideLoadingState(container) {
        const loadingOverlay = container.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    createProgressBar(container) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'upload-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'upload-progress-bar';
        
        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
        
        return progressBar;
    }

    updateProgress(progressBar, percentage) {
        progressBar.style.width = percentage + '%';
    }
}

// Extend the enhanced editor with media management
if (typeof enhancedEditor !== 'undefined') {
    enhancedEditor.mediaManager = new MediaManager(enhancedEditor);
    
    // Override the generateCompleteHTML method to include media
    const originalGenerateCompleteHTML = enhancedEditor.generateCompleteHTML;
    enhancedEditor.generateCompleteHTML = async function() {
        let html = await originalGenerateCompleteHTML.call(this);
        
        // Add background music if present
        if (this.templateData.music) {
            const musicHTML = `
                <audio id="backgroundMusic" loop ${this.templateData.music.volume ? `volume="${this.templateData.music.volume}"` : ''}>
                    <source src="music/background.${this.getFileExtensionFromDataURL(this.templateData.music.data)}" type="${this.templateData.music.data.split(',')[0].split(':')[1].split(';')[0]}">
                </audio>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const music = document.getElementById('backgroundMusic');
                        if (music) {
                            // Auto-play with user interaction
                            document.addEventListener('click', function() {
                                music.play().catch(e => console.log('Auto-play prevented'));
                            }, { once: true });
                        }
                    });
                </script>
            `;
            
            const bodyCloseIndex = html.lastIndexOf('</body>');
            if (bodyCloseIndex !== -1) {
                html = html.slice(0, bodyCloseIndex) + musicHTML + html.slice(bodyCloseIndex);
            }
        }
        
        return html;
    };
    
    // Override the createZipPackage method to include music
    const originalCreateZipPackage = enhancedEditor.createZipPackage;
    enhancedEditor.createZipPackage = async function(html, fileName, JSZip) {
        const zip = await originalCreateZipPackage.call(this, html, fileName, JSZip);
        
        // Add background music to zip
        if (this.templateData.music && this.templateData.music.data) {
            try {
                const base64Data = this.templateData.music.data.split(',')[1];
                const extension = this.getFileExtensionFromDataURL(this.templateData.music.data);
                zip.file(`music/background.${extension}`, base64Data, { base64: true });
            } catch (error) {
                console.warn('Erro ao processar música de fundo:', error);
            }
        }
        
        return zip;
    };
}

