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
