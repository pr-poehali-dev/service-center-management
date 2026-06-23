export const ORDERS_URL = 'https://functions.poehali.dev/7a742968-3773-4d7b-865d-9b8e537afff8';

export interface Order {
  id: number;
  client_name: string;
  client_phone: string;
  device_type: string;
  device_model: string;
  issue: string;
  master: string;
  status: string;
  price: number;
  created_at: string;
}
