/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Coforge site-wide cleanup.
 * Removes non-authorable site chrome (top menu, logos, desktop + mobile navigation,
 * footer) and HubSpot web-interactive widget anchors / overlays.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - Header top bar:       .top-menu (Investors/Careers/Contact Us links)
 *   - Header logo bar:      .logo-coforge (Coforge logo + language switcher)
 *   - Desktop nav:          .bottom-desktop-navbar / .bottom-navbar-wrapper
 *   - Mobile nav:           .mobile-navbar-wrapper (#navbarWrapper)
 *   - Footer:               footer.footer
 *   - Language switcher:    .language-switcher-wrapper
 *   - HubSpot widgets:      #hs-web-interactives-* anchors, #hs-interactives-modal-overlay,
 *                           #hs-web-interactives-floating-container, #hs-web-interactives-top-push-anchor
 *
 * NOTE: .encora-navbar-module is NOT removed — in the source DOM it wraps the entire
 * page (header, content sections, and footer), so removing it would delete authorable
 * content. Only the specific chrome pieces inside it are targeted.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // HubSpot web-interactive widget anchors / overlays (modals, floating containers).
    // Removed early so they cannot interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#hs-web-interactives-top-push-anchor',
      '#hs-web-interactives-top-anchor',
      '#hs-web-interactives-bottom-anchor',
      '#hs-web-interactives-floating-container',
      '#hs-interactives-modal-overlay',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (header, navigation, footer).
    WebImporter.DOMUtils.remove(element, [
      '.top-menu',
      '.logo-coforge',
      '.bottom-desktop-navbar',
      '.bottom-navbar-wrapper',
      '.mobile-navbar-wrapper',
      '.language-switcher-wrapper',
      'footer.footer',
    ]);
  }
}
