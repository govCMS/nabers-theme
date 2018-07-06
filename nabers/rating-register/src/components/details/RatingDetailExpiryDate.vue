<template>
  <div class="row">
      <div class="value">{{ niceDate(rating.CertificateValidTo) }}</div>
      <div class="label">Rating expiry</div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    methods: {
      niceDate: function(date) {
        const formattedDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY')
        return formattedDate != 'Invalid date' ? formattedDate : 'N/A';
      },
    },
    props: ['rating']
  }
</script>