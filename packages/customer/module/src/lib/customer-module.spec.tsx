import { render } from '@testing-library/react';

import CustomerModule from './customer-module';

describe('CustomerModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomerModule />);
    expect(baseElement).toBeTruthy();
  });
});
