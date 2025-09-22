import type { CreateOrderI } from '@/stores/order';
import axios from 'axios'

export interface OrderResponse{
  id: string
}

export interface APIOrderResponse {
  message: string
  result: OrderResponse
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
})

export async function ApiCreateOrder(
  form: CreateOrderI
): Promise<APIOrderResponse> {
  const { data } = await api.post<APIOrderResponse>('/orders', form)
  return data
}

