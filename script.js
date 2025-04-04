// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        // Special handling for home link to scroll to top
        if (targetId === '#hero') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Navbar color change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'var(--header-bg)';
        header.style.boxShadow = '0 2px 10px var(--card-shadow)';
    } else {
        header.style.backgroundColor = 'var(--header-bg)';
        header.style.boxShadow = '0 2px 10px var(--card-shadow)';
    }
});

// Add animation to skills on scroll
const skillItems = document.querySelectorAll('.skill-item');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

skillItems.forEach(item => {
    observer.observe(item);
});

// Theme functionality
document.addEventListener('DOMContentLoaded', function() {
    const html = document.querySelector('html');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set dark mode as default
    html.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    
    // Update the toggle button icon
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            const isDarkMode = html.classList.contains('dark-mode');
            
            if (isDarkMode) {
                html.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                html.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
});

// Certifications slider functionality
function initializeCertCards() {
    let cards = Array.from(document.querySelectorAll(".cert-card"));
    
    // Reset any previous animations
    gsap.set(cards, { clearProps: "all" });
    
    // Apply the initial stacking effect
    gsap.to(cards, {
      y: (i) => i === 0 ? "0%" : (40 + 10 * i) + "%",  // Only front card centered, others stacked below
      z: (i) => i === 0 ? 0 : -100 - (50 * i),  // Front card in focus, others pushed back
      rotationX: (i) => i === 0 ? 0 : 5 + (i * 2),  // Only slight rotation for front card
      opacity: (i) => i === 0 ? 1 : 0.5 - (i * 0.1),  // Front card fully visible, others faded
      scale: (i) => i === 0 ? 1 : 0.9 - (i * 0.05),  // Front card full size, others smaller
      duration: 0.8,
      ease: "power2.out",
      stagger: -0.1,
    });
}

function setupCertSlider() {
    // Split text into spans for animation
    document.querySelectorAll(".cert-copy h1").forEach(element => {
        const text = element.textContent;
        const splitText = text
            .split("")
            .map(char => {
                return `<span>${char === " " ? "&nbsp;" : char}</span>`;
            })
            .join("");
        element.innerHTML = splitText;
    });

    // Initialize cards
    initializeCertCards();

    // Set initial state for text
    gsap.set(".cert-copy h1 span", { y: 0, opacity: 1 });

    // Handle click on the slider to cycle through certifications
    let isAnimating = false;
    document.querySelector(".cert-slider-container").addEventListener("click", function() {
        if (isAnimating) return;
        
        isAnimating = true;

        let slider = document.querySelector(".cert-slider");
        let cards = Array.from(slider.querySelectorAll(".cert-card"));
        let lastCard = cards[0]; // Get the front card which is now at position 0
        let nextCard = cards[1]; // The next card to become visible
        
        // Fade out current card text
        gsap.to(lastCard.querySelectorAll(".cert-copy h1 span"), {
            y: 30,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.01
        });

        // Move current card down
        gsap.to(lastCard, {
            y: "+=150%",
            opacity: 0,
            z: -300,
            rotationX: 10,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                // Move the current front card to the end of the stack
                slider.appendChild(lastCard);
                
                // Reset the card
                gsap.set(lastCard, { opacity: 0.3, rotationX: 5, scale: 0.8, z: -150 });
                
                // Re-initialize all cards
                initializeCertCards();
                
                // Animate in the text of the new front card
                gsap.to(nextCard.querySelectorAll(".cert-copy h1 span"), {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    stagger: 0.01
                });
                
                setTimeout(() => {
                    isAnimating = false;
                }, 600);
            }
        });
    });
}


// Audio

let soundButton = document.querySelector('.soundbutton'),
audio = document.querySelector('.audio')

soundButton.addEventListener('click', e => {
soundButton.classList.toggle('paused')
audio.paused ? audio.play() : audio.pause()
})

window.onfocus = function() {
soundButton.classList.contains('paused') ? audio.pause() : audio.play()
}

