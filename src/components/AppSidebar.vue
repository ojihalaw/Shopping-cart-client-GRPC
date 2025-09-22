<template>
  <aside  class="w-64 bg-white h-full fixed inset-y-0 shadow-lg">
    <div>
      <div class="px-6 py-4 border-b">
        <h1 class="font-bold text-gray-800 text-base">Shopping Cart <br> <span class="text-teal-600 text-2xl">GRPC</span></h1>
      </div>
      <nav class="mt-6">
        <div class="px-6 py-3">
          <h2 class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Menu</h2>
        </div>
        <a
          v-for="item in menuItems"
          :key="item.id"
          @click="activeMenu = item.id"
          :class="[
            'flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors',
            activeMenu === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : ''
          ]"
        >
          <span class="mr-3">{{ item.icon }}</span>
          {{ item.name }}
        </a>
      </nav>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface MenuItem {
  id: string
  name: string
  icon: string
}

const activeMenu = ref('products')

const menuItems: MenuItem[] = [
  { id: 'products', name: 'Products', icon: '📦' },
  { id: 'orders', name: 'Orders', icon: '📋' },
  { id: 'customers', name: 'Customers', icon: '👥' },
  { id: 'reports', name: 'Reports', icon: '📊' }
]
</script>

<style scoped>

</style>