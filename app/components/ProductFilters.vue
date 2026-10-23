<script setup lang="ts">
const route = useRoute();

const filters = reactive({
  category: '',
  manufacturer: '',
  minPrice: '',
  maxPrice: '',
  search: '',
  minCapacity: '',
  maxCapacity: '',
  minPower: '',
  maxPower: '',
  sort: '',
});

type FilterKey = keyof typeof filters;

const filterKeys: FilterKey[] = [
  'category',
  'manufacturer',
  'minPrice',
  'maxPrice',
  'search',
  'minCapacity',
  'maxCapacity',
  'minPower',
  'maxPower',
  'sort',
];

const validationError = computed(() => {
  const ranges = [
    { min: filters.minPrice, max: filters.maxPrice, label: 'Price' },
    { min: filters.minCapacity, max: filters.maxCapacity, label: 'Capacity' },
    { min: filters.minPower, max: filters.maxPower, label: 'Power' },
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
    for (const key of filterKeys) {
      filters[key] = typeof query[key] === 'string' ? query[key] : '';
    }
  },
  { immediate: true },
);

function applyFilters() {
  const filterQuery = Object.fromEntries(
    filterKeys.map((key) => [key, filters[key] || undefined]),
  );

  return navigateTo({
    path: '/',
    query: {
      ...route.query,
      ...filterQuery,
    },
  });
}

function resetFilters() {
  for (const key of filterKeys) {
    filters[key] = '';
  }

  return navigateTo('/');
}
</script>

<template>
  <form class="filters" @submit.prevent="applyFilters">
    <h2>Filters</h2>

    <label for="category">Category</label>
    <select id="category" v-model="filters.category">
      <option value="">All categories</option>
      <option value="battery">Batteries</option>
      <option value="solar panel">Solar panels</option>
      <option value="connector">Connectors</option>
    </select>

    <label for="manufacturer">Manufacturer</label>
    <select id="manufacturer" v-model="filters.manufacturer">
      <option value="">All manufacturers</option>
      <option v-for="name in manufacturers ?? []" :key="name" :value="name">
        {{ name }}
      </option>
    </select>

    <label for="minPrice">Minimum price</label>
    <input id="minPrice" v-model="filters.minPrice" type="number" min="0" />

    <label for="maxPrice">Maximum price</label>
    <input id="maxPrice" v-model="filters.maxPrice" type="number" min="0" />

    <label for="search">Search products</label>
    <input id="search" v-model="filters.search" type="search" />

    <label for="minCapacity">Minimum capacity (kWh)</label>
    <input
      id="minCapacity"
      v-model="filters.minCapacity"
      type="number"
      min="0"
      step="any" />

    <label for="maxCapacity">Maximum capacity (kWh)</label>
    <input
      id="maxCapacity"
      v-model="filters.maxCapacity"
      type="number"
      min="0"
      step="any" />

    <label for="minPower">Minimum power (W)</label>
    <input id="minPower" v-model="filters.minPower" type="number" min="0" step="any" />

    <label for="maxPower">Maximum power (W)</label>
    <input id="maxPower" v-model="filters.maxPower" type="number" min="0" step="any" />

    <label for="sort">Sort by</label>
    <select id="sort" v-model="filters.sort">
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
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2314251f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
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
