// main.js - CORRECTED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // SVG Gradient Wave Background - KEEP THIS INTACT
    /*--------------------
  /* SETTINGS --------------------*/
let settings = {
    amplitudeX: 120,             // Slightly stronger horizontal wave motion
    amplitudeY: 30,              // Subtle vertical depth for smooth fluidity
    lines: 30,                   // Increased density for richer layering
    hueStartColor: 40,           // Warmer, golden undertone start
    saturationStartColor: 35,    // Muted saturation for luxury tone
    lightnessStartColor: 75,     // Brighter edge for premium highlights
    hueEndColor: 220,            // Deep cool tone — balances the warmth
    saturationEndColor: 25,      // Subdued end tone for subtle blending
    lightnessEndColor: 10,       // Dark, rich blacks for elegant contrast
    smoothness: 3.2,             // Smoother transitions between gradients
    offsetX: 14,                 // Minor offset for dynamic asymmetry
    fill: true,
    crazyness: false,
    glowIntensity: 0.45,         // Elevated glow — refined shimmer, not noise
    vignette: true,
    blendMode: "overlay",        // Creates depth between bright & dark regions
    opacity: 0.88,               // Slightly reduced to add visual softness
};

    /*--------------------
    VARS
    --------------------*/
    let svg = document.getElementById('svg'),
        winW = window.innerWidth,
        winH = window.innerHeight,
        Colors = [],
        Paths = [],
        Mouse = {
            x: winW / 2,
            y: winH / 2
        },
        overflow,
        startColor,
        endColor,
        gui;

    /*--------------------
    PATH
    --------------------*/
    class Path {
        constructor (y, fill, offsetX) {
            this.rootY = y;
            this.fill = fill;
            this.offsetX = offsetX;
        };
        
        createRoot() {
            this.root = [];
            let offsetX = this.offsetX;
            let x = -overflow + offsetX;
            let y = 0;
            let rootY = this.rootY;
            let upSideDown = 0;

            this.root.push({ x: x, y: rootY});

            while (x < winW) {
                let value = Math.random() > 0.5 ? 1 : -1;

                // Crazyness
                if (settings.crazyness) {
                    x += parseInt((Math.random() * settings.amplitudeX / 2) + (settings.amplitudeX / 2));
                    y = (parseInt((Math.random() * settings.amplitudeY / 2) + (settings.amplitudeY / 2)) * value) + rootY;
                } else {
                // Geometric
                    upSideDown = !upSideDown;
                    value = (upSideDown == 0) ? 1 : -1;

                    x += settings.amplitudeX;
                    y = settings.amplitudeY * value + rootY;
                }

                this.root.push({ x: x, y: y}); 
            };

            this.root.push({ x: winW + overflow, y: rootY});
        };

        createCircles() {
            const fill = '#fff';
            this.root.forEach(function(key, obj) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', 1);
                circle.setAttribute('cx', key.x);
                circle.setAttribute('cy', key.y);
                circle.setAttribute('fill', 'rgba(255, 255, 255, .3)');
                svg.appendChild(circle);
            })
        };

        createPath(){
            const root = this.root;
            const fill = this.fill;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', fill);
            path.setAttribute('stroke', fill);
            svg.appendChild(path);
            if (settings.fill) {
                svg.setAttribute('class','path');
            } else {
                svg.setAttribute('class','stroke');
            }

            // first & second points
            let d = `M -${overflow} ${winH + overflow}`;
            d += ` L ${root[0].x} ${root[0].y}`;

            // magic points
            for (let i = 1; i < this.root.length - 1; i++) {
                let prevPoint = root[i - 1];
                let actualPoint = root[i];
                let diffX = (actualPoint.x - prevPoint.x) / settings.smoothness;
                let x1 = prevPoint.x + diffX;
                let x2 = actualPoint.x - diffX;
                let x = actualPoint.x;
                let y1 = prevPoint.y;
                let y2 = actualPoint.y;
                let y = actualPoint.y;
                
                d += ` C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
            }

            // Second last
            const reverseRoot = root.reverse();
            d += ` L ${reverseRoot[0].x} ${reverseRoot[0].y}`;
            root.reverse();

            // Last point
            d += ` L ${winW + overflow} ${winH + overflow}`;

            // Close path
            d += ` Z`;

            path.setAttribute('d', d);
        };

        createLines(){
            const root = this.root;
            const fill = this.fill;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', fill);
            path.classList.add('path');
            svg.appendChild(path);

            // first & second points
            let d = `M -${overflow} ${winH + overflow}`;
            d += ` L ${root[0].x} ${root[0].y}`;

            // Magic points
            for (let i = 1; i < root.length - 1; i++) {
                d += ` L ${root[i].x} ${root[i].y}`;
            }

            // Second last & last points
            const reverseRoot = root.reverse();
            d += ` L ${reverseRoot[0].x} ${reverseRoot[0].y}`;
            d += ` L ${winW + overflow} ${winH + overflow}`;
            root.reverse();

            // Close path
            d += ` Z`;

            path.setAttribute('d', d);
        };
    };

    /*--------------------
    INIT
    --------------------*/
    function init(){
        // Overflow
        overflow = Math.abs(settings.lines * settings.offsetX);

        // Colors
        startColor = `hsl(${settings.hueStartColor}, ${settings.saturationStartColor}%, ${settings.lightnessStartColor}%)`;
        endColor = `hsl(${settings.hueEndColor}, ${settings.saturationEndColor}%, ${settings.lightnessEndColor}%)`;
        Colors = chroma.scale([startColor, endColor]).mode('lch').colors(settings.lines + 2);

        // Reset
        Paths = [];
        document.body.removeChild(svg);
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('id', 'svg');
        document.body.appendChild(svg);

        // Background
        if (settings.fill) {
            svg.style.backgroundColor = Colors[0];
        } else {
            svg.style.backgroundColor = '#000';
        }

        // Lines
        for (let i = 0; i < settings.lines + 1; i++) {
            let rootY = parseInt(winH / settings.lines * i);
            const path = new Path(rootY, Colors[i + 1], settings.offsetX * i);
            Paths.push(path);
            path.createRoot();
        }
        Paths.forEach(function(path) {
            path.createPath();
        });
    };
    init();

    /*--------------------
    WIN RESIZE
    --------------------*/
    window.addEventListener('resize', function() {
        winW = window.innerWidth;
        winH = window.innerHeight;
        init();
    });

    // Enhanced layer consistency system
    function initializeLayerConsistency() {
      // Add consistent background layers to all sections
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        // Skip if section already has a background layer
        if (!section.querySelector('.section-background-layer')) {
          const bgLayer = document.createElement('div');
          bgLayer.className = 'section-background-layer';
          section.style.position = 'relative';
          section.appendChild(bgLayer);
        }
      });
      
      // Enhance glass container consistency
      const glassContainers = document.querySelectorAll('.glass-container');
      glassContainers.forEach(container => {
        container.classList.add('glass-layer');
      });
    }

    // Initialize layer consistency
    initializeLayerConsistency();

    // Enhanced Scroll Animations
    const scrollElements = document.querySelectorAll('.scroll-element');
    const sections = document.querySelectorAll('section');
    
    // Initialize scroll elements
    scrollElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    });

    // Scroll animation observer
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    // Enhanced section activation with background layers
    const activateSection = (section) => {
        // Remove active class from all sections
        sections.forEach(sec => {
            sec.classList.remove('active-section');
        });
        
        // Add active class to current section
        section.classList.add('active-section');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.2)) {
                displayScrollElement(el);
            }
        });

        // Section activation with background layers
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
                activateSection(section);
            }
        });

        // Enhanced layer opacity based on scroll
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / docHeight;
        
        // Subtle layer intensity adjustment
        const backgroundLayers = document.querySelectorAll('.section-background-layer, .hero-background-layer');
        backgroundLayers.forEach(layer => {
            const baseOpacity = 0.6;
            const intensity = baseOpacity - (scrollPercent * 0.2);
            layer.style.opacity = Math.max(intensity, 0.4);
        });
    };

    // Enhanced Navigation System
    const navIndicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link');

    // Initialize grid section overlays
    function initializeGridOverlays() {
        const sections = ['home', 'work', 'portfolio', 'services', 'manifest'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section && !section.querySelector('.grid-section-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'grid-section-overlay';
                section.style.position = 'relative';
                section.appendChild(overlay);
            }
        });
    }

    // Update navigation indicator position
    function updateNavIndicator() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
                
                // Move indicator with smooth easing
                const linkRect = link.getBoundingClientRect();
                const navRect = link.closest('nav').getBoundingClientRect();
                const indicatorPosition = linkRect.top - navRect.top + (linkRect.height / 4);
                
                navIndicator.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                navIndicator.style.transform = `translateY(${indicatorPosition}px)`;
            }
        });
    }

    // Enhanced smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Add slight offset for better visibility
            const offset = 50;
            
            window.scrollTo({
                top: targetSection.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });

    // Enhanced work item hover effects
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced form field focus effects
    const formFields = document.querySelectorAll('.form-field');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-4px)';
            this.parentElement.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Initialize scroll animations
    function initializeScrollAnimations() {
        const elementsToAnimate = [
            '.device-frame', '.hero-stats', '.stat', 
            '.work-item', '.work-process', '.step',
            '.service-item', '.services-cta',
            '.manifest-form', '.principle'
        ];
        
        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('scroll-element');
                el.classList.add(`stagger-delay-${(index % 4) + 1}`);
            });
        });
    }

    // Initialize everything
    initializeScrollAnimations();
    
    // Throttled scroll handler for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScrollAnimation();
                updateNavIndicator();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check on load
    window.addEventListener('load', () => {
        handleScrollAnimation();
        updateNavIndicator();
        // Activate home section initially
        document.getElementById('home').classList.add('active-section');
    });

    // Enhanced text animations
    function initializeTypographyAnimations() {
        // Text reveal animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('h1, h2, h3, .section-title').forEach(el => {
            textObserver.observe(el);
        });
    }

    // Enhanced image loading with quality optimization
    function loadImagesWithQuality() {
        const images = document.querySelectorAll('.preview-frame, .project-image');
        
        images.forEach(img => {
            const bgImage = img.style.backgroundImage;
            if (bgImage) {
                const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                const highQualityImage = new Image();
                
                highQualityImage.onload = function() {
                    img.classList.add('loaded');
                    // Force repaint for smooth transition
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transition = 'opacity 0.5s ease';
                    }, 50);
                };
                
                highQualityImage.onerror = function() {
                    console.warn('Failed to load image:', imageUrl);
                    img.classList.add('loaded');
                };
                
                highQualityImage.src = imageUrl;
            }
        });
    }

    // Call this in your DOMContentLoaded event
    initializeTypographyAnimations();
    loadImagesWithQuality();

    // Enhanced mouse move parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const parallaxElements = document.querySelectorAll('.service-item, .work-item');
        parallaxElements.forEach(el => {
            const speed = 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            el.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Portfolio section background parallax
        const sectionBgOverlay = document.querySelector('.section-bg-overlay');
        if (sectionBgOverlay) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            
            sectionBgOverlay.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });

    // Portfolio section specific functionality
    const portfolioVisuals = document.querySelectorAll('.portfolio-visuals');
    
    // Enhanced hover effects for portfolio visuals
    portfolioVisuals.forEach(visual => {
        const heroVisual = visual.querySelector('.hero-visual');
        const secondaryVisual = visual.querySelector('.secondary-visual');
        
        visual.addEventListener('mouseenter', function() {
            if (heroVisual) heroVisual.style.transform = 'translateY(-8px)';
            if (secondaryVisual) secondaryVisual.style.transform = 'translate(-10px, -10px) scale(1.05)';
        });
        
        visual.addEventListener('mouseleave', function() {
            if (heroVisual) heroVisual.style.transform = 'translateY(0)';
            if (secondaryVisual) secondaryVisual.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Activate light reveal effect when portfolio visuals enter view
    const handlePortfolioAnimations = () => {
        portfolioVisuals.forEach((visual) => {
            if (elementInView(visual, 1.1)) {
                visual.classList.add('in-view');
            }
        });
    };

    // Update the existing handleScrollAnimation function to include portfolio animations
    const originalHandleScrollAnimation = handleScrollAnimation;
    handleScrollAnimation = () => {
        originalHandleScrollAnimation();
        handlePortfolioAnimations();
        initializeGridOverlays();
    };

    // Enhanced CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(200, 183, 138, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
    });

    // Initialize Image Loading
    function initializeImageLoading() {
        const imageLoader = new ImageLoader();
    }
    initializeImageLoading();

    // ========== NEW ENHANCEMENTS - SAFELY ADDED ==========
    
    // Enhanced portfolio item interactions
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced form validation and UX
    const formFieldsEnhanced = document.querySelectorAll('.form-field');
    formFieldsEnhanced.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Enhanced scroll animations with better timing
    function initializeEnhancedScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Add staggered animation for children
                    if (entry.target.classList.contains('process-steps')) {
                        const steps = entry.target.querySelectorAll('.step');
                        steps.forEach((step, index) => {
                            setTimeout(() => {
                                step.classList.add('animated');
                            }, index * 200);
                        });
                    }
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.scroll-element').forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // Initialize enhanced animations
    initializeEnhancedScrollAnimations();

    // Enhanced ribbon portfolio animations
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize metric animations
            const metricObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const metricFill = entry.target;
                        const targetWidth = metricFill.style.width;
                        metricFill.style.setProperty('--target-width', targetWidth);
                        metricFill.classList.add('animated');
                    }
                });
            }, { threshold: 0.5 });
            
            document.querySelectorAll('.metric-fill').forEach(metric => {
                metricObserver.observe(metric);
            });
            
            // Enhanced hover effects for metric cards
            document.querySelectorAll('.metric-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
            
            // Project image loading enhancement
            const projectImages = document.querySelectorAll('.project-hero-image, .detail-image');
            projectImages.forEach(img => {
                const bgImage = img.style.backgroundImage;
                if (bgImage) {
                    const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    const highQualityImage = new Image();
                    
                    highQualityImage.onload = function() {
                        img.classList.add('loaded');
                    };
                    
                    highQualityImage.onerror = function() {
                        console.warn('Failed to load project image:', imageUrl);
                        img.classList.add('loaded');
                    };
                    
                    highQualityImage.src = imageUrl;
                }
            });
        });

}); 

// main.js - Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Throttle scroll and resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Optimized scroll handler
    const optimizedScroll = throttle(handleScrollAnimation, 16);
    window.addEventListener('scroll', optimizedScroll, { passive: true });

    // Optimized resize handler
    const optimizedResize = throttle(() => {
        // Handle resize logic
    }, 100);
    window.addEventListener('resize', optimizedResize);

    // Reduce Three.js complexity
    function optimizeThreeJS() {
        const hologramContainer = document.getElementById('hologram-container');
        if (hologramContainer) {
            const canvas = hologramContainer.querySelector('canvas');
            if (canvas) {
                canvas.width = 150;
                canvas.height = 150;
            }
        }
    }
    optimizeThreeJS();
});// END OF DOMContentLoaded