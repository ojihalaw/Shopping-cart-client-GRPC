/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaginationI } from '@/types'
import { fetchProducts, } from '@/services/productService'

export interface ProductI {
  id: string
  name: string
  slug: string
  sku: string
  variant: string
  price: number
  stock: number
  description: string
  star: number
  imageUrl: string
  categoryId: string
  categoryName: string
  createdAt: string
  updatedAt: string
}

export const useProductStore = defineStore('products', () => {
  const items = ref<ProductI[]>([])
  const pagination = ref<PaginationI>({
    page: 1,
    limit: 10,
    total: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getProducts(page = 1, limit = 10, search = '') {
    loading.value = true
    error.value = null
    try {
      const res = await fetchProducts(page, limit, search)
      items.value = res.result.products
      pagination.value = res.pagination
    } catch (err:any) {
      error.value = err?.message || 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  function clearProducts() {
    items.value = []
    pagination.value = { page: 1, limit: 10, total: 0 }
  }

  return {
    items,
    pagination,
    loading,
    error,
    getProducts,
    clearProducts,
  }
})
