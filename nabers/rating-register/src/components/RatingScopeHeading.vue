<template>
  <div class="rating-scope-info" v-if="this.label">
    <button class="rating-scope-info__heading scope-label" @click="showDetails">{{ this.label }}</button>
    <tooltip v-if="hasTooltip" :toggleButtonText="'Information about ' + this.label ">
      <template slot="tooltip-title">{{ this.label }}</template>
      <template slot="tooltip-body">{{ this.ratingToolTips }}</template>
      </tooltip>
  </div>
</template>

<script>
  
  import tooltip from './Tooltip';

  export default {
    components: {
      tooltip: tooltip
    },
    data: function () {
      return {
        hasTooltip: false,
        showInfo: false,
        ratingToolTips: ''
      }
    },
    methods: {
      getToolTipText: function(){
        return '<h5>' + this.label + '</h5>' 
        + '<p>' + this.ratingToolTips + '</p>';
      },
      showDetails: function () {
        this.$emit('showDetails');
      }
    },
    props: ['label'],
    mounted: function () {
      const scopeHelpText = {
        'base-building': 'Base building assesses the central services of an office building. For example: lifts and common area lighting.',
        'whole-building': 'Whole building assesses the combined impact of office tenancies and base building services (e.g. lifts and common area lighting).',
        'it-equipment': 'IT equipment assesses the impact of energy consumed by data centre IT equipment. It does not include any other infrastructure.',
        'whole-facility': 'Whole facility assesses the combined impact of IT equipment and data centre infrastructure (e.g. air-conditioning and lighting).',
        'infrastructure': 'Infrastructure assesses the impact of data centre infrastructure services. This includes air-conditioning and lighting, and power conditioning, distribution and back-up.'
      }
      const id = this.label.replace(/\s+/g, '-').toLowerCase();
      if (scopeHelpText[id] != undefined) {
        this.ratingToolTips = scopeHelpText[id];
        this.hasTooltip = true;
      }
    }
  }
</script>
