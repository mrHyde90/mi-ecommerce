// apps/storefront/src/app/routes/cart/cart-page.tsx
import { useParams } from 'react-router-dom';
import { CartModule } from '@mi-ecommerce/checkout-module';

export function CartPage() {
  const { cartId } = useParams<{ cartId: string }>();
  return (
    <div className="page">
      <h1>Your Cart</h1>
      <CartModule cartId={cartId!} />
    </div>
  );
}