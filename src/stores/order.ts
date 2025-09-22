/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ApiCreateOrder, type OrderResponse } from '@/services/orderService'
import type { ProductI } from './product'

export interface CreateOrderI {
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_method: string
  shipping_address: string
  items: CreateOrderItemI[]
  notes: string
}

export interface CreateOrderItemI {
  product_id: string
  name: string
  price: number
  quantity: number
}
export interface OrderStatusResponseI {
  order_id: string
  status: string
  message: number
  updated_at: number
}

export interface CartItemI extends ProductI {
  quantity: number
}

export const useOrderStore = defineStore('orders', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const orderCreated = ref<OrderResponse>({ id: '' })
  const cartItems = ref<CartItemI[]>([])
  const totalItems = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  // === API ACTION ===
  async function createOrder(form: CreateOrderI) {
    loading.value = true
    error.value = null
    try {
      const res = await ApiCreateOrder(form)
      successMessage.value = res.message
      orderCreated.value = res.result
    } catch (err: any) {
      error.value = err?.message || 'Failed to create order'
    } finally {
      loading.value = false
    }
  }

  // === CART ACTIONS ===
  function addItem(product: ProductI) {
    const existingItem = cartItems.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.value.push({ ...product, quantity: 1 })
    }
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      cartItems.value = cartItems.value.filter(item => item.id !== id)
    } else {
      const item = cartItems.value.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    cartItems.value = []
  }

  return {
    orderCreated,
    loading,
    error,
    successMessage,
    createOrder,
    cartItems,
    addItem,
    updateQuantity,
    clearCart,
    totalItems
  }
})
