// Enhanced Romantic Template Script with Drag and Drop Support
class RomanticTemplateHandler {
    constructor() {
        this.templateData = {
            title: 'Nossa História de Amor',
            subtitle: 'Uma lembrança especial para você',
            message: 'Meu amor, cada dia ao seu lado é uma nova página em nossa história de amor...',
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
            timeline: [
                { date: 'Janeiro 2023', event: 'Nosso Primeiro Encontro', description: 'O dia em que nossas vidas se cruzaram' },
                { date: 'Março 2023', event: 'Primeiro "Eu Te Amo"', description: 'Palavras que mudaram tudo' },
                { date: 'Hoje', event: 'Celebrando Nosso Amor', description: 'E muitos momentos especiais ainda virão' }
            ]
        };
        
        this.editableElements = new Map();
        this.init();
    }

    init() {
        this.setupEditableElements();
        this.setupMusicControl();
        this.setupMessageListener();
        this.makeTimelineEditable();
        this.addResponsiveStyles();
        
        // Notify parent that template is ready
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'templateReady' }, '*');
        }
    }

    setupEditableElements() {
        // Make all elements with data-field attribute editable
        document.querySelectorAll('[data-field]').forEach(element => {
            const field = element.dataset.field;
            this.editableElements.set(field, element);
            
            // Add click to edit functionality
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.makeElementEditable(element, field);
            });
            
            // Add visual feedback
            element.style.cursor = 'pointer';
            element.title = 'Clique para editar';
            
            // Add hover effect
            element.addEventListener('mouseenter', () => {
                element.style.outline = '2px dashed rgba(255, 255, 255, 0.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.outline = 'none';
            });
        });
    }

    makeElementEditable(element, field) {
        const currentValue = element.textContent.trim();
        const isTextarea = element.tagName.toLowerCase() === 'p' && currentValue.length > 50;
        
        const input = document.createElement(isTextarea ? 'textarea' : 'input');
        input.value = currentValue;
        input.style.cssText = window.getComputedStyle(element).cssText;
        input.style.border = '2px solid #ffffff';
        input.style.background = 'rgba(255, 255, 255, 0.9)';
        input.style.color = '#333333';
        input.style.padding = '8px';
        input.style.borderRadius = '4px';
        input.style.width = '100%';
        input.style.minHeight = element.offsetHeight + 'px';
        
        if (isTextarea) {
            input.rows = Math.max(3, Math.ceil(currentValue.length / 50));
            input.style.resize = 'vertical';
        }
        
        // Replace element with input
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element.nextSibling);
        
        input.focus();
        input.select();
        
        const saveEdit = () => {
            const newValue = input.value.trim();
            if (newValue !== currentValue) {
                element.textContent = newValue;
                this.templateData[field] = newValue;
                this.notifyParentOfChange();
            }
            
            input.remove();
            element.style.display = '';
        };
        
        const cancelEdit = () => {
            input.remove();
            element.style.display = '';
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isTextarea) {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    }

    makeTimelineEditable() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            const dateEl = item.querySelector('.timeline-date');
            const eventEl = item.querySelector('.timeline-event');
            const descEl = item.querySelector('.timeline-description');
            
            [dateEl, eventEl, descEl].forEach(el => {
                if (el) {
                    el.style.cursor = 'pointer';
                    el.title = 'Clique para editar';
                    
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.editTimelineElement(el, index);
                    });
                    
                    el.addEventListener('mouseenter', () => {
                        el.style.outline = '1px dashed rgba(255, 255, 255, 0.5)';
                    });
                    
                    el.addEventListener('mouseleave', () => {
                        el.style.outline = 'none';
                    });
                }
            });
        });
    }

    editTimelineElement(element, timelineIndex) {
        const currentValue = element.textContent.trim();
        const fieldType = element.classList.contains('timeline-date') ? 'date' :
                         element.classList.contains('timeline-event') ? 'event' : 'description';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.style.cssText = window.getComputedStyle(element).cssText;
        input.style.border = '2px solid #ffffff';
        input.style.background = 'rgba(255, 255, 255, 0.9)';
        input.style.color = '#333333';
        input.style.padding = '4px 8px';
        input.style.borderRadius = '4px';
        input.style.width = '100%';
        
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element.nextSibling);
        
        input.focus();
        input.select();
        
        const saveEdit = () => {
            const newValue = input.value.trim();
            if (newValue !== currentValue) {
                element.textContent = newValue;
                
                // Update timeline data
                if (!this.templateData.timeline[timelineIndex]) {
                    this.templateData.timeline[timelineIndex] = {};
                }
                this.templateData.timeline[timelineIndex][fieldType] = newValue;
                
                this.notifyParentOfChange();
            }
            
            input.remove();
            element.style.display = '';
        };
        
        const cancelEdit = () => {
            input.remove();
            element.style.display = '';
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
            }
        });
    }

    setupMusicControl() {
        const musicToggle = document.getElementById('musicToggle');
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (musicToggle && backgroundMusic) {
            let isPlaying = false;
            
            musicToggle.addEventListener('click', () => {
                if (isPlaying) {
                    backgroundMusic.pause();
                    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                    musicToggle.classList.remove('playing');
                } else {
                    backgroundMusic.play().catch(e => {
                        console.log('Autoplay prevented:', e);
                    });
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                    musicToggle.classList.add('playing');
                }
                isPlaying = !isPlaying;
            });
            
            backgroundMusic.addEventListener('ended', () => {
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.classList.remove('playing');
                isPlaying = false;
            });
        }
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'updateTemplate') {
                this.updateTemplate(event.data.data);
            }
        });
    }

    updateTemplate(data) {
        // Update basic template data
        Object.assign(this.templateData, data);
        
        // Update text content
        if (data.title && this.editableElements.has('title')) {
            this.editableElements.get('title').textContent = data.title;
        }
        
        if (data.subtitle && this.editableElements.has('subtitle')) {
            this.editableElements.get('subtitle').textContent = data.subtitle;
        }
        
        if (data.message && this.editableElements.has('message')) {
            this.editableElements.get('message').textContent = data.message;
        }
        
        // Update colors
        if (data.colors) {
            this.updateColors(data.colors);
        }
        
        // Update fonts
        if (data.fonts) {
            this.updateFonts(data.fonts);
        }
        
        // Update sizes
        if (data.sizes) {
            this.updateSizes(data.sizes);
        }
        
        // Update custom elements
        if (data.elements) {
            this.updateCustomElements(data.elements);
        }
        
        // Update timeline
        if (data.timeline) {
            this.updateTimeline(data.timeline);
        }
    }

    updateColors(colors) {
        const root = document.documentElement;
        
        if (colors.background) {
            root.style.setProperty('--bg-color', colors.background);
            document.body.style.background = colors.background;
        }
        
        if (colors.title) {
            root.style.setProperty('--title-color', colors.title);
            document.querySelectorAll('.main-title, h1, h2').forEach(el => {
                el.style.color = colors.title;
            });
        }
        
        if (colors.text) {
            root.style.setProperty('--text-color', colors.text);
            document.querySelectorAll('p, .timeline-description').forEach(el => {
                el.style.color = colors.text;
            });
        }
    }

    updateFonts(fonts) {
        const root = document.documentElement;
        
        if (fonts.title) {
            root.style.setProperty('--title-font', `'${fonts.title}', cursive`);
            document.querySelectorAll('.main-title, h1, h2').forEach(el => {
                el.style.fontFamily = `'${fonts.title}', cursive`;
            });
        }
        
        if (fonts.text) {
            root.style.setProperty('--text-font', `'${fonts.text}', sans-serif`);
            document.body.style.fontFamily = `'${fonts.text}', sans-serif`;
        }
    }

    updateSizes(sizes) {
        const root = document.documentElement;
        
        if (sizes.title) {
            root.style.setProperty('--title-size', sizes.title + 'px');
            document.querySelectorAll('.main-title, h1').forEach(el => {
                el.style.fontSize = sizes.title + 'px';
            });
        }
        
        if (sizes.text) {
            root.style.setProperty('--text-size', sizes.text + 'px');
            document.body.style.fontSize = sizes.text + 'px';
        }
    }

    updateCustomElements(elements) {
        // Remove existing custom elements
        document.querySelectorAll('.custom-element').forEach(el => el.remove());
        
        // Add new custom elements
        elements.forEach(element => {
            this.addCustomElement(element);
        });
    }

    addCustomElement(element) {
        const container = document.querySelector('.container');
        if (!container) return;
        
        const customEl = document.createElement('div');
        customEl.className = 'custom-element';
        customEl.style.position = 'absolute';
        customEl.style.left = element.position.x + 'px';
        customEl.style.top = element.position.y + 'px';
        customEl.style.width = element.size.width + 'px';
        customEl.style.height = element.size.height + 'px';
        customEl.style.zIndex = '10';
        
        switch (element.type) {
            case 'text':
                customEl.innerHTML = `<div style="font-size: ${element.style.fontSize}; font-family: ${element.style.fontFamily}; color: ${element.style.color}; font-weight: ${element.style.fontWeight}; text-align: ${element.style.textAlign}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${element.style.textAlign};">${element.content}</div>`;
                break;
            case 'image':
                if (element.content) {
                    customEl.innerHTML = `<img src="${element.content}" style="width: 100%; height: 100%; object-fit: ${element.style.objectFit}; border-radius: ${element.style.borderRadius};" alt="Imagem personalizada">`;
                }
                break;
            case 'video':
                if (element.content) {
                    customEl.innerHTML = `<video src="${element.content}" style="width: 100%; height: 100%; border-radius: ${element.style.borderRadius};" ${element.properties.controls ? 'controls' : ''}></video>`;
                }
                break;
        }
        
        container.appendChild(customEl);
    }

    updateTimeline(timelineData) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineData.forEach((item, index) => {
            if (timelineItems[index]) {
                const dateEl = timelineItems[index].querySelector('.timeline-date');
                const eventEl = timelineItems[index].querySelector('.timeline-event');
                const descEl = timelineItems[index].querySelector('.timeline-description');
                
                if (dateEl && item.date) dateEl.textContent = item.date;
                if (eventEl && item.event) eventEl.textContent = item.event;
                if (descEl && item.description) descEl.textContent = item.description;
            }
        });
    }

    addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced responsive styles */
            @media (max-width: 768px) {
                .container {
                    padding: 10px;
                }
                
                .main-title {
                    font-size: calc(var(--title-size, 48px) * 0.8) !important;
                }
                
                .subtitle {
                    font-size: calc(var(--text-size, 16px) * 1.1) !important;
                }
                
                .gallery-grid {
                    grid-template-columns: 1fr !important;
                    gap: 15px !important;
                }
                
                .timeline-item {
                    flex-direction: column !important;
                    text-align: center !important;
                }
                
                .timeline-date {
                    margin-bottom: 10px !important;
                }
                
                .custom-element {
                    position: relative !important;
                    left: auto !important;
                    top: auto !important;
                    width: 100% !important;
                    height: auto !important;
                    margin: 10px 0 !important;
                }
            }
            
            @media (max-width: 480px) {
                .main-title {
                    font-size: calc(var(--title-size, 48px) * 0.6) !important;
                }
                
                .message-card {
                    padding: 15px !important;
                }
                
                .photo-item {
                    height: 200px !important;
                }
            }
            
            /* Editable element styles */
            [data-field]:hover {
                outline: 2px dashed rgba(255, 255, 255, 0.5) !important;
                outline-offset: 2px;
            }
            
            .timeline-item:hover .timeline-date,
            .timeline-item:hover .timeline-event,
            .timeline-item:hover .timeline-description {
                outline: 1px dashed rgba(255, 255, 255, 0.5) !important;
                outline-offset: 1px;
            }
            
            /* Music control enhancements */
            .music-control .music-btn.playing {
                background: rgba(255, 255, 255, 0.3);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            /* Custom element responsive behavior */
            .custom-element img,
            .custom-element video {
                max-width: 100%;
                height: auto;
            }
        `;
        document.head.appendChild(style);
    }

    notifyParentOfChange() {
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'templateDataChanged',
                data: this.templateData
            }, '*');
        }
    }

    // Public methods for external access
    getTemplateData() {
        return this.templateData;
    }

    setTemplateData(data) {
        this.updateTemplate(data);
    }
}

// Initialize the romantic template handler
const romanticTemplate = new RomanticTemplateHandler();

// Export for external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RomanticTemplateHandler;
}

