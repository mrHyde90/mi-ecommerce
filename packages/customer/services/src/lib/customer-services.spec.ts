import { customerServices } from './customer-services.js';

describe('customerServices', () => {
  it('should work', () => {
    expect(customerServices()).toEqual('customer-services');
  });
});
