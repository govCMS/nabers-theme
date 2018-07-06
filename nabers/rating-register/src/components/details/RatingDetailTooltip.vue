<template>
  <div class="tooltip">
    <button @click="expanded = !expanded">{{ expanded ? 'Hide' : 'Show'}}  tool tip</button>
    <div v-show="expanded" class="tooltip-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        expanded: false,
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss">
.tooltip-wrapper {
  background-color: #efefef;
  border: 1px solid #ccc;
  font-size: 12px;
  padding: 10px;
}
</style>