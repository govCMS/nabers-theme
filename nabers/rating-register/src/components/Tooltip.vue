<template>
  <div class="rr-tooltip">
    <button class="rr-tooltip__toggle" :class="{'rr-tooltip__toggle--expanded' : showTooltip == true}" @click="toggleTooltip()">
      <span>{{ toggleButtonText }}</span>
    </button>
    <div class="rr-tooltip__details" :class="{'rr-tooltip__details--show' : showTooltip}" >
      <button class="rr-tooltip__close" @click="showTooltip = !showTooltip">Close</button>
      <h5><slot name="tooltip-title"></slot></h5>
      <p><slot name="tooltip-body"></slot></p>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        showTooltip : false
      }
    },
    methods: {
      toggleTooltip: function () {
        // Hide other tooltips before showing this one.
        if (this.showTooltip === false) {
          this.$root.$emit('hideTooltips')
          this.showTooltip = !this.showTooltip
        }
      },
      outsideClickListener: function (event) {
        // Hides the tooltip if the user clicks outside it.
        const parent = jQuery(event.target).parents('.rr-tooltip')
        if (parent.length === 0 && this.showTooltip === true) {
          this.showTooltip = false
        }
      }
    },
    mounted: function () {
      this.$root.$on('hideTooltips', () => { this.showTooltip = false });
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
    },
    props: ['toggleButtonText', 'tooltipText']
  }
</script>