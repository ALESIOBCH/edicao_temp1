// Enhanced Template Editor JavaScript
class EnhancedTemplateEditor {
    constructor() {
        this.currentTemplate = 'romantico';
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
            timeline: [],
            customTexts: [],
            customImages: []
        };
        
        this.imageCounter = 0;
        this.textCounter = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTemplate();
        this.setupColorSync();
        this.setupRangeSync();
        this.addDynamicControls();
    }

    addDynamicControls() {
        // Add button to create more image fields
        const mediaSection = document.querySelector('.editor-section:has(.media-controls)');
        if (mediaSection) {
            const addImageBtn = document.createElement('button');
            addImageBtn.className = 'btn-secondary add-field-btn';
            addImageBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Campo de Imagem';
            addImageBtn.addEventListener('click', () => this.addImageField());
            
            const addTextBtn = document.createElement('button');
            addTextBtn.className = 'btn-secondary add-field-btn';
            addTextBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Campo de Texto';
            addTextBtn.addEventListener('click', () => this.addTextField());
            
            mediaSection.appendChild(addImageBtn);
            mediaSection.appendChild(addTextBtn);
        }

        // Add custom styles for new buttons
        const style = document.createElement('style');
        style.textContent = `
            .add-field-btn {
                width: 100%;
                margin-top: 10px;
                padding: 10px;
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
                transition: background 0.2s;
            }
            
            .add-field-btn:hover {
                background: #2563eb;
            }
            
            .dynamic-field {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 15px;
                margin: 10px 0;
                position: relative;
            }
            
            .field-remove {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .field-remove:hover {
                background: #dc2626;
            }
            
            .dynamic-image-preview {
                max-width: 100px;
                max-height: 100px;
                object-fit: cover;
                border-radius: 4px;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    addImageField() {
        this.imageCounter++;
        const fieldId = `customImage${this.imageCounter}`;
        
        const mediaControls = document.querySelector('.media-controls');
        const dynamicField = document.createElement('div');
        dynamicField.className = 'dynamic-field';
        dynamicField.innerHTML = `
            <button class="field-remove" onclick="templateEditor.removeField('${fieldId}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-group">
                <label class="form-label">Imagem Personalizada ${this.imageCounter}</label>
                <input type="file" id="${fieldId}" accept="image/*" class="form-input">
                <div class="image-preview" id="${fieldId}Preview"></div>
            </div>
        `;
        
        mediaControls.appendChild(dynamicField);
        
        // Add event listener for the new field
        document.getElementById(fieldId).addEventListener('change', (e) => {
            this.handleCustomImageUpload(e, fieldId);
        });
    }

    addTextField() {
        this.textCounter++;
        const fieldId = `customText${this.textCounter}`;
        
        const textSection = document.querySelector('.editor-section:has(.text-controls)');
        const dynamicField = document.createElement('div');
        dynamicField.className = 'dynamic-field';
        dynamicField.innerHTML = `
            <button class="field-remove" onclick="templateEditor.removeField('${fieldId}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-group">
                <label class="form-label">Texto Personalizado ${this.textCounter}</label>
                <input type="text" id="${fieldId}" class="form-input" placeholder="Digite o texto">
            </div>
            <div class="form-group">
                <label class="form-label">Estilo do Texto</label>
                <select id="${fieldId}Style" class="form-select">
                    <option value="normal">Normal</option>
                    <option value="title">Título</option>
                    <option value="subtitle">Subtítulo</option>
                    <option value="caption">Legenda</option>
                </select>
            </div>
        `;
        
        textSection.querySelector('.text-controls').appendChild(dynamicField);
        
        // Add event listeners for the new field
        document.getElementById(fieldId).addEventListener('input', (e) => {
            this.handleCustomTextChange(fieldId, e.target.value);
        });
        
        document.getElementById(`${fieldId}Style`).addEventListener('change', (e) => {
            this.handleCustomTextStyleChange(fieldId, e.target.value);
        });
    }

    removeField(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.closest('.dynamic-field').remove();
            
            // Remove from template data
            if (fieldId.includes('Image')) {
                this.templateData.customImages = this.templateData.customImages.filter(img => img.id !== fieldId);
            } else if (fieldId.includes('Text')) {
                this.templateData.customTexts = this.templateData.customTexts.filter(text => text.id !== fieldId);
            }
            
            this.updatePreview();
        }
    }

    handleCustomImageUpload(event, fieldId) {
        const file = event.target.files[0];
        if (file && this.validateFile(file, 'image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: fieldId,
                    name: file.name,
                    url: e.target.result,
                    type: file.type
                };
                
                // Add to custom images array
                const existingIndex = this.templateData.customImages.findIndex(img => img.id === fieldId);
                if (existingIndex >= 0) {
                    this.templateData.customImages[existingIndex] = imageData;
                } else {
                    this.templateData.customImages.push(imageData);
                }
                
                // Show preview
                const preview = document.getElementById(`${fieldId}Preview`);
                preview.innerHTML = `<img src="${e.target.result}" class="dynamic-image-preview" alt="Preview">`;
                
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    handleCustomTextChange(fieldId, value) {
        const existingIndex = this.templateData.customTexts.findIndex(text => text.id === fieldId);
        const textData = {
            id: fieldId,
            content: value,
            style: document.getElementById(`${fieldId}Style`)?.value || 'normal'
        };
        
        if (existingIndex >= 0) {
            this.templateData.customTexts[existingIndex] = textData;
        } else {
            this.templateData.customTexts.push(textData);
        }
        
        this.updatePreview();
    }

    handleCustomTextStyleChange(fieldId, style) {
        const existingIndex = this.templateData.customTexts.findIndex(text => text.id === fieldId);
        if (existingIndex >= 0) {
            this.templateData.customTexts[existingIndex].style = style;
            this.updatePreview();
        }
    }

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

        // Color controls with immediate preview update
        document.getElementById("backgroundColor").addEventListener("input", (e) => {
            this.templateData.colors.background = e.target.value;
            this.updatePreview();
        });

        document.getElementById("titleColor").addEventListener("input", (e) => {
            this.templateData.colors.title = e.target.value;
            this.updatePreview();
        });

        document.getElementById("textColor").addEventListener("input", (e) => {
            this.templateData.colors.text = e.target.value;
            this.updatePreview();
        });

        // Media uploads
        this.setupMediaUpload('image');
        this.setupMediaUpload('video');
        this.setupMediaUpload('music');

        // Action buttons
        document.getElementById('previewTemplate').addEventListener('click', () => {
            this.openPreview();
        });

        document.getElementById('saveTemplate').addEventListener('click', () => {
            this.saveTemplate();
        });

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

            pickerEl.addEventListener('change', () => {
                textEl.value = pickerEl.value;
            });

            textEl.addEventListener('input', () => {
                if (this.isValidColor(textEl.value)) {
                    pickerEl.value = textEl.value;
                    pickerEl.dispatchEvent(new Event('change'));
                }
            });
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

            rangeEl.addEventListener('input', () => {
                valueEl.textContent = rangeEl.value + suffix;
            });
        });
    }

    setupMediaUpload(type) {
        const uploadArea = document.getElementById(`${type}UploadArea`);
        const fileInput = document.getElementById(`${type}Upload`);
        const uploadedContainer = document.getElementById(`uploaded${type.charAt(0).toUpperCase() + type.slice(1)}${type === 'music' ? '' : 's'}`);

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#d1d5db';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#d1d5db';
            this.handleFileUpload(e.dataTransfer.files, type);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files, type);
        });
    }

    handleFileUpload(files, type) {
        Array.from(files).forEach(file => {
            if (this.validateFile(file, type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileData = {
                        name: file.name,
                        size: this.formatFileSize(file.size),
                        url: e.target.result,
                        type: file.type
                    };

                    if (type === 'music') {
                        this.templateData.music = fileData;
                    } else {
                        this.templateData[type + 's'].push(fileData);
                    }

                    this.displayUploadedFile(fileData, type);
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    validateFile(file, type) {
        const validTypes = {
            image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            video: ['video/mp4', 'video/webm', 'video/ogg'],
            music: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mpeg']
        };

        if (!validTypes[type].includes(file.type)) {
            alert(`Tipo de arquivo não suportado para ${type}`);
            return false;
        }

        const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for others
        if (file.size > maxSize) {
            alert(`Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(maxSize)}`);
            return false;
        }

        return true;
    }

    displayUploadedFile(fileData, type) {
        const container = document.getElementById(`uploaded${type.charAt(0).toUpperCase() + type.slice(1)}${type === 'music' ? '' : 's'}`);
        
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        
        let preview = '';
        if (type === 'image') {
            preview = `<img src="${fileData.url}" alt="${fileData.name}">`;
        } else {
            preview = `<i class="fas fa-${type === 'video' ? 'video' : 'music'}"></i>`;
        }

        mediaItem.innerHTML = `
            ${preview}
            <div class="media-item-info">
                <div class="media-item-name">${fileData.name}</div>
                <div class="media-item-size">${fileData.size}</div>
            </div>
            <button class="media-item-remove" onclick="templateEditor.removeMedia('${type}', '${fileData.name}')">
                <i class="fas fa-trash"></i>
            </button>
        `;

        if (type === 'music') {
            container.innerHTML = ''; // Replace existing music
        }
        
        container.appendChild(mediaItem);
    }

    removeMedia(type, fileName) {
        if (type === 'music') {
            this.templateData.music = null;
            document.getElementById('uploadedMusic').innerHTML = '';
        } else {
            this.templateData[type + 's'] = this.templateData[type + 's'].filter(item => item.name !== fileName);
            // Remove from DOM
            const container = document.getElementById(`uploaded${type.charAt(0).toUpperCase() + type.slice(1)}s`);
            const items = container.querySelectorAll('.media-item');
            items.forEach(item => {
                if (item.querySelector('.media-item-name').textContent === fileName) {
                    item.remove();
                }
            });
        }
        this.updatePreview();
    }

    loadTemplate() {
        const templatePath = `templates/${this.currentTemplate}/index.html`;
        document.getElementById('previewFrame').src = templatePath;
        
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
            timeline: this.getDefaultTimeline(),
            customTexts: [],
            customImages: []
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

    getDefaultTimeline() {
        return [
            { date: 'Janeiro 2023', event: 'Primeiro Encontro', description: 'O início de tudo' },
            { date: 'Março 2023', event: 'Momento Especial', description: 'Uma data importante' },
            { date: 'Hoje', event: 'Celebração', description: 'Comemorando juntos' }
        ];
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
        document.getElementById('closeDownloadModal').addEventListener('click', () => {
            document.getElementById('downloadModal').classList.remove('active');
        });

        document.getElementById('cancelDownload').addEventListener('click', () => {
            document.getElementById('downloadModal').classList.remove('active');
        });

        document.getElementById('confirmDownload').addEventListener('click', () => {
            this.downloadTemplate();
        });

        // Timeline modal
        if (document.getElementById('closeTimelineModal')) {
            document.getElementById('closeTimelineModal').addEventListener('click', () => {
                document.getElementById('timelineModal').classList.remove('active');
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
            // Create a complete HTML package with all files
            const templateHTML = await this.generateCompleteHTML();
            
            // Create a zip file with all assets
            const zip = await this.createZipPackage(templateHTML, fileName);
            
            // Download the zip file
            this.downloadBlob(zip, `${fileName}.zip`);
            
        } catch (error) {
            console.error('Erro ao gerar download:', error);
            alert('Erro ao gerar o download. Tente novamente.');
        }
    }

    async createZipPackage(html, fileName) {
        const zip = new JSZip();
        zip.file(`${fileName}.html`, html);

        // Add CSS
        const cssResponse = await fetch(`templates/${this.currentTemplate}/style.css`);
        const cssContent = await cssResponse.text();
        zip.file(`css/style.css`, cssContent);

        // Add JS
        const jsResponse = await fetch(`templates/${this.currentTemplate}/script.js`);
        const jsContent = await jsResponse.text();
        zip.file(`js/script.js`, jsContent);

        // Add images
        for (const img of this.templateData.images) {
            const response = await fetch(img.url);
            const blob = await response.blob();
            zip.file(`images/${img.name}`, blob);
        }

        for (const img of this.templateData.customImages) {
            const response = await fetch(img.url);
            const blob = await response.blob();
            zip.file(`images/${img.name}`, blob);
        }

        // Add videos
        for (const video of this.templateData.videos) {
            const response = await fetch(video.url);
            const blob = await response.blob();
            zip.file(`videos/${video.name}`, blob);
        }

        // Add music
        if (this.templateData.music) {
            const response = await fetch(this.templateData.music.url);
            const blob = await response.blob();
            zip.file(`music/${this.templateData.music.name}`, blob);
        }

        return await zip.generateAsync({ type: "blob" });
    }



    async generateCompleteHTML() {
        // Get the current template HTML
        const response = await fetch(`templates/${this.currentTemplate}/index.html`);
        let html = await response.text();
        
        // Replace placeholders with actual data
        html = html.replace(/{{title}}/g, this.templateData.title);
        html = html.replace(/{{subtitle}}/g, this.templateData.subtitle);
        html = html.replace(/{{message}}/g, this.templateData.message);

        // Add custom texts
        let customTextsHTML = 
        this.templateData.customTexts.forEach((text) => {
            const className = `custom-text-${text.style}`;
            customTextsHTML += `<div class="${className}">${text.content}</div>\n`;
        });

        // Add custom images
        let customImagesHTML = 
        this.templateData.customImages.forEach((img) => {
            customImagesHTML += `<div class="custom-image"><img src="images/${img.name}" alt="${img.name}"></div>\n`;
        });

        // Insert custom content before the footer
        const footerIndex = html.indexOf("<footer");
        if (footerIndex !== -1) {
            html = html.slice(0, footerIndex) + customTextsHTML + customImagesHTML + html.slice(footerIndex);
        }

        // Add custom CSS
        const customCSS = this.generateCustomCSS();
        html = html.replace(
            "</head>",
            `<style>${customCSS}</style>\n</head>`
        );
        
        return html;

    async downloadPDF(fileName) {
        alert('Funcionalidade de PDF em desenvolvimento');
    }

    saveTemplate() {
        // Save template data to localStorage
        const templateKey = `template_${this.currentTemplate}_${Date.now()}`;
        localStorage.setItem(templateKey, JSON.stringify(this.templateData));
        
        alert('Template salvo com sucesso!');
    }

    openPreview() {
        // Open preview in new window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>Preview - ${this.templateData.title}</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        iframe { width: 100%; height: calc(100vh - 40px); border: none; }
                    </style>
                </head>
                <body>
                    <iframe src="templates/${this.currentTemplate}/index.html"></iframe>
                </body>
            </html>
        `);
    }

    // Utility functions
    isValidColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileExtension(mimeType) {
        const extensions = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
            'video/ogg': 'ogv',
            'audio/mp3': 'mp3',
            'audio/mpeg': 'mp3',
            'audio/wav': 'wav',
            'audio/ogg': 'ogg',
            'audio/m4a': 'm4a'
        };
        return extensions[mimeType] || 'bin';
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

// Initialize the enhanced template editor
const templateEditor = new EnhancedTemplateEditor();

// Handle messages from preview iframe
window.addEventListener('message', (event) => {
    if (event.data.type === 'templateReady') {
        templateEditor.updatePreview();
    }
});

