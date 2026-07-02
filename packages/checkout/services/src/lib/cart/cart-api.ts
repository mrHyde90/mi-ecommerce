// libs/checkout/services/src/lib/cart-api/cart-api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, string>({
      query: (cartId) => `carts/${cartId}`,
      providesTags: (result, error, cartId) => [{ type: 'Cart', id: cartId }],
    }),
    removeCartItem: builder.mutation<void, { cartId: string; itemId: string }>({
      query: ({ cartId, itemId }) => ({
        url: `carts/${cartId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { cartId }) => [{ type: 'Cart', id: cartId }],
      async onQueryStarted({ cartId, itemId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cartApi.util.updateQueryData('getCart', cartId, (draft) => {
            draft.items = draft.items.filter((item) => item.id !== itemId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetCartQuery, useRemoveCartItemMutation } = cartApi;