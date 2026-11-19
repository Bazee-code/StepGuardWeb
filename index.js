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
// Only the homepage has the demo video and loads GSAP.
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined' || !document.getElementById('demoVideo')) return;
  spinAnimation(); // Initial run
  setInterval(spinAnimation, 34000); // Repeat every 34 seconds
});
