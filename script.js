// Typing Animation for Tagline
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
    if (textArray.length) setTimeout(type, delayBetweenTexts);
});

// Show Details Button Functionality
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

// Footer Visibility Based on Header Position
const header = document.querySelector('header');
const footerContent = document.querySelector('.footer-content');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footerContent.classList.remove('show');
            } else {
                footerContent.classList.add('show');
            }
        });
    },
    { threshold: 0 }
);

observer.observe(header);
