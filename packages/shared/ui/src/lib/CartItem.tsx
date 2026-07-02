// libs/checkout/components/src/lib/cart-item/cart-item.tsx
export interface CartItemProps {
  productName: string;
  price: number;
  quantity: number;
  onRemove: () => void;
}

export function CartItem({ productName, price, quantity, onRemove }: CartItemProps) {
  return (
    <div className="cart-item">
      <span>{productName}</span>
      <span>x{quantity}</span>
      <span>${(price * quantity).toFixed(2)}</span>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
}