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

<style scoped lang="scss">
@use '../assets/scss/breakpoints';

.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

.page-header {
  margin-bottom: var(--space-xl);

  h1 {
    margin-bottom: var(--space-xs);
  }
}

.catalog {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: var(--space-xl);
  align-items: start;
}

.sidebar {
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.results {
  min-width: 0;

  h2 {
    margin-bottom: var(--space-lg);
  }
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  gap: 20px;
}

@media (max-width: breakpoints.$page-compact) {
  .page {
    padding: 20px var(--space-md);
  }

  .catalog {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .sidebar {
    padding: var(--space-md);
  }
}
</style>
