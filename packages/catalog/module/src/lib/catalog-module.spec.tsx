import { render } from '@testing-library/react';

import CatalogModule from './catalog-module';

describe('CatalogModule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CatalogModule />);
    expect(baseElement).toBeTruthy();
  });
});
