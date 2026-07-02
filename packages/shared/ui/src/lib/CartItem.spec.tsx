import { render } from '@testing-library/react';

import { CartItem } from './CartItem';

describe('CartItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CartItem productName="Test product" price={10} quantity={1} onRemove={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