window.onblur = function() {
audio.pause()
}


// Audio Introduction playback
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play-intro');
    const audio = document.getElementById('intro-audio');
    
    if (playButton && audio) {
        let isPlaying = false;

        playButton.addEventListener('click', function() {
            if (!isPlaying) {
                audio.play();
                isPlaying = true;
                playButton.innerHTML = '<i class="fas fa-pause"></i> Pause Introduction';
            } else {
                audio.pause();
                isPlaying = false;
                playButton.innerHTML = '<i class="fas fa-play"></i> Play My Introduction';
            }
        });

        audio.addEventListener('ended', function() {
            isPlaying = false;
            playButton.innerHTML = '<i class="fas fa-play"></i> Play My Introduction';
        });
    }
    
    // Initialize dark mode from saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark-mode');
    }
    
    // Add event listener for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Current year for footer
    const footerYear = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Punit Kumar. All rights reserved.`;
});

// Custom cursor animation
document.addEventListener('DOMContentLoaded', () => {
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');

    let mouseX = 0;
    let mouseY = 0;
    let innerX = 0;
    let innerY = 0;
    let outerX = 0;
    let outerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        // Faster inner cursor with increased smoothing factor
        innerX += (mouseX - innerX) * 0.25;
        innerY += (mouseY - innerY) * 0.25;
        
        // Faster outer cursor with increased smoothing factor
        outerX += (mouseX - outerX) * 0.2;
        outerY += (mouseY - outerY) * 0.2;

        // Apply transforms with hardware acceleration
        cursorInner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;
        cursorOuter.style.transform = `translate3d(${outerX - 20}px, ${outerY - 20}px, 0)`;

        requestAnimationFrame(animate);
    };

    animate();

    // Add hover effect for clickable elements
    const handleMouseEnter = () => {
        cursorInner.style.transform = `translate(${innerX}px, ${innerY}px) scale(1.5)`;
        cursorOuter.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px) scale(1.5)`;
    };

    const handleMouseLeave = () => {
        cursorInner.style.transform = `translate(${innerX}px, ${innerY}px) scale(1)`;
        cursorOuter.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px) scale(1)`;
    };

    // Apply hover effects to all clickable elements
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
    });
});

// Certifications Slider
let isAnimating = false;

function splitTextIntoSpans(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        let text = element.innerText;
        let splitText = text
            .split("")
            .map(function (char) {
                return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
            })
            .join("");
        element.innerHTML = splitText;
    });
}

function initializeCards() {
    let cards = Array.from(document.querySelectorAll(".card"));
    gsap.to(cards, {
        y: (i) => 5 + 5 * i + "%",
        z: (i) => 15 * i,
        duration: 0.6,
        ease: "power3.out",
        stagger: -0.08
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize certifications slider
    if (document.querySelector(".slider")) {
        splitTextIntoSpans(".copy h1");
        initializeCards();

        gsap.set("h1 span", { y: -200 });
        gsap.set(".slider .card:last-child h1 span", { y: 0 });

        // Add click event for certification cards
        document.querySelector(".slider").addEventListener("click", function () {
            if (isAnimating) return;
            
            isAnimating = true;

            let slider = document.querySelector(".slider");
            let cards = Array.from(slider.querySelectorAll(".card"));
            let lastCard = cards.pop();
            let nextCard = cards[cards.length - 1];

            gsap.to(lastCard.querySelectorAll("h1 span"), {
                y: 200,
                duration: 0.5,
                ease: "power3.out",
            });

            gsap.to(lastCard, {
                y: "+=100%",
                duration: 0.5,
                ease: "power3.out",
                onComplete: () => {
                    slider.prepend(lastCard);
                    initializeCards();
                    gsap.set(lastCard.querySelectorAll("h1 span"), { y: -200 });
                    
                    setTimeout(() => {
                        isAnimating = false;
                    }, 600);
                },
            });

            gsap.to(nextCard.querySelectorAll("h1 span"), {
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.03,
            });
        });
    }
});