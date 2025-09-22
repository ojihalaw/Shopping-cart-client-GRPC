<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <AppSidebar/>

    <!-- Main Content -->
    <div class="flex-1 pl-64  flex flex-col">
      <!-- Header -->
      <header class="bg-white py-6 shadow-sm border-b px-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">Products</h2>
          <div class="flex items-center space-x-4">
            <button
              @click="showCart = !showCart"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Cart ({{ cartItems.length }})
            </button>
          </div>
        </div>
      </header>

      <div class="flex-1 flex">
        <!-- Products Area -->
        <div class="flex-1 p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- Products Grid -->
          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in items"
              :key="product.id"
              class="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden border border-gray-100"
              @click="selectProduct(product)"
            >
              <div class="aspect-square bg-gray-50 flex items-center justify-center">
                <img
                  :src="product.imageUrl"
                  alt="Product image"
                  class="max-h-[300px] w-full object-center object-cover"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 truncate">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ product.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-teal-600">
                    Rp. {{ product.price.toLocaleString('id-ID') }}
                  </span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
                  >
                    Stock: {{ product.stock }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Cart Sidebar -->
        <div v-if="showCart" class="w-80 bg-white shadow-lg border-l">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Order Summary</h3>
              <button @click="showCart = false" class="text-gray-500 cursor-pointer hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
              <div v-if="cartItems.length === 0" class="text-center text-gray-500 py-8">
                No items in cart
              </div>

            <div v-else class="space-y-3">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500">
                    Rp.{{ item.price.toLocaleString('id-ID') }} × {{ item.quantity }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="orderStore.updateQuantity(item.id, item.quantity - 1)"
                    class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span class="w-6 text-center text-sm">{{ item.quantity }}</span>
                  <button
                    @click="orderStore.updateQuantity(item.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="border-t p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-base font-medium">Total</span>
              <span class="text-xl font-bold text-teal-600">
                Rp. {{ orderStore.totalItems.toLocaleString('id-ID') }}
              </span>
            </div>
            <button
              @click="submitOrder"
              :disabled="placing"
              class="w-full bg-teal-600 text-white py-3 rounded-lg shadow hover:bg-teal-700 disabled:opacity-50 transition cursor-pointer"
            >
              {{ orderStore.loading ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="selectedProduct"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all scale-100"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800">
              {{ selectedProduct.name }}
            </h3>
            <button
              @click="selectedProduct = null"
              class="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Product Image -->
          <div class="flex justify-center mb-4">
            <img
              :src="selectedProduct.imageUrl"
              :alt="selectedProduct.name"
               class="max-h-[200px] w-full object-center border rounded-lg object-cover"
            />
          </div>

          <!-- Description -->
          <p class="text-gray-600 text-sm mb-6 text-center leading-relaxed">
            {{ selectedProduct.description }}
          </p>

          <!-- Price & Stock -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-2xl font-extrabold text-blue-600">
              Rp.{{ selectedProduct.price.toLocaleString('id-ID') }}
            </span>
            <span
              class="text-sm font-medium"
              :class="selectedProduct.stock > 0 ? 'text-gray-500' : 'text-red-500'"
            >
              {{ selectedProduct.stock > 0 ? `Stock: ${selectedProduct.stock}` : 'Out of stock' }}
            </span>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="selectedProduct = null"
              class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="addToCart(selectedProduct)"
              :disabled="selectedProduct.stock === 0"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success Toast -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>


    <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
  >
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[450px]">
      <h2 class="text-xl font-bold mb-4 text-gray-800">Order Status</h2>

      <ul class="space-y-3 max-h-80 overflow-y-auto">
        <li
          v-for="(st, i) in orderStatus"
          :key="i"
          class="p-4 rounded-lg border relative"
          :class="{
            'bg-blue-50 border-blue-200': st.status !== 'RECEIVED',
            'bg-green-50 border-green-300': st.status === 'RECEIVED'
          }"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-800 capitalize">{{ st.message }}</p>
              <p class="text-xs text-gray-500">
                {{ new Date(st.updated_at).toLocaleTimeString() }}
              </p>
            </div>
            <span
              v-if="st.remaining > 0"
              class="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700"
            >
              ⏳ {{ st.remaining }}s
            </span>
          </div>
        </li>
      </ul>

      <div v-if="isCompleted" class="mt-4 text-green-600 font-semibold text-center">
        🎉 Order Completed!
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useProductStore, type ProductI } from '@/stores/product'
import { useOrderStore, type CreateOrderI, type OrderStatusResponseI } from '@/stores/order'
import { storeToRefs } from 'pinia'


const productStore = useProductStore()
const { items, loading } = storeToRefs(productStore)
const orderStore = useOrderStore()
const { cartItems } = storeToRefs(orderStore)

// Component state
const selectedProduct = ref<ProductI | null>(null)
const placing = ref(false)
const showCart = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const showModal = ref(false)
const orderStatus = ref<
  (OrderStatusResponseI & { remaining: number; timer?: any })[]
>([])
const isCompleted = ref(false)
let eventSource: EventSource | null = null

// API Functions
const form = ref<CreateOrderI>({
  customer_id: 'cda3be2b-235b-4006-88bc-264c4629c929',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '08123456789',
  payment_method: 'bank_transfer',
  shipping_address: 'Jl. Merdeka No. 123, Jakarta',
  notes: 'Tolong kirim siang hari',
  items: cartItems.value.map(item => ({
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
})

const submitOrder = async () => {
  const payload: CreateOrderI = {
    ...form.value,
    items: cartItems.value.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  }

  await orderStore.createOrder(payload)

  if (orderStore.error) {
    toastMessage.value = orderStore.error
  } else {
    toastMessage.value = orderStore.successMessage || 'Order berhasil dibuat!'
    showModal.value = true
    orderStatus.value = []
    isCompleted.value = false

    eventSource = new EventSource(`http://localhost:8080/api/orders/stream?order_id=${orderStore.orderCreated.id}`)

    eventSource.onmessage = event => {
    const data = JSON.parse(event.data) as OrderStatusResponseI
    const st = {
        ...data,
        remaining: 0
      }
      orderStatus.value.push(st)
      startCountdown(st, 5)
    }

    eventSource.addEventListener("completed", () => {
      isCompleted.value = true
      eventSource?.close()
      cartItems.value = []
    })

    eventSource.onerror = err => {
      console.error("SSE error:", err)
      eventSource?.close()
    }
  }

  showToast.value = true
  toastMessage.value = `✅ Order Completed!`
  setTimeout(() => (showToast.value = false), 3000)
}


// Methods
const selectProduct = (product: ProductI) => {
  selectedProduct.value = product
}

const addToCart = (product: ProductI) => {
  if (product.stock > 0) {
    orderStore.addItem(product)
    selectedProduct.value = null
    showToast.value = true
    toastMessage.value = `${product.name} added to cart!`

    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

// Lifecycle
onMounted(() => {
  productStore.getProducts(1, 10)
})

function closeModal() {
  showModal.value = false
  eventSource?.close()
  orderStatus.value.forEach(st => clearInterval(st.timer))
}

function startCountdown(st: any, seconds = 5) {
  st.remaining = seconds
  st.timer = setInterval(() => {
    if (st.remaining > 0) {
      st.remaining--
    } else {
      clearInterval(st.timer)
    }
  }, 1000)
}


onUnmounted(() => {
  eventSource?.close()
  orderStatus.value.forEach(st => clearInterval(st.timer))
})
</script>

<style scoped>
/* Additional custom styles if needed */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>