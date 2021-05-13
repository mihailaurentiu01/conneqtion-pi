<template>
  <div>

  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: "NotificationCenter",
  data: () => {
    return {
      opened: false
    }
  },
  methods: {
    toggle(){
      this.opened = this.toggleValue;
    },
    hide(){
      this.opened = false;
    }
  },
  mounted() {
    this.popupItem = this.$el
  },
  directives: {
    ClickOutside
  },
  props: {
    toggleValue: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>

</style>