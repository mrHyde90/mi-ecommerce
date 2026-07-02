// libs/checkout/services/src/lib/use-cart/use-cart.ts
import type { QueryResult } from '@mi-ecommerce/data-fetching';
import { useGetCustomerQuery } from './customer-api-slice';
import { Customers } from './customer-api-types';

export function useCustomer(cartId: string): QueryResult<Customers> {
  const query = useGetCustomerQuery(cartId);
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? new Error(JSON.stringify(query.error)) : null,
    refetch: () => query.refetch(),
  };
}