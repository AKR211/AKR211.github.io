
const textArray = [
    "a NISERite.",
    "an Integrated MSc. Student.",
    "an Aspiring Computational Physicist.",
    "a Hobbyist Coder.",
    "an Amateur Keyboardist."
];
let textIndex = 0;
let charIndex = 0;
let typingSpeed = 100;   // Typing speed in ms
let erasingSpeed = 50;   // Erasing speed in ms
let delayBetweenTexts = 1000; // Delay before typing next text in ms
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

document.addEventListener("DOMContentLoaded", function() { // Start the animation after the DOM loads
    if (textArray.length) setTimeout(type, delayBetweenTexts);
});

function showDetails(id) {
    const detailsElement = document.getElementById(id);
    if (detailsElement.style.display === "none" || !detailsElement.style.display) {
        detailsElement.style.display = "block";
    } else {
        detailsElement.style.display = "none";
    }
}

// Add event listeners to all "Show Details" buttons
document.querySelectorAll('.show-details-btn').forEach(button => {
    button.addEventListener('click', () => showDetails(button.dataset.target));
});

// Select the header and footer content elements
const header = document.querySelector('header');
const footerContent = document.querySelector('.footer-content');

// Create an Intersection Observer to monitor the header's visibility
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Header is on screen, hide the footer content with animation
                footerContent.classList.remove('show');
            } else {
                // Header is off screen, show the footer content with animation
                footerContent.classList.add('show');
            }
        });
    },
    { threshold: 0 } // Trigger when any part of the header is visible
);

// Observe the header
observer.observe(header);



