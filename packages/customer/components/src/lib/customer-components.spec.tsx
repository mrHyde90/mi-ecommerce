import { render } from '@testing-library/react';

import CustomerComponents from './customer-components';

describe('CustomerComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CustomerComponents />);
    expect(baseElement).toBeTruthy();
  });
});
