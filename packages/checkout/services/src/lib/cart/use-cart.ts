// libs/checkout/services/src/lib/use-cart/use-cart.ts
import type { QueryResult } from '@mi-ecommerce/data-fetching';
import { useGetCartQuery } from './cart-api';

interface Cart {
  id: string;
  items: Array<{ id: string; productName: string; price: number; quantity: number }>;
}

export function useCart(cartId: string): QueryResult<Cart> {
  const query = useGetCartQuery(cartId);
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? new Error(JSON.stringify(query.error)) : null,
    refetch: () => query.refetch(),
  };
}