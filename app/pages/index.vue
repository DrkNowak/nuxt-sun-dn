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

const category = computed(() => {
  return typeof route.query.category === 'string' ? route.query.category : null;
});

const manufacturer = computed(() => {
  return typeof route.query.manufacturer === 'string' ? route.query.manufacturer : null;
});

const title = computed(() => {
  const filters = [category.value, manufacturer.value].filter(Boolean);

  return filters.length
    ? `${filters.join(' - ')} | sun.store`
    : 'Solar equipment marketplace | sun.store';
});

const description = computed(() => {
  return `Browse ${products.value?.length ?? 0} solar products on sun.store.`;
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
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
