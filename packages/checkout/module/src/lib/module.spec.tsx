import { render } from '@testing-library/react';

import MiEcommerceModule from './module';

describe('MiEcommerceModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MiEcommerceModule />);
    expect(baseElement).toBeTruthy();
  });
});
