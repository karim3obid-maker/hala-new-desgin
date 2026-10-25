# Hala styles

`src/styles.css` is the single stylesheet entry. It loads Tailwind, HeroUI, then the files here in their numbered order. The source was divided without changing the order of any existing rule. Keep that order when editing because later page rules intentionally override earlier shared rules.

| File | Area |
| --- | --- |
| `01-foundation-dashboard.css` | Font, tokens, shared shell and dashboard |
| `02-affiliate.css` | Affiliate pages |
| `03-orders.css` | Orders and order details |
| `04-products.css` | Product discovery and details |
| `05-shipments.css` | Shipment management |
| `06-integrations-wallet-imports.css` | Integrations, wallet and imports |
| `07-navigation-tariffs.css` | Sidebar and tariff details |
| `08-settings-offers.css` | Settings and offers |
| `09-public-home.css` | Public homepage and partner sections |
| `10-blog-product-details.css` | Blog and product detail refinements |
| `11-hala-land-editor.css` | Hala Land editor and page management |
| `12-dark-theme.css` | Dark theme |
| `13-purchase-checkout.css` | Landing purchase flow and checkout |
| `14-storefront.css` | Hala Land storefront presentation and interactions |
| `15-finance-tools.css` | Finance, offer composer and import tools |
| `16-help.css` | Help and education pages |
| `17-pricing.css` | Pricing and tariff sections |
| `18-marketing-fund.css` | Marketing fund request page |

React pages live in `src/pages/`, shared UI in `src/components/`, and data in `src/data/`. Keep RTL, IBM Plex Sans Arabic, existing Hala colors, compact dimensions, and current behavior when changing any page. Use Tailwind utilities for new layout work where they can reproduce the design exactly; retain page CSS for existing precise styles. The production CSS was byte-identical before and after this source reorganization.
