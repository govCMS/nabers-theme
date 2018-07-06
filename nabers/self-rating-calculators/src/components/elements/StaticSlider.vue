<template>
  <div class="slider">
    <div class="slider__average--indicator" :style="{ left: cssCalc(1, settings.avg) }"></div>
    <div class="slider__average--text" :style="{ paddingLeft: cssCalc(22, settings.avg) }">Average</div>
    <div class="slider__gauge">
      <div>{{ settings.min }}</div>
      <div>{{ settings.max }}</div>
    </div>
    <div :class="'slider__range slider__range--'  + settings.better">
      <div class="slider__range__arrow" v-show="reading >= settings.min && reading <= settings.max" :style="{ left: cssCalc(7, reading) }"></div>
      <div class="slider__range__reading" :style="{ width: cssCalc(0, settings.avg) }"></div>
    </div>
    <div class="slider__you-are-here" v-show="reading >= settings.min && reading <= settings.max" :style="{ paddingLeft: cssCalc(35, reading) }">You are here</div>
  </div>
</template>

<script>
  import ErrorMessage from "./ErrorMessage"

  export default {
    components: {
      "error-message": ErrorMessage,
    },
    data: function () {
      return {}
    },
    methods: {
      cssCalc: function (px, secondValue) {
        return 'calc(' + this.readingWidth(this.settings.max, secondValue) + '% - ' + px + 'px)';
      },
      betterThanAverage() {
        if (this.settings.better === 'larger') {
          return this.reading > this.settings.avg;
        }
        else {
          return this.reading < this.settings.avg;
        }
      },
      readingWidth(max, reading) {
        //  100% of visible space = this.max - this.min
        var visibleSpace = this.settings.max - this.settings.min;
        return Math.round(((reading - this.settings.min) / visibleSpace) * 100);
      },
      countDecimalPlaces(value) {
        if ((value % 1) != 0) {
          return value.toString().split(".")[1].length;
        }
        return 0;
      },
      limitDP(value, limit) {
        if (value.toString().indexOf('.') > -1) {
          value = Number.parseFloat(value).toFixed(limit);
        }
        return value;
      },
      midPointMarker() {
        if (this.settings.mid) {
          return this.settings.mid;
        }
        else {
          var mid = this.settings.min + ((this.settings.max - this.settings.min) / 2);
          var originalDPs = this.countDecimalPlaces(this.settings.max);
          var numDPs = this.countDecimalPlaces(mid);
          if (numDPs > originalDPs) {
            numDPs = originalDPs + 1;
          }
          return this.limitDP(mid, numDPs);
        }
      }
    },
    props: ['settings', 'reading', 'error']
  }
</script>
