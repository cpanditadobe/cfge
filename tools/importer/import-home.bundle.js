/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector('.hero-content h1, .hero-content h2, h1, h2, [class*="hero-title"]');
    const copy = element.querySelector(".hero-content p, .hero-content .subhead");
    const image = element.querySelector(".hero-image-container img, .hero-image-container picture, img");
    const textCell = [];
    if (heading) textCell.push(heading);
    if (copy) textCell.push(copy);
    if (!textCell.length && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([textCell, image]);
    } else {
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const promo = [];
    const promoCol = element.querySelector(".left-col-recent-insights");
    if (promoCol) {
      promoCol.querySelectorAll("h1, h2, h3, h4").forEach((h) => {
        if (h.textContent.trim()) promo.push(h);
      });
    }
    const promoImg = element.querySelector(".recent-insights-imageContainer img, .recent-insights-imageContainer picture");
    if (promoImg) promo.push(promoImg);
    const promoCta = element.querySelector(".left-col-recent-insights a.cta, .left-col-recent-insights .cta a");
    if (promoCta) promo.push(promoCta);
    if (promo.length) cells.push([promo]);
    const items = [...element.querySelectorAll(".custom-card.card-hover")];
    items.forEach((card) => {
      const item = [];
      const eyebrow = card.querySelector(".eyebrow p, .eyebrow, p.text-sm");
      if (eyebrow) item.push(eyebrow);
      const titleLink = card.querySelector("a.subhead");
      if (titleLink) item.push(titleLink);
      if (item.length) cells.push([item]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const cards = [...element.querySelectorAll(".slider__type-l3-slide.slick-slide-item, .slider__type-l3-slide")];
    cards.forEach((card) => {
      const image = card.querySelector(".slider__type-l3-image, img, picture");
      const imageCell = image || "";
      const body = [];
      const title = card.querySelector(".slider__type-l3-eyebrow, p.slider__type-l3-eyebrow");
      if (title) {
        const h = document2.createElement("h3");
        h.textContent = title.textContent.trim();
        body.push(h);
      }
      const desc = card.querySelector(".slider__type-l3-card-title");
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        body.push(p);
      }
      if (image || body.length) cells.push([imageCell, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const cards = [...element.querySelectorAll(".slick-slide-item .testimonial-card")].filter((card) => !card.closest(".slick-clone"));
    cards.forEach((card) => {
      const photo = card.querySelector("img.testimonial-card__image, .testimonial-card__author img");
      const photoCell = photo || "";
      const content = [];
      const company = card.querySelector(".testimonial-card__company");
      if (company && company.textContent.trim()) {
        const h = document2.createElement("h3");
        h.textContent = company.textContent.trim();
        content.push(h);
      }
      const descriptor = card.querySelector(":scope > p.text-std, .subhead + p.text-std");
      if (descriptor && descriptor.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = descriptor.textContent.trim();
        content.push(p);
      }
      const quote = card.querySelector(".testimonial-card__quote");
      if (quote && quote.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = quote.textContent.trim();
        content.push(p);
      }
      const name = card.querySelector(".testimonial-card__name");
      if (name && name.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = name.textContent.trim();
        content.push(p);
      }
      const title = card.querySelector(".testimonial-card__title");
      if (title && title.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = title.textContent.trim();
        content.push(p);
      }
      if (content.length || photo) cells.push([photoCell, content]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-projects.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const labels = [...element.querySelectorAll(".featured_projects__list a.featured_projects__item")];
    const media = [...element.querySelectorAll(".featured_projects__media a.featured_projects__media-item")];
    labels.forEach((label, i) => {
      const titleSpan = label.querySelector(".featured_projects__item-title");
      const labelText = (titleSpan ? titleSpan.textContent : label.textContent).trim();
      const labelCell = document2.createElement("p");
      labelCell.textContent = labelText;
      const panel = [];
      const mediaItem = media[i];
      const href = mediaItem && mediaItem.getAttribute("href") || label.getAttribute("href");
      if (mediaItem) {
        const img = mediaItem.querySelector("img.featured_projects__media-image, img");
        if (img) panel.push(img);
      }
      if (labelText) {
        const h = document2.createElement("h3");
        h.textContent = labelText;
        panel.push(h);
      }
      if (mediaItem) {
        const desc = mediaItem.querySelector(".featured_projects__media-description");
        if (desc && desc.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = desc.textContent.trim();
          panel.push(p);
        }
      }
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = "Learn More";
        panel.push(a);
      }
      cells.push([labelCell, panel]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-projects", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-logos.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    const items = [...element.querySelectorAll(".slider__type-recognitions-item")];
    items.forEach((item) => {
      const title = item.querySelector(".slider__type-recognitions-title");
      const statement = title ? title.textContent.replace(/\s+/g, " ").trim() : "";
      if (statement && seen.has(statement)) return;
      if (statement) seen.add(statement);
      const logo = item.querySelector("img.slider__type-recognitions-image, .slider__type-recognitions-image-wrapper img, img");
      const logoCell = logo || "";
      const content = [];
      if (statement) {
        const p = document2.createElement("p");
        p.textContent = statement;
        content.push(p);
      }
      if (logo || content.length) cells.push([logoCell, content]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-quote.js
  function parse7(element, { document: document2 }) {
    const card = element.querySelector(".testimonial-card") || element;
    const attribution = [];
    const photo = card.querySelector("img.testimonial-card__image, .testimonial-card__author img");
    if (photo) attribution.push(photo);
    const name = card.querySelector(".testimonial-card__name");
    if (name && name.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = name.textContent.trim();
      attribution.push(p);
    }
    const title = card.querySelector(".testimonial-card__title");
    if (title && title.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = title.textContent.trim();
      attribution.push(p);
    }
    const company = card.querySelector(".testimonial-card__company");
    if (company && company.textContent.trim()) {
      const p = document2.createElement("p");
      p.textContent = company.textContent.trim();
      attribution.push(p);
    }
    const quotation = [];
    const quoteBox = card.querySelector(".testimonial-card__quote-analyst, .testimonial-card__quote");
    if (quoteBox) {
      const paras = [...quoteBox.querySelectorAll("p")].filter((p) => p.textContent.trim());
      if (paras.length) {
        paras.forEach((p) => quotation.push(p));
      } else if (quoteBox.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = quoteBox.textContent.trim();
        quotation.push(p);
      }
    }
    if (!attribution.length && !quotation.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[attribution, quotation]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-industry.js
  function parse8(element, { document: document2 }) {
    const cells = [];
    const items = [...element.querySelectorAll(".accordion-item")];
    items.forEach((item) => {
      const label = [];
      const titleIcon = item.querySelector(".subhead img");
      if (titleIcon) label.push(titleIcon);
      const titleText = item.querySelector(".accordion-title");
      if (titleText && titleText.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = titleText.textContent.trim();
        label.push(p);
      }
      const body = [];
      const contentBox = item.querySelector(".accordion-content-box");
      if (contentBox) {
        const desc = contentBox.querySelector(".text-std");
        if (desc) {
          const paras = [...desc.querySelectorAll("p")].filter((p) => p.textContent.trim());
          if (paras.length) {
            paras.forEach((p) => {
              const np = document2.createElement("p");
              np.textContent = p.textContent.trim();
              body.push(np);
            });
          } else if (desc.textContent.trim()) {
            const np = document2.createElement("p");
            np.textContent = desc.textContent.trim();
            body.push(np);
          }
        }
        const cta = contentBox.querySelector(".cta a, a");
        if (cta) {
          const a = document2.createElement("a");
          a.href = cta.getAttribute("href");
          a.textContent = (cta.textContent || "Learn More").trim();
          body.push(a);
        }
      }
      if (label.length || body.length) cells.push([label, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-industry", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/coforge-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#hs-web-interactives-top-push-anchor",
        "#hs-web-interactives-top-anchor",
        "#hs-web-interactives-bottom-anchor",
        "#hs-web-interactives-floating-container",
        "#hs-interactives-modal-overlay"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".top-menu",
        ".logo-coforge",
        ".bottom-desktop-navbar",
        ".bottom-navbar-wrapper",
        ".mobile-navbar-wrapper",
        ".language-switcher-wrapper",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/coforge-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-split": parse,
    "cards-insights": parse2,
    "cards-feature": parse3,
    "carousel-testimonial": parse4,
    "tabs-projects": parse5,
    "carousel-logos": parse6,
    "columns-quote": parse7,
    "accordion-industry": parse8
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Coforge homepage: hero, intro text, featured insights, feature cards, testimonial slider, featured projects tabs, analyst recognitions slider, featured analyst quote, industries accordion.",
    urls: [
      "https://www.coforge.com/"
    ],
    blocks: [
      { name: "hero-split", instances: [".row-number-1.dnd-section"] },
      { name: "cards-insights", instances: [".row-number-5.dnd-section"] },
      { name: "cards-feature", instances: [".row-number-9.dnd-section"] },
      { name: "carousel-testimonial", instances: [".row-number-11.dnd-section"] },
      { name: "tabs-projects", instances: [".row-number-13.dnd-section"] },
      { name: "carousel-logos", instances: [".row-number-15.dnd-section"] },
      { name: "columns-quote", instances: [".row-number-17.dnd-section"] },
      { name: "accordion-industry", instances: [".row-number-23.dnd-section"] }
    ],
    sections: [
      { id: "rc1", name: "hero", selector: [".row-number-1.dnd-section"], style: null, blocks: ["hero-split"], defaultContent: [] },
      { id: "rc2", name: "challenge-intro", selector: [".row-number-3.dnd-section"], style: null, blocks: [], defaultContent: [".row-number-3.dnd-section"] },
      { id: "rc3", name: "featured-insights", selector: [".row-number-5.dnd-section"], style: null, blocks: ["cards-insights"], defaultContent: [] },
      { id: "rc4", name: "systems-intro", selector: [".row-number-7.dnd-section"], style: null, blocks: [], defaultContent: [".row-number-7.dnd-section"] },
      { id: "rc5", name: "feature-cards", selector: [".row-number-9.dnd-section"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "rc6", name: "testimonials", selector: [".row-number-11.dnd-section"], style: null, blocks: ["carousel-testimonial"], defaultContent: [] },
      { id: "rc7", name: "featured-projects", selector: [".row-number-13.dnd-section"], style: null, blocks: ["tabs-projects"], defaultContent: [] },
      { id: "rc8", name: "analyst-recognitions", selector: [".row-number-15.dnd-section"], style: null, blocks: ["carousel-logos"], defaultContent: [] },
      { id: "rc9", name: "featured-analyst-quote", selector: [".row-number-17.dnd-section"], style: null, blocks: ["columns-quote"], defaultContent: [] },
      { id: "rc10", name: "spacer", selector: [".row-number-19.dnd-section"], style: null, blocks: [], defaultContent: [] },
      { id: "rc11", name: "domain-intro", selector: [".row-number-21.dnd-section"], style: null, blocks: [], defaultContent: [".row-number-21.dnd-section"] },
      { id: "rc12", name: "industries", selector: [".row-number-23.dnd-section"], style: "taupe", blocks: ["accordion-industry"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
