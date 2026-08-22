
const textArray = [
    "a NISERite.",
    "an Integrated MSc. Student.",
    "an Aspiring Computational Physicist.",
    "a Hobbyist Coder.",
    "an Amateur Keyboardist."
];
let textIndex = 0;
let charIndex = 0;
let typingSpeed = 100;
let erasingSpeed = 50;
let delayBetweenTexts = 1000;
const animatedTextElement = document.getElementById("animated-text");

function type() {
    if (charIndex < textArray[textIndex].length) {
        animatedTextElement.textContent += textArray[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, delayBetweenTexts);
    }
}

function erase() {
    if (charIndex > 0) {
        animatedTextElement.textContent = textArray[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (textArray.length && animatedTextElement) setTimeout(type, delayBetweenTexts);
});

const DEFAULT_SIM_WIDTH = 1400;
const DEFAULT_SIM_HEIGHT = 750;
let currentSimSize = { width: DEFAULT_SIM_WIDTH, height: DEFAULT_SIM_HEIGHT };

function openSimModal(src, title, nativeWidth, nativeHeight) {
    const modal = document.getElementById('sim-modal');
    const frame = document.getElementById('sim-modal-frame');
    const titleEl = document.getElementById('sim-modal-title');

    currentSimSize = {
        width: nativeWidth || DEFAULT_SIM_WIDTH,
        height: nativeHeight || DEFAULT_SIM_HEIGHT
    };
    frame.style.width = currentSimSize.width + 'px';
    frame.style.height = currentSimSize.height + 'px';

    titleEl.textContent = title;
    frame.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    fitSimFrame();
}

function closeSimModal() {
    const modal = document.getElementById('sim-modal');
    const frame = document.getElementById('sim-modal-frame');

    modal.classList.remove('open');
    frame.src = '';
    document.body.style.overflow = '';
}

function fitSimFrame() {
    const body = document.getElementById('sim-modal-body');
    const frame = document.getElementById('sim-modal-frame');
    if (!body || !frame || !body.clientWidth || !body.clientHeight) return;

    const scale = Math.min(
        body.clientWidth / currentSimSize.width,
        body.clientHeight / currentSimSize.height
    );

    const scaledWidth = currentSimSize.width * scale;
    const scaledHeight = currentSimSize.height * scale;
    const offsetX = (body.clientWidth - scaledWidth) / 2;
    const offsetY = (body.clientHeight - scaledHeight) / 2;

    frame.style.transform = `scale(${scale})`;
    frame.style.left = offsetX + 'px';
    frame.style.top = offsetY + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    const simModal = document.getElementById('sim-modal');
    if (simModal) {
        simModal.addEventListener('click', (e) => {
            if (e.target === simModal) closeSimModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSimModal();
    });
    window.addEventListener('resize', fitSimFrame);
});

function showDetails(id) {
    const detailsElement = document.getElementById(id);
    if (detailsElement.style.display === "none" || !detailsElement.style.display) {
        detailsElement.style.display = "block";
    } else {
        detailsElement.style.display = "none";
    }
}

document.querySelectorAll('.show-details-btn').forEach(button => {
    button.addEventListener('click', () => showDetails(button.dataset.target));
});

const header = document.querySelector('header');
const footerContent = document.querySelector('.footer-content');
const footerLastUpdated = document.querySelector('.footer-last-updated');
const footerLinks = footerContent.querySelectorAll('a');

const lastUpdatedDate = new Date(document.lastModified).toLocaleDateString('en-GB');
footerLastUpdated.textContent = `Last updated on ${lastUpdatedDate}`;

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footerLastUpdated.classList.add('show');
                footerContent.classList.remove('show');
                footerLinks.forEach(link => link.style.pointerEvents = 'none');
            } else {
                footerLastUpdated.classList.remove('show');
                footerContent.classList.add('show');
                footerLinks.forEach(link => link.style.pointerEvents = 'auto');
            }
        });
    },
    { threshold: 0 }
);

observer.observe(header);

const golCanvas = document.getElementById('gol-bg');

