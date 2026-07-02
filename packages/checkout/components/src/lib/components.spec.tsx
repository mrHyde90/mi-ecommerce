import { render } from '@testing-library/react';

import MiEcommerceComponents from './components';

describe('MiEcommerceComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MiEcommerceComponents />);
    expect(baseElement).toBeTruthy();
  });
});
