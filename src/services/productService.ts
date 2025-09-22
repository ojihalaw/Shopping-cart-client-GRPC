import axios from 'axios'
import type { ProductI } from '@/stores/product'
import type { PaginationI } from '@/types'


export interface ResultProduct{
  products: ProductI[]
}
export interface APIProductResponse {
  message: string
  result: ResultProduct
  pagination: PaginationI
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
})

export async function fetchProducts(
  page = 1,
  limit = 10,
  search = ''
): Promise<APIProductResponse> {
  const { data } = await api.get<APIProductResponse>('/products', {
    params: { page, limit, search },
  })
  return data
}
