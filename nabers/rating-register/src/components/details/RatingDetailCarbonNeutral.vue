<template>
  <div>
    <h4 class="rating-detail__rating-type">Carbon neutral certification</h4>

    <div class="row">
      <div class="description">This building has been certified carbon neutral. Emissions have been compensated for by investing in carbon offset projects.</div>
    </div>
    <rating-detail-expiry-date :rating="rating"></rating-detail-expiry-date>
    <rating-detail-reference-number :rating="rating"></rating-detail-reference-number>
  </div>
</template>

<script>
  import RatingDetailExpiryDate from './RatingDetailExpiryDate'
  import RatingDetailReferenceNo from './RatingDetailReferenceNo'

  export default {
    components: {
      'rating-detail-expiry-date': RatingDetailExpiryDate,
      'rating-detail-reference-number': RatingDetailReferenceNo,
    },
    props: [
      'rating',
    ]
  }
</script>