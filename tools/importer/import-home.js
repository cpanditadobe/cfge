/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import tabsProjectsParser from './parsers/tabs-projects.js';
import carouselLogosParser from './parsers/carousel-logos.js';
import columnsQuoteParser from './parsers/columns-quote.js';
import accordionIndustryParser from './parsers/accordion-industry.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/coforge-cleanup.js';
import sectionsTransformer from './transformers/coforge-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'cards-insights': cardsInsightsParser,
  'cards-feature': cardsFeatureParser,
  'carousel-testimonial': carouselTestimonialParser,
  'tabs-projects': tabsProjectsParser,
  'carousel-logos': carouselLogosParser,
  'columns-quote': columnsQuoteParser,
  'accordion-industry': accordionIndustryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Coforge homepage: hero, intro text, featured insights, feature cards, testimonial slider, featured projects tabs, analyst recognitions slider, featured analyst quote, industries accordion.',
  urls: [
    'https://www.coforge.com/',
  ],
  blocks: [
    { name: 'hero-split', instances: ['.row-number-1.dnd-section'] },
    { name: 'cards-insights', instances: ['.row-number-5.dnd-section'] },
    { name: 'cards-feature', instances: ['.row-number-9.dnd-section'] },
    { name: 'carousel-testimonial', instances: ['.row-number-11.dnd-section'] },
    { name: 'tabs-projects', instances: ['.row-number-13.dnd-section'] },
    { name: 'carousel-logos', instances: ['.row-number-15.dnd-section'] },
    { name: 'columns-quote', instances: ['.row-number-17.dnd-section'] },
    { name: 'accordion-industry', instances: ['.row-number-23.dnd-section'] },
  ],
  sections: [
    { id: 'rc1', name: 'hero', selector: ['.row-number-1.dnd-section'], style: null, blocks: ['hero-split'], defaultContent: [] },
    { id: 'rc2', name: 'challenge-intro', selector: ['.row-number-3.dnd-section'], style: null, blocks: [], defaultContent: ['.row-number-3.dnd-section'] },
    { id: 'rc3', name: 'featured-insights', selector: ['.row-number-5.dnd-section'], style: null, blocks: ['cards-insights'], defaultContent: [] },
    { id: 'rc4', name: 'systems-intro', selector: ['.row-number-7.dnd-section'], style: null, blocks: [], defaultContent: ['.row-number-7.dnd-section'] },
    { id: 'rc5', name: 'feature-cards', selector: ['.row-number-9.dnd-section'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'rc6', name: 'testimonials', selector: ['.row-number-11.dnd-section'], style: null, blocks: ['carousel-testimonial'], defaultContent: [] },
    { id: 'rc7', name: 'featured-projects', selector: ['.row-number-13.dnd-section'], style: null, blocks: ['tabs-projects'], defaultContent: [] },
    { id: 'rc8', name: 'analyst-recognitions', selector: ['.row-number-15.dnd-section'], style: null, blocks: ['carousel-logos'], defaultContent: [] },
    { id: 'rc9', name: 'featured-analyst-quote', selector: ['.row-number-17.dnd-section'], style: null, blocks: ['columns-quote'], defaultContent: [] },
    { id: 'rc10', name: 'spacer', selector: ['.row-number-19.dnd-section'], style: null, blocks: [], defaultContent: [] },
    { id: 'rc11', name: 'domain-intro', selector: ['.row-number-21.dnd-section'], style: null, blocks: [], defaultContent: ['.row-number-21.dnd-section'] },
    { id: 'rc12', name: 'industries', selector: ['.row-number-23.dnd-section'], style: 'taupe', blocks: ['accordion-industry'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
