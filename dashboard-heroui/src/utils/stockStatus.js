export function isLowStock(product){
  return !product.testing&&Number.isFinite(product.stock)&&product.stock>=0&&product.stock<10;
}
