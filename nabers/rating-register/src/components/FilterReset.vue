<template>
  <button class="filter-reset form-submit" @click="resetFilters()">{{ buttonLabel }}</button>
</template>

<script>
  export default {
    methods: {
      resetFilters: function() {
        this.$emit('reset');
      }
    },
    props: [
      'filterquery',
      'filterdata',
      'buttonLabel'
    ]
  }
</script>
