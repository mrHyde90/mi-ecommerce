// libs/checkout/services/src/lib/cart-api/cart-api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Customers } from './customer-api-types';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    getCustomer: builder.query<Customers, string>({
      query: (id) => `customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    removeCustomerItem: builder.mutation<void, { customerId: string }>({
      query: ({ customerId }) => ({
        url: `customers/${customerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { customerId }) => [{ type: 'Customer', id: customerId }],
      async onQueryStarted({ customerId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          customerApi.util.updateQueryData('getCustomer', customerId, (draft) => {
            draft.customers = draft.customers.filter((item) => item.id !== customerId);
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

export const { useGetCustomerQuery, useRemoveCustomerItemMutation } = customerApi;