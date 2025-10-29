// premium-grid.js - Enhanced Section-Specific Grid System
class PremiumGridBackground {
    constructor() {
        this.canvas = document.getElementById('grid-canvas');
        if (!this.canvas) {
            console.warn('Grid canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.currentSection = 'home';
        this.scrollProgress = 0;
        
        // Section-specific grid configurations
         this.gridConfigs = {
            home: {
                type: 'fadeTopLeft',
                intensity: 0.1,
                size: 40,
                color: 'rgba(255, 203, 154, 0.08)', // accent-warm
                fadeRadius: 0.6
            },
            work: {
                type: 'diagonalCorners',
                intensity: 0.15,
                size: 35,
                color: 'rgba(217, 176, 140, 0.12)', // accent-gold
                cornerSize: 0.3
            },
            portfolio: {
                type: 'diagonalCorners',
                intensity: 0.15,
                size: 35,
                color: 'rgba(217, 176, 140, 0.12)', // accent-gold
                cornerSize: 0.3
            },
            services: {
                type: 'verticalPatch',
                intensity: 0.12,
                size: 30,
                color: 'rgba(255, 203, 154, 0.1)', // accent-warm
                patchWidth: 0.4,
                side: 'right'
            },
            manifest: {
                type: 'targetBrackets',
                intensity: 0.2,
                size: 25,
                color: 'rgba(217, 176, 140, 0.15)', // accent-gold
                bracketSize: 0.2
            }
        };
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());
        
        // Set initial mouse position to center
        this.mouse.x = window.innerWidth / 2;
        this.mouse.y = window.innerHeight / 2;
        this.targetMouse = { ...this.mouse };
        
        this.detectCurrentSection();
    }
    
    resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    
    // Scale the context to ensure crisp lines
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
    
    onMouseMove(e) {
        this.targetMouse.x = e.clientX;
        this.targetMouse.y = e.clientY;
    }
    
    onScroll() {
        this.detectCurrentSection();
        this.calculateScrollProgress();
    }
    
    detectCurrentSection() {
        const sections = ['home', 'work', 'portfolio', 'services', 'manifest'];
        const scrollY = window.scrollY + window.innerHeight / 3;
        
        for (let section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY;
                const offsetBottom = offsetTop + rect.height;
                
                if (scrollY >= offsetTop && scrollY < offsetBottom) {
                    this.currentSection = section;
                    break;
                }
            }
        }
    }
    
