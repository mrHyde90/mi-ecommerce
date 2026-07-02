import { useCustomer } from '@mi-ecommerce/customer-services';
import { useRemoveCustomerItemMutation } from '@mi-ecommerce/customer-services';

export function useCustomerLogic(customerId: string) {
  const { data: cart, isLoading, isError } = useCustomer(customerId);
  const [removeItem] = useRemoveCustomerItemMutation();

  return {
    items: cart?.customers ?? [],
    isLoading,
    isError,
    removeItem: () => removeItem({ customerId }),
  };
}