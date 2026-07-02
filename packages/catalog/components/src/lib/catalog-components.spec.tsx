import { render } from '@testing-library/react';

import CatalogComponents from './catalog-components';

describe('CatalogComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CatalogComponents />);
    expect(baseElement).toBeTruthy();
  });
});