if (golCanvas) {
    const ctx = golCanvas.getContext('2d');
    const cellSize = 12;
    const deadColor = '#050505';
    
    let aliveColor = 'rgba(212, 175, 55, 0.9)';
    const brightColor = 'rgba(212, 175, 55, 0.9)';
    const dimColor = 'rgba(212, 175, 55, 0.15)';
    
    let cols, rows;
    let grid = [];
    let isRunning = false;
    let isDrawing = false;
    let currentFps = 2;
    const minFps = 1; 
    const maxFps = 10;


    function initGrid(randomize = false) {
        grid = new Array(cols).fill(null).map((_, x) => 
            new Array(rows).fill(null).map((_, y) => {
                if (!randomize) return 0;

                const cellCenterX = x * cellSize + cellSize / 2;
                const cellCenterY = y * cellSize + cellSize / 2;

                const screenCenterX = golCanvas.width / 2;
                const screenCenterY = golCanvas.height * 0.58;
                const safeWidth = Math.min(650, golCanvas.width * 0.85);
                const safeHeight = Math.min(250, golCanvas.height * 0.32);


                if (
                    cellCenterX > screenCenterX - safeWidth / 2 &&
                    cellCenterX < screenCenterX + safeWidth / 2 &&
                    cellCenterY > screenCenterY - safeHeight / 2 &&
                    cellCenterY < screenCenterY + safeHeight / 2
                ) {
                    return 0;
                }

                const centralDistance = Math.sqrt((cellCenterX - screenCenterX) ** 2 + 2*(cellCenterY - screenCenterY) ** 2);
                const maxDistance = Math.sqrt((golCanvas.width / 2) ** 2 + 2*(golCanvas.height / 2) ** 2);

                return Math.random() > 0.95 * (centralDistance / maxDistance) ** 4 ? 0 : 1;
            })
        );
    }

    function resizeCanvas() {
        golCanvas.width = window.innerWidth;
        golCanvas.height = window.innerHeight;

        const newCols = Math.floor(golCanvas.width / cellSize);
        const newRows = Math.floor(golCanvas.height / cellSize);

        if (newCols !== cols || newRows !== rows) {
            cols = newCols;
            rows = newRows;
            initGrid(false);
        }
    }

    let resizeDebounce;
    window.addEventListener('resize', () => {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(resizeCanvas, 150);
    });
    resizeCanvas();

    function toggleCell(e, isSingleClick = false) {
        const rect = golCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const x = Math.floor(mouseX / cellSize);
        const y = Math.floor(mouseY / cellSize);

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            if (isSingleClick) {
                grid[x][y] = grid[x][y] === 1 ? 0 : 1;
            } else {
                grid[x][y] = 1; 
            }
            if (!isRunning) draw();
        }
    }

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer) {
        golCanvas.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDrawing = true;
            toggleCell(e, true);
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        golCanvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                toggleCell(e, false);
                e.preventDefault();
            }
        });
    }

    const btnClear = document.getElementById('gol-clear');
    const btnRandom = document.getElementById('gol-random');

    if(btnClear) btnClear.addEventListener('click', () => {
        initGrid(false);
        draw();
    });

    if(btnRandom) btnRandom.addEventListener('click', () => {
        initGrid(true);
        draw();
    });

    const heroSection = document.getElementById('sim-hero');

    function lerpColor(color1, color2, t) {
        t = Math.max(0, Math.min(1, t));
        const r = 212, g = 175, b = 55;
        const a1 = 0.9, a2 = 0.15;
        const currentAlpha = a1 + (a2 - a1) * t;
        return `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
    }

window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (heroSection) {
            const opacity = Math.max(1 - (scrollY / 300), 0);
            heroSection.style.opacity = opacity;
            heroSection.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
        }

        if (scrollY > 10) {
            golCanvas.style.pointerEvents = 'none'; 
            isRunning = true; 
        } else {
            golCanvas.style.pointerEvents = 'auto'; 
            isRunning = false; 
        }

        const fadeStart = windowHeight * 0.4;  
        const fadeEnd = windowHeight * 1.5;   
        const scrollProgress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        aliveColor = lerpColor('bright', 'dim', scrollProgress);

        const speedProgress = Math.min(1, Math.max(0, scrollY / 1000));
        currentFps = minFps + (maxFps - minFps) * speedProgress;
        
        const introWrapper = document.querySelector('.sim-lab-intro-wrapper');
        if (introWrapper) {
            const rect = introWrapper.getBoundingClientRect();
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);

            const emOpacity = Math.max(0, Math.min(1, (progress - 0.25) * 6));     
            const textOpacity = Math.max(0, Math.min(1, (progress - 0.40) * 8));    
            const fadeOutOpacity = Math.max(0, Math.min(1, (progress - 0.55) * 6)); 

            const container = introWrapper.querySelector('.intro-container');
            const p = container.querySelector('p');
            const ems = container.querySelectorAll('em');

            container.style.opacity = 1 - fadeOutOpacity;
            
            container.style.borderLeftColor = `rgba(212, 175, 55, ${emOpacity})`;
            ems.forEach(em => {
                em.style.color = `rgba(212, 175, 55, ${emOpacity})`;
                em.style.textShadow = `0 0 ${emOpacity * 15}px rgba(212, 175, 55, ${emOpacity * 0.4})`;
            });

            p.style.color = `rgba(234, 234, 234, ${textOpacity})`;
        }

        if (!isRunning) draw(); 
    });

    function nextGen() {
        let nextGrid = grid.map(arr => [...arr]);
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let neighbors = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue;
                        const col = (x + i + cols) % cols;
                        const row = (y + j + rows) % rows;
                        neighbors += grid[col][row];
                    }
                }
                if (grid[x][y] === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[x][y] = 0;
                } else if (grid[x][y] === 0 && neighbors === 3) {
                    nextGrid[x][y] = 1;
                }
            }
        }
        grid = nextGrid;
    }

    function draw() {
        ctx.fillStyle = deadColor;
        ctx.fillRect(0, 0, golCanvas.width, golCanvas.height);
        ctx.fillStyle = aliveColor;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (grid[x][y] === 1) {
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }
    }

    let lastTime = 0;
    function loop(timestamp) {
        if (timestamp - lastTime >= 1000 / currentFps) {
            if (isRunning) nextGen();
            draw();
            lastTime = timestamp;
        }
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

const glitchTitle = document.getElementById('glitch-title');

if (glitchTitle) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeText(textToAdd, speed = 80) {
        for (let i = 0; i < textToAdd.length; i++) {
            glitchTitle.textContent += textToAdd[i];
            await pause(speed);
        }
    }

    async function insertText(textToAdd, index, speed = 100) {
        for (let i = 0; i < textToAdd.length; i++) {
            let currentText = glitchTitle.textContent;
            glitchTitle.textContent = currentText.slice(0, index + i) + textToAdd[i] + currentText.slice(index + i);
            await pause(speed);
        }
    }

    async function deleteText(targetLength, speed = 60) {
        let currentText = glitchTitle.textContent;
        while (currentText.length > targetLength) {
            currentText = currentText.slice(0, -1);
            glitchTitle.textContent = currentText;
            await pause(speed);
        }
    }

    function glitchText(targetText, preserveSuffixLength = 0, speed = 80) {
        return new Promise(resolve => {
            let currentText = glitchTitle.textContent;
            let prefixLen = 0;
            
            while (
                prefixLen < currentText.length && 
                prefixLen < (targetText.length - preserveSuffixLength) && 
                currentText[prefixLen] === targetText[prefixLen]
            ) {
                prefixLen++;
            }

            let iteration = prefixLen;
            const glitchTargetLength = targetText.length - preserveSuffixLength;

            const glitchInterval = setInterval(() => {
                glitchTitle.textContent = targetText
                    .split("")
                    .map((letter, index) => {
                        if (letter === " ") return " ";
                        if (index < prefixLen) return targetText[index]; 
                        if (index >= glitchTargetLength) return targetText[index]; 
                        if (index < Math.floor(iteration)) return targetText[index]; 
                        return chars[Math.floor(Math.random() * chars.length)]; 
                    })
                    .join("");

                if (iteration >= glitchTargetLength) {
                    clearInterval(glitchInterval);
                    glitchTitle.textContent = targetText;
                    resolve(); 
                }
                
                iteration += 1 / 4; 
            }, speed);
        });
    }

    async function runTitleSequence() {
        await pause(1000);
        
        await insertText("ulation", 3, 100); 
        
        await pause(1800);
        
        await glitchText("Simulacrum Lab", 4, 60);
        
        await pause(1800);
        
        await deleteText(8, 80); 
        await typeText("arium", 100); 
    }

    runTitleSequence();
}