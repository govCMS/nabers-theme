<template>
  <div class="row">
    <div class="value">{{ rating.RatingReferenceNumber }}</div>
    <div class="label">Rating reference number</div>
  </div>
</template>

<script>
  export default {
    props: ['rating']
  }
</script>