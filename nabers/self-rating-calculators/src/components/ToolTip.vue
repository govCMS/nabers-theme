<template>
  <div class="tooltip">
    <button class="tooltip__toggle" :class="{'tooltip__toggle--expanded' : showTooltip == true}"  @click.prevent="showTooltip = !showTooltip">
      <span>info</span>
    </button>
    <div class="tooltip__details" :class="{'tooltip__details--show' : showTooltip}" >
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        showTooltip: false
      }
    },
    methods: {
      outsideClickListener: function (event) {
        // Hides the tooltip if the user clicks outside it.
        const parent = jQuery(event.target).parents('.tooltip');
        if (parent.length === 0 && this.showTooltip === true) {
          this.showTooltip = false;
        }
      }
    },
    watch: {
      showTooltip: function (newVal, oldVal) {
        if (newVal === true) {
          document.addEventListener('click', this.outsideClickListener);
        }
        else {
          document.removeEventListener('click', this.outsideClickListener);
        }
      }
    }
  }
</script>
