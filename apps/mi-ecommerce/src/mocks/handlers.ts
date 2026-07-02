import { http, HttpResponse } from 'msw';
import type { Cart, CartItem } from '@mi-ecommerce/checkout-services';
import type { Customers, CustomerItem } from '@mi-ecommerce/customer-services';

const mockCartItems: CartItem[] = [
  { id: 'item-1', productName: 'Sample Product', price: 19.99, quantity: 2 },
  { id: 'item-2', productName: 'Another Product', price: 9.99, quantity: 1 },
];

const mockCustomerItem: CustomerItem = {
  id: 'customer-1',
  name: 'Jane Doe',
  address: 123,
  password: 1234,
};

export const handlers = [
  http.get('/api/carts/:cartId', ({ params }) => {
    const cart: Cart = { id: params.cartId as string, items: mockCartItems };
    return HttpResponse.json(cart);
  }),

  http.delete('/api/carts/:cartId/items/:itemId', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/customers/:id', ({ params }) => {
    const customers: Customers = {
      id: params.id as string,
      customers: [{ ...mockCustomerItem, id: params.id as string }],
    };
    return HttpResponse.json(customers);
  }),

  http.delete('/api/customers/:customerId', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
