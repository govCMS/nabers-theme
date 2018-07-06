<template>
  <button class="button is-primary" type="submit">
    <loader-spinner v-if="awaitingAPIResponse !== false">Calculating</loader-spinner>
    <template v-else >Calculate my rating<i class="icon-next"></i></template>
  </button>
</template>

<script>
  import LoaderSpinner from './LoaderSpinner'

  export default {
    components: {
      'loader-spinner': LoaderSpinner,
    },
    data: function () {
      return {}
    },
    props: ['awaitingAPIResponse']
  }
</script>
