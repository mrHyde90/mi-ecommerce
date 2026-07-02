// libs/checkout/module/src/lib/cart-module/cart-module.tsx
import { Profile } from '@mi-ecommerce/customer-components';
import { useCustomerLogic } from './use-customer-logic';

export interface ProfileDataProps {
  cartId: string;
}

export function ProfileData({ cartId }: ProfileDataProps) {
  const { items, isLoading, isError, removeItem } = useCustomerLogic(cartId);

  if (isLoading) return <div>Loading cart...</div>;
  if (isError) return <div>Failed to load cart</div>;

  return (
    <div className="cart">
      {items.map((item) => (
        <Profile
          key={item.id}
          id={item.id}
          name={item.name}
          address={item.address}
          password={item.password}
          onRemove={() => removeItem()}
        />
      ))}
    </div>
  );
}