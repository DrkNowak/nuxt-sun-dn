<script setup lang="ts">
import type { Product } from '#shared/types/products';

defineProps<{
  product: Product;
}>();
</script>

<template>
  <article class="product-card">
    <h2>{{ product.name }}</h2>

    <p>{{ product.manufacturer }}</p>
    <p>Category: {{ product.category }}</p>
    <p>Price: {{ product.price }}</p>

    <p v-if="product.powerW !== null">Power: {{ product.powerW }} W</p>

    <p v-if="product.capacityKwh !== null">Capacity: {{ product.capacityKwh }} kWh</p>

    <p>{{ product.description }}</p>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  overflow-wrap: anywhere;

  h2 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-sm);
  }

  p {
    margin: var(--space-xs) 0;
    line-height: var(--line-height-body);
  }
}
</style>
