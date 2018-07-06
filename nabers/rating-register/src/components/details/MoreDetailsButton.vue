<template>
  <button @click="toggle()" class="rating-detail__more-details" :class="{'details-expanded' : expanded}">
    <span><slot></slot></span>
  </button>
</template>
<script>
export default {
  data: function () {
    return {}
  },
  methods:{
    toggle: function(){
      this.$emit('toggle');
    }
  },
  props: ['expanded']
}
</script>
