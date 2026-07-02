import { CustomerItem } from '@mi-ecommerce/customer-services';

export type CustomerItemProps = CustomerItem & {
  onRemove: () => void;
}

export function Profile({ name, address, password, onRemove }: CustomerItemProps) {
  return (
    <div className="cart-item">
      <span>{name}</span>
      <span>x{address}</span>
      <span>${password}</span>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
}