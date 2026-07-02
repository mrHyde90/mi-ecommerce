import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from '@mi-ecommerce/checkout-services';
import { customerApi } from '@mi-ecommerce/customer-services';

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware, customerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
