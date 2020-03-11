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
    z-index: 10;
    overflow: hidden;
    background-color: rgba(153, 153, 153, 0.8);
}
.mask .maskInner {
    position: relative;
    background: #fff;
}
/* @media screen and (max-width: 419px) {
    .mask {
        background-color: rgba(153, 153, 153, 0.8);
    }
}
@media screen and (min-width: 420px) {
    .mask .maskInner {
      width: 420px;
      left: 50%;
      transform: translateX(-50%);
      border: 1px solid #e4e7ed;
    }
} */
</style>
