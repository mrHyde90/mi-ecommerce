export interface CustomerItem {
  id: string;
  name: string;
  address: number;
  password: number;
}

export interface Customers {
  id: string;
  customers: CustomerItem[];
}