<script setup lang="ts">
const route = useRoute();

const category = ref('');
const manufacturer = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const search = ref('');
const minCapacity = ref('');
const maxCapacity = ref('');
const minPower = ref('');
const maxPower = ref('');
const sort = ref('');

const validationError = computed(() => {
  const ranges = [
    { min: minPrice.value, max: maxPrice.value, label: 'Price' },
    { min: minCapacity.value, max: maxCapacity.value, label: 'Capacity' },
    { min: minPower.value, max: maxPower.value, label: 'Power' },
  ];

  for (const { min, max, label } of ranges) {
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      return `${label}: minimum cannot exceed maximum`;
    }
  }

  return null;
});

const { data: manufacturers } = await useFetch<string[]>('/api/manufacturers');

watch(
  () => route.query,
  (query) => {
    category.value = typeof query.category === 'string' ? query.category : '';
    manufacturer.value = typeof query.manufacturer === 'string' ? query.manufacturer : '';
    minPrice.value = typeof query.minPrice === 'string' ? query.minPrice : '';
    maxPrice.value = typeof query.maxPrice === 'string' ? query.maxPrice : '';
    search.value = typeof query.search === 'string' ? query.search : '';
    minCapacity.value = typeof query.minCapacity === 'string' ? query.minCapacity : '';
    maxCapacity.value = typeof query.maxCapacity === 'string' ? query.maxCapacity : '';
    minPower.value = typeof query.minPower === 'string' ? query.minPower : '';
    maxPower.value = typeof query.maxPower === 'string' ? query.maxPower : '';
    sort.value = typeof query.sort === 'string' ? query.sort : '';
  },
  { immediate: true },
);

function applyFilters() {
  return navigateTo({
    path: '/',
    query: {
      ...route.query,
      category: category.value || undefined,
      manufacturer: manufacturer.value || undefined,
      minPrice: minPrice.value || undefined,
      maxPrice: maxPrice.value || undefined,
      search: search.value || undefined,
      minCapacity: minCapacity.value || undefined,
      maxCapacity: maxCapacity.value || undefined,
      minPower: minPower.value || undefined,
      maxPower: maxPower.value || undefined,
      sort: sort.value || undefined,
    },
  });
}

function resetFilters() {
  return navigateTo('/');
}
</script>

<template>
  <form class="filters" @submit.prevent="applyFilters">
    <h2>Filters</h2>

    <label for="category">Category</label>
    <select id="category" v-model="category">
      <option value="">All categories</option>
      <option value="battery">Batteries</option>
      <option value="solar panel">Solar panels</option>
      <option value="connector">Connectors</option>
    </select>

    <label for="manufacturer">Manufacturer</label>
    <select id="manufacturer" v-model="manufacturer">
      <option value="">All manufacturers</option>
      <option v-for="name in manufacturers ?? []" :key="name" :value="name">
        {{ name }}
      </option>
    </select>

    <label for="minPrice">Minimum price</label>
    <input id="minPrice" v-model="minPrice" type="number" min="0" />

    <label for="maxPrice">Maximum price</label>
    <input id="maxPrice" v-model="maxPrice" type="number" min="0" />

    <label for="search">Search products</label>
    <input id="search" v-model="search" type="search" />

    <label for="minCapacity">Minimum capacity (kWh)</label>
    <input id="minCapacity" v-model="minCapacity" type="number" min="0" step="0.1" />

    <label for="maxCapacity">Maximum capacity (kWh)</label>
    <input id="maxCapacity" v-model="maxCapacity" type="number" min="0" step="0.1" />

    <label for="minPower">Minimum power (W)</label>
    <input id="minPower" v-model="minPower" type="number" min="0" step="1" />

    <label for="maxPower">Maximum power (W)</label>
    <input id="maxPower" v-model="maxPower" type="number" min="0" step="1" />

    <label for="sort">Sort by</label>
    <select id="sort" v-model="sort">
      <option value="">Default</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="name-asc">Name: A–Z</option>
      <option value="name-desc">Name: Z–A</option>
      <option value="capacity-asc">Capacity: low to high</option>
      <option value="capacity-desc">Capacity: high to low</option>
      <option value="power-asc">Power: low to high</option>
      <option value="power-desc">Power: high to low</option>
    </select>

    <p v-if="validationError" class="error" role="alert">
      {{ validationError }}
    </p>

    <button type="submit" :disabled="!!validationError">Apply filters</button>
    <button type="button" @click="resetFilters">Reset filters</button>
  </form>
</template>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  h2 {
    margin: 0 0 var(--space-sm);
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }

  input,
  select {
    width: 100%;
    min-width: 0;
    padding: 10px;
    border: 1px solid var(--color-border-control);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    font: inherit;
  }

  select {
    appearance: none;
    padding-right: var(--space-xl);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2314251f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: var(--font-size-m);
  }

  button {
    padding: var(--space-sm);
    border: 1px solid var(--color-border-button);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font: inherit;

    &[type='submit'] {
      background: var(--color-primary);
      color: var(--color-surface);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  :is(input, select, button):focus-visible {
    outline: 2px solid var(--color-focus-control);
    outline-offset: 2px;
  }
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
}
</style>
