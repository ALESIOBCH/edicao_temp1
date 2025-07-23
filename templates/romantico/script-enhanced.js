// Enhanced Romantic Template Script
class RomanticTemplate {
    constructor() {
        this.isEditMode = false;
        this.templateData = null;
        this.init();
    }

    init() {
        this.setupMusicControl();
        this.setupEditMode();
        this.setupMessageListener();
        this.setupAnimations();
    }

    setupMusicControl() {
        const musicToggle = document.getElementById('musicToggle');
        const backgroundMusic = document.getElementById('backgroundMusic');

        if (musicToggle && backgroundMusic) {
            musicToggle.addEventListener('click', () => {
                if (backgroundMusic.paused) {
                    backgroundMusic.play();
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    backgroundMusic.pause();
                    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                }
            });
        }
    }

    setupEditMode() {
        // This will be used when the template is in edit mode
        const editableElements = document.querySelectorAll('.editable');
        
        editableElements.forEach(element => {
            element.addEventListener('click', () => {
                if (this.isEditMode) {
                    this.makeElementEditable(element);
                }
            });
        });

        const editableImages = document.querySelectorAll('.editable-image');
        editableImages.forEach(image => {
            image.addEventListener('click', () => {
                if (this.isEditMode) {
                    this.openImageSelector(image);
                }
            });
        });
    }

    setupMessageListener() {
        // Listen for messages from the parent editor
        window.addEventListener('message', (event) => {
            if (event.data.type === 'updateTemplate') {
                this.updateTemplate(event.data.data);
            }
        });

        // Notify parent that template is ready
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'templateReady' }, '*');
        }
    }

    setupAnimations() {
        // Add smooth animations and transitions
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        });

        const animatedElements = document.querySelectorAll('.photo-item, .message-card, .timeline-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    updateTemplate(data) {
        this.templateData = data;
        
        // Update text content
        this.updateTextContent(data);
        
        // Update colors and styles
        this.updateStyles(data);
        
        // Update images
        this.updateImages(data);
        
        // Update music
        this.updateMusic(data);
        
        // Add custom content
        this.addCustomContent(data);
    }

    updateTextContent(data) {
        const textMappings = {
            'title': '.main-title',
            'subtitle': '.subtitle',
            'message': '.message-text'
        };

        Object.entries(textMappings).forEach(([key, selector]) => {
            const element = document.querySelector(selector);
            if (element && data[key]) {
                element.textContent = data[key];
            }
        });
    }

    updateStyles(data) {
        // Create or update custom styles
        let styleElement = document.getElementById('custom-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-styles';
            document.head.appendChild(styleElement);
        }

        const customCSS = `
            :root {
                --bg-color: ${data.colors.background};
                --title-color: ${data.colors.title};
                --text-color: ${data.colors.text};
                --title-font: '${data.fonts.title}', cursive;
                --text-font: '${data.fonts.text}', sans-serif;
                --title-size: ${data.sizes.title}px;
                --text-size: ${data.sizes.text}px;
            }
            
            body {
                background: linear-gradient(135deg, var(--bg-color), ${this.adjustColor(data.colors.background, -20)}) !important;
                font-family: var(--text-font);
                font-size: var(--text-size);
                color: var(--text-color);
            }
            
            .main-title, h1 {
                font-family: var(--title-font) !important;
                font-size: var(--title-size) !important;
                color: var(--title-color) !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .subtitle {
                color: var(--title-color) !important;
                font-size: calc(var(--text-size) * 1.2) !important;
            }
            
            .section-title {
                color: var(--title-color) !important;
                font-family: var(--title-font) !important;
            }
            
            .message-text {
                color: var(--text-color) !important;
                font-size: var(--text-size) !important;
            }
            
            .custom-text-normal {
                font-size: var(--text-size);
                color: var(--text-color);
                margin: 15px 0;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                backdrop-filter: blur(10px);
            }
            
            .custom-text-title {
                font-family: var(--title-font);
                font-size: calc(var(--title-size) * 0.8);
                color: var(--title-color);
                margin: 25px 0;
                text-align: center;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .custom-text-subtitle {
                font-size: calc(var(--text-size) * 1.3);
                color: var(--title-color);
                margin: 20px 0;
                text-align: center;
                font-weight: 600;
            }
            
            .custom-text-caption {
                font-size: calc(var(--text-size) * 0.9);
                color: var(--text-color);
                font-style: italic;
                margin: 10px 0;
                opacity: 0.8;
            }
            
            .custom-image {
                text-align: center;
                margin: 25px 0;
            }
            
            .custom-image img {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            }
            
            .custom-image img:hover {
                transform: scale(1.02);
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        styleElement.textContent = customCSS;
    }

    updateImages(data) {
        // Update gallery images
        data.images.forEach((img, index) => {
            const galleryImg = document.querySelector(`.gallery-img[data-field="photo${index + 1}"]`);
            if (galleryImg) {
                galleryImg.src = img.url;
                galleryImg.alt = img.name;
            }
        });
    }

    updateMusic(data) {
        if (data.music) {
            const backgroundMusic = document.getElementById('backgroundMusic');
            if (backgroundMusic) {
                backgroundMusic.src = data.music.url;
            }
        }
    }

    addCustomContent(data) {
        // Remove existing custom content
        const existingCustom = document.querySelectorAll('.custom-content');
        existingCustom.forEach(el => el.remove());

        // Add custom texts
        if (data.customTexts && data.customTexts.length > 0) {
            const container = this.getCustomContentContainer();
            
            data.customTexts.forEach((text) => {
                const textElement = document.createElement('div');
                textElement.className = `custom-content custom-text-${text.style}`;
                textElement.textContent = text.content;
                container.appendChild(textElement);
            });
        }

        // Add custom images
        if (data.customImages && data.customImages.length > 0) {
            const container = this.getCustomContentContainer();
            
            data.customImages.forEach((img) => {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'custom-content custom-image';
                
                const imageElement = document.createElement('img');
                imageElement.src = img.url;
                imageElement.alt = img.name;
                
                imageContainer.appendChild(imageElement);
                container.appendChild(imageContainer);
            });
        }
    }

    getCustomContentContainer() {
        let container = document.getElementById('custom-content-container');
        if (!container) {
            container = document.createElement('section');
            container.id = 'custom-content-container';
            container.className = 'custom-content-section';
            
            // Insert before footer
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.parentNode.insertBefore(container, footer);
            } else {
                document.querySelector('.container').appendChild(container);
            }
        }
        return container;
    }

    adjustColor(color, amount) {
        // Helper function to lighten or darken a color
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    makeElementEditable(element) {
        // Make element editable inline
        const originalText = element.textContent;
        element.contentEditable = true;
        element.focus();
        
        element.addEventListener('blur', () => {
            element.contentEditable = false;
            // Save changes
            this.saveElementChange(element);
        });

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                element.blur();
            }
            if (e.key === 'Escape') {
                element.textContent = originalText;
                element.blur();
            }
        });
    }

    openImageSelector(imageElement) {
        // Create file input for image selection
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imageElement.src = e.target.result;
                    this.saveImageChange(imageElement, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.click();
    }

    saveElementChange(element) {
        // This would normally save to a backend or local storage
        console.log('Element changed:', element.textContent);
    }

    saveImageChange(imageElement, newSrc) {
        // This would normally save to a backend or local storage
        console.log('Image changed:', newSrc);
    }
}

// Initialize the romantic template
document.addEventListener('DOMContentLoaded', () => {
    new RomanticTemplate();
});

