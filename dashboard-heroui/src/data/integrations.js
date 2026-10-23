import easyordersLogo from '../assets/integrations/easyorders.png';
import lightfunnelsLogo from '../assets/integrations/lightfunnels.png';
import youcanLogo from '../assets/integrations/youcan.png';
import shopifyLogo from '../assets/integrations/shopify.png';

// Account snapshot supplied in the user's integration screenshots, not a live connection source.
export const integrationPlatforms=[
  {id:'easyorders',name:'EasyOrders',logo:easyordersLogo,tone:'easyorders'},
  {id:'lightfunnels',name:'Lightfunnels',logo:lightfunnelsLogo,tone:'lightfunnels'},
  {id:'youcan',name:'YouCan',logo:youcanLogo,tone:'youcan'},
  {id:'shopify',name:'Shopify',logo:shopifyLogo,tone:'shopify'},
  {id:'woocommerce',name:'WooCommerce',mark:'woo',tone:'woocommerce',comingSoon:true},
];
export const integrationSnapshot=[
  {id:'hala',name:'hala',platform:'lightfunnels',country:'السعودية',count:0},
  {id:'haramain',name:'سوق الحرمين',platform:'easyorders',country:'السعودية',count:239},
];
export const integrationsPageTitle='ربط متجرك';
