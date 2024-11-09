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
// Select the header and footer elements
const header = document.querySelector('header');
const footerContent = document.querySelector('.footer-content');
const footerLastUpdated = document.querySelector('.footer-last-updated');
const footerLinks = footerContent.querySelectorAll('a');

const lastUpdatedDate = new Date(document.lastModified).toLocaleDateString('en-GB');
footerLastUpdated.textContent = `Last updated on ${lastUpdatedDate}`;

// Create an Intersection Observer to monitor the header's visibility
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Header is on screen, show the "Last updated" message and hide original footer content
                footerLastUpdated.classList.add('show');
                footerContent.classList.remove('show');
                footerLinks.forEach(link => link.style.pointerEvents = 'none'); // Disable links
            } else {
                // Header is off screen, hide the "Last updated" message and show original footer content
                footerLastUpdated.classList.remove('show');
                footerContent.classList.add('show');
                footerLinks.forEach(link => link.style.pointerEvents = 'auto'); // Enable links
            }
        });
    },
    { threshold: 0 } // Trigger when any part of the header is visible
);

// Observe the header
observer.observe(header);

