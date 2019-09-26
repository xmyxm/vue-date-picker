<template>
  <div class="mask" v-bind:style="{top: topHeight + 'px'}" >
    <div class="maskInner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icon from "./icon";

export default {
  name: "elMask",
  components: {
    Icon
  },
  props: {
    top: {
      type: Number,
      default: 0
    },
    onCancel: {
      type: Function,
      default: function() {}
    }
  },
  computed: {
     topHeight: function() {
       return this.top
     }
  },
};
</script>

<style scoped>
.mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(153, 153, 153, 0.8);
    z-index: 10;
    overflow: hidden;
}
.mask .maskInner {
    position: relative;
}
</style>