    calculateScrollProgress() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = Math.min(scrollY / docHeight, 1);
    }
    
    drawGrid() {
    // Clear with higher precision
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Enable crisp line rendering
    this.ctx.translate(0.5, 0.5);
    
    // Apply smooth mouse movement
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
    
    const config = this.gridConfigs[this.currentSection] || this.gridConfigs.home;
    
    // Enhanced line quality
    this.ctx.lineCap = 'square';
    this.ctx.lineJoin = 'miter';
    
    switch (config.type) {
        case 'fadeTopLeft':
            this.drawFadeTopLeftGrid(config);
            break;
        case 'diagonalCorners':
            this.drawDiagonalCornersGrid(config);
            break;
        case 'verticalPatch':
            this.drawVerticalPatchGrid(config);
            break;
        case 'targetBrackets':
            this.drawTargetBracketsGrid(config);
            break;
    }
    
    this.ctx.translate(-0.5, -0.5);
}

    
    drawFadeTopLeftGrid(config) {
        const { intensity, size, color, fadeRadius } = config;
        const centerX = 0;
        const centerY = 0;
        const maxDistance = Math.sqrt(
            Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2)
        ) * fadeRadius;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.8;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += size) {
            this.ctx.beginPath();
            for (let y = 0; y <= this.canvas.height; y += 2) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const opacity = Math.max(0, 1 - (distance / maxDistance));
                
                if (opacity > 0) {
                    this.ctx.strokeStyle = `rgba(200, 183, 138, ${intensity * opacity})`;
                    if (y === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
            }
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += size) {
            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 2) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const opacity = Math.max(0, 1 - (distance / maxDistance));
                
                if (opacity > 0) {
                    this.ctx.strokeStyle = `rgba(200, 183, 138, ${intensity * opacity})`;
                    if (x === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
            }
            this.ctx.stroke();
        }
    }
    
    drawDiagonalCornersGrid(config) {
        const { intensity, size, color, cornerSize } = config;
        const cornerMargin = 100;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.6;
        
        // Top-left corner
        this.drawCornerGrid(0, 0, cornerMargin, cornerMargin, size, intensity);
        
        // Top-right corner
        this.drawCornerGrid(this.canvas.width, 0, -cornerMargin, cornerMargin, size, intensity);
        
        // Bottom-left corner
        this.drawCornerGrid(0, this.canvas.height, cornerMargin, -cornerMargin, size, intensity);
        
        // Bottom-right corner
        this.drawCornerGrid(this.canvas.width, this.canvas.height, -cornerMargin, -cornerMargin, size, intensity);
    }
    
    drawCornerGrid(startX, startY, width, height, size, intensity) {
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(startX, startY, width, height);
        this.ctx.clip();
        
        // Draw vertical lines
        for (let x = startX; Math.abs(x - startX) <= absWidth; x += size * Math.sign(width || 1)) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, startY + height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = startY; Math.abs(y - startY) <= absHeight; y += size * Math.sign(height || 1)) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(startX + width, y);
            this.ctx.stroke();
        }
        
        // Draw diagonal lines
        const diagonalCount = Math.min(absWidth, absHeight) / size;
        for (let i = 0; i <= diagonalCount; i++) {
            const offset = i * size;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY + offset);
            this.ctx.lineTo(startX + offset, startY);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX + width, startY + offset);
            this.ctx.lineTo(startX + width - offset, startY);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawVerticalPatchGrid(config) {
        const { intensity, size, color, patchWidth, side } = config;
        const patchX = side === 'right' ? this.canvas.width * (1 - patchWidth) : 0;
        const patchWidthPx = this.canvas.width * patchWidth;
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(patchX, 0, patchWidthPx, this.canvas.height);
        this.ctx.clip();
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.5;
        
        // Draw vertical lines
        for (let x = patchX; x <= patchX + patchWidthPx; x += size) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines with fading intensity
        for (let y = 0; y <= this.canvas.height; y += size) {
            const centerY = this.canvas.height / 2;
            const distanceFromCenter = Math.abs(y - centerY);
            const fade = Math.max(0, 1 - (distanceFromCenter / centerY));
            
            this.ctx.strokeStyle = `rgba(200, 183, 138, ${intensity * fade})`;
            this.ctx.beginPath();
            this.ctx.moveTo(patchX, y);
            this.ctx.lineTo(patchX + patchWidthPx, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawTargetBracketsGrid(config) {
        const { intensity, size, color, bracketSize } = config;
        const bracketMargin = 100;
        const bracketLength = 80;
        const bracketThickness = 2;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.8;
        
        // Draw full grid with increasing intensity toward bottom
        const baseIntensity = intensity * (0.3 + this.scrollProgress * 0.7);
        
        for (let x = 0; x <= this.canvas.width; x += size) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.strokeStyle = `rgba(200, 183, 138, ${baseIntensity * (0.5 + (x / this.canvas.width) * 0.5)})`;
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += size) {
            const intensityMultiplier = 0.3 + (y / this.canvas.height) * 0.7;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.strokeStyle = `rgba(200, 183, 138, ${baseIntensity * intensityMultiplier})`;
            this.ctx.stroke();
        }
        
        // Draw targeting brackets around CTA area
        this.drawTargetingBrackets();
    }
    
    drawTargetingBrackets() {
        const ctaSection = document.querySelector('.services-cta, .manifest-form');
        if (!ctaSection) return;
        
        const rect = ctaSection.getBoundingClientRect();
        const bracketColor = 'rgba(200, 183, 138, 0.4)';
        const bracketLength = 60;
        const bracketThickness = 2;
        
        this.ctx.strokeStyle = bracketColor;
        this.ctx.lineWidth = bracketThickness;
        this.ctx.fillStyle = bracketColor;
        
        // Top-left bracket
        this.drawBracket(rect.left, rect.top, bracketLength, 'top-left');
        // Top-right bracket
        this.drawBracket(rect.right, rect.top, bracketLength, 'top-right');
        // Bottom-left bracket
        this.drawBracket(rect.left, rect.bottom, bracketLength, 'bottom-left');
        // Bottom-right bracket
        this.drawBracket(rect.right, rect.bottom, bracketLength, 'bottom-right');
    }
    
    drawBracket(x, y, length, position) {
        this.ctx.beginPath();
        
        switch (position) {
            case 'top-left':
                this.ctx.moveTo(x, y - length);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x + length, y);
                break;
            case 'top-right':
                this.ctx.moveTo(x, y - length);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x - length, y);
                break;
            case 'bottom-left':
                this.ctx.moveTo(x, y + length);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x + length, y);
                break;
            case 'bottom-right':
                this.ctx.moveTo(x, y + length);
                this.ctx.lineTo(x, y);
                this.ctx.lineTo(x - length, y);
                break;
        }
        
        this.ctx.stroke();
    }
    
    animate() {
        this.drawGrid();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new PremiumGridBackground();
});