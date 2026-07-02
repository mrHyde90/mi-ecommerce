import { render } from '@testing-library/react';

import MiEcommerceUi from './ui';

describe('MiEcommerceUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MiEcommerceUi />);
    expect(baseElement).toBeTruthy();
  });
});
