/* Visit Hornelen - Main JavaScript */

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
      var nav = document.querySelector('.nav-links');
      if (nav) nav.classList.remove('open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
