// Report App Store button clicks to Google Analytics, tagged with where on
// the site the click happened, so installs can be traced back to pages.
document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (link) {
  link.addEventListener('click', function () {
    if (typeof gtag !== 'function') return;
    gtag('event', 'app_store_click', {
      placement: link.dataset.placement || 'unknown',
      page_path: location.pathname,
    });
  });
});
