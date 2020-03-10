<template>
  <div class="mask" v-bind:style="{top: topHeight + 'px'}" @click="close($event)" >
    <div class="maskInner">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'elMask',
  components: {},
  props: {
    top: {
      type: Number,
      default: 0,
    },
    onCancel: {
      type: Function,
      default() {},
    },
  },
  computed: {
    topHeight() {
      return this.top;
    },
  },
  methods: {
    close(event) {
      if (event.target && event.target.className == 'mask') {
        this.onCancel();
      }
    },
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
    background: #fff;
}
</style>
