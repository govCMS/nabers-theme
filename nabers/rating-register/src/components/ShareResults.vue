<template>
  <div class="rating-register-share-results">
    <button @click="shareClick()" class="rating-register-share-results__toggle"><slot>Share results</slot></button>
    <div v-if="showPopup" class="rating-register-share-results__popup">
      <button @click="closePopup()" class="rating-register-share-results__close">Close</button>
      <div class="rating-register-share-results__field">
        <label for="shareLink">Use this link to share this result</label>
        <input id="shareLink" type="text" v-model="shareLink" />
        <button @click="copy()" class="rating-register-share-results__copy">Copy</button>
      </div>
      <div class="rating-register-share-results__message">
        {{ copyOutput }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      shareLink: '',
      showPopup: false,
      copyOutput: ''
    }
  },
  methods: {
    shareClick: function() {
      this.shareLink = window.location.href;
      this.showPopup = true;
    },
    closePopup: function() {
      this.showPopup = false;
      this.copyOutput = '';
    },
    copy: function() {
      this.$el.querySelector('input').select();
      try {
        var successful = document.execCommand('copy');
        this.copyOutput = successful ? 'Copied to clipboard' : 'Unable to copy';
      } catch (err) {
        this.copyOutput = 'Unable to copy';
      }
    }
  }
}
</script>
