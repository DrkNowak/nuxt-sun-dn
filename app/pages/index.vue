<script setup lang="ts">
import type { Product } from '#shared/types/products';

const route = useRoute();

const {
  data: products,
  status,
  error,
} = await useFetch<Product[]>('/api/products', {
  query: computed(() => route.query),
});
</script>

<template>
  <main>
    <h1>Solar equipment</h1>

    <p v-if="status === 'pending'">Loading products...</p>

    <p v-if="error">Failed to load products.</p>

    <template v-if="products">
      <p>Found {{ products.length }} products</p>

      <ul>
        <li v-for="product in products" :key="product.id">
          <h2>{{ product.name }}</h2>
          <p>{{ product.manufacturer }}</p>
          <p>{{ product.price }}</p>
          <p v-if="product.powerW !== null">Power: {{ product.powerW }} W</p>
          <p v-if="product.capacityKwh !== null">
            Capacity: {{ product.capacityKwh }} kWh
          </p>
        </li>
      </ul>
    </template>
  </main>
</template>
