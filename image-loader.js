// image-loader.js - Enhanced Image Loading System
class ImageLoader {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        this.findImages();
        this.setupIntersectionObserver();
    }

    findImages() {
        const imageElements = document.querySelectorAll('[data-src]');
        this.images = Array.from(imageElements);
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.preloadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => observer.observe(img));
    }

    preloadImage(element) {
        const src = element.getAttribute('data-src');
        const img = new Image();
        
        img.onload = () => {
            element.style.backgroundImage = `url('${src}')`;
            element.classList.add('loaded');
        };

        img.onerror = () => {
            this.createFallback(element, src);
        };

        img.src = src;
    }

    createFallback(element, originalSrc) {
        // Create a colored fallback based on the project type
        const fallbackColors = {
            'work1': 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
            'work2': 'linear-gradient(135deg, #2D4A3C 0%, #3A6650 100%)', 
            'work3': 'linear-gradient(135deg, #4A3C2D 0%, #66503A 100%)',
            'portfolio1': 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
            'portfolio2': 'linear-gradient(135deg, #2D4A3C 0%, #3A6650 100%)',
            'portfolio3': 'linear-gradient(135deg, #4A3C2D 0%, #66503A 100%)'
        };

        const fileName = originalSrc.split('/').pop().split('.')[0];
        const fallbackColor = fallbackColors[fileName] || 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)';
        
        element.style.background = fallbackColor;
        element.classList.add('loaded');
        
        // Add a subtle pattern to indicate it's a placeholder
        element.style.backgroundImage = `
            ${fallbackColor},
            linear-gradient(45deg, rgba(200, 183, 138, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(200, 183, 138, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(200, 183, 138, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(200, 183, 138, 0.1) 75%)
        `;
        element.style.backgroundSize = '100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px';
        element.style.backgroundPosition = '0 0, 0 0, 0 10px, 10px -10px, -10px 0px';
    }
}

// Initialize image loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new ImageLoader();
});