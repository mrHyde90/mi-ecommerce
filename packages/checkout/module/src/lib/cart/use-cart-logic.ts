// libs/checkout/module/src/lib/cart-module/use-cart-logic.ts
import { useMemo } from 'react';
import { useCart } from '@mi-ecommerce/checkout-services';
import { useRemoveCartItemMutation } from '@mi-ecommerce/checkout-services';

export function useCartLogic(cartId: string) {
  const { data: cart, isLoading, isError } = useCart(cartId);
  const [removeItem] = useRemoveCartItemMutation();

  const total = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0,
    [cart]
  );

  return {
    items: cart?.items ?? [],
    total,
    isLoading,
    isError,
    removeItem: (itemId: string) => removeItem({ cartId, itemId }),
  };
}