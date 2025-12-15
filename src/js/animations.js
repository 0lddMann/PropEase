// animations.js
// This file contains JavaScript functions for handling animations throughout the application, enhancing the UI/UX.

document.addEventListener('DOMContentLoaded', function() {
  // Fade-in effect for elements
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach((el) => {
    el.style.opacity = 0;
    el.style.transition = 'opacity 0.5s ease-in-out';
    el.getBoundingClientRect(); // Trigger reflow
    el.style.opacity = 1;
  });

  // Slide-in effect for sidebar
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.style.transform = 'translateX(-100%)';
    sidebar.style.transition = 'transform 0.3s ease-in-out';
    setTimeout(() => {
      sidebar.style.transform = 'translateX(0)';
    }, 100);
  }

  // Button hover effect
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.transition = 'transform 0.2s';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });
});

// Function to animate card hover effect
function animateCardHover() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.transition = 'transform 0.3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
    });
  });
}

// Call the card hover animation function
animateCardHover();