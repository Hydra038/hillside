
import type { Product } from '@/types/product';
import type { Dispatch, SetStateAction } from 'react';

type ProductFiltersProps = {
	products: Product[];
	setFilteredProducts: Dispatch<SetStateAction<Product[]>>;
};

export default function ProductFilters(props: ProductFiltersProps) {
	return null;
}
