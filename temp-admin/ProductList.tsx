
type ProductListProps = {
  products: any[];
};

export default function ProductList({ products }: ProductListProps) {
  return <div>ProductList placeholder ({products.length} products)</div>;
}
