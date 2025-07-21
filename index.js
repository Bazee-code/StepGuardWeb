function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
}

// Close menu when clicking on a link
document.querySelectorAll('.mobile-menu nav a').forEach((link) => {
  link.addEventListener('click', () => {
    toggleMenu();
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');

  if (
    mobileMenu.classList.contains('active') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    toggleMenu();
  }
});

// Add smooth scrolling effect
document.addEventListener('DOMContentLoaded', () => {
  const features = document.querySelectorAll('.feature');
  features.forEach((feature, index) => {
    feature.style.animationDelay = `${index * 0.1}s`;
    feature.style.animation = 'fadeInUp 0.6s ease-out forwards';
  });
});

function spinAnimation() {
  gsap.fromTo(
    '#demoVideo',
    { rotationY: 0 },
    {
      rotationY: 360,
      duration: 1.5,
      ease: 'power2.out',
      transformOrigin: 'center center',
    }
  );
}

// Run once when the page loads
window.addEventListener('load', () => {
  spinAnimation(); // Initial run
  setInterval(spinAnimation, 34000); // Repeat every 15 seconds
});

// GSAP Text Reveal Animation for Feature Divs
document.addEventListener('DOMContentLoaded', function () {
  const features = document.querySelectorAll('.feature');

  features.forEach((feature, index) => {
    const h3 = feature.querySelector('h3');
    const p = feature.querySelector('p');

    // Set initial states - hidden and moved down
    gsap.set([h3, p], {
      opacity: 0,
      y: 30,
    });

    // Create reveal animation with stagger
    const tl = gsap.timeline({
      delay: index * 0.2, // Stagger each feature
    });

    tl.to(h3, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }).to(
      p,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3'
    ); // Start paragraph animation before h3 finishes
  });
});
