// libs/checkout/module/src/lib/cart-module/cart-module.tsx
import { CartItem } from '@mi-ecommerce/ui';
import { useCartLogic } from './use-cart-logic';

export interface CartModuleProps {
  cartId: string;
}

export function CartModule({ cartId }: CartModuleProps) {
  const { items, total, isLoading, isError, removeItem } = useCartLogic(cartId);

  if (isLoading) return <div>Loading cart...</div>;
  if (isError) return <div>Failed to load cart</div>;

  return (
    <div className="cart">
      {items.map((item) => (
        <CartItem
          key={item.id}
          productName={item.productName}
          price={item.price}
          quantity={item.quantity}
          onRemove={() => removeItem(item.id)}
        />
      ))}
      <div className="cart-total">Total: ${total.toFixed(2)}</div>
    </div>
  );
}