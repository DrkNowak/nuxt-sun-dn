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
  <main class="page">
    <header class="page-header">
      <h1>Solar equipment</h1>
      <p>Browse and compare solar products.</p>
    </header>

    <div class="catalog">
      <aside class="sidebar" aria-label="Product filters">
        <ProductFilters />
      </aside>

      <section class="results" aria-label="Product results">
        <p v-if="status === 'pending'" role="status">Loading products...</p>

        <p v-if="error" role="alert">Failed to load products.</p>

        <template v-if="products">
          <h2>Found {{ products.length }} products</h2>

          <p v-if="products.length === 0">
            No matching products. Try changing your filters.
          </p>

          <div v-else class="products">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product" />
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin-bottom: 8px;
}

.catalog {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.sidebar {
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.results {
  min-width: 0;
}

.results h2 {
  margin-bottom: 24px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .page {
    padding: 20px 16px;
  }

  .catalog {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .sidebar {
    padding: 16px;
  }
}
</style>
