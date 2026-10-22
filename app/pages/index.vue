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
    <ProductFilters />

    <p v-if="status === 'pending'">Loading products...</p>

    <p v-if="error">Failed to load products.</p>

    <template v-if="products">
      <p>Found {{ products.length }} products</p>

      <div class="products">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </template>
  </main>
</template>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}
</style>
