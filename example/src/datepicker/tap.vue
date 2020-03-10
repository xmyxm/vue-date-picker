<template>
    <div
        :data-week="initData.number"
        :data-monday="initData.monday"
        :data-sunday="initData.sunday"
        :data-month="initData.month"
        :data-holiday="initData.name"
        :class="initData.tapClassName"
        @click="tapItem"

        >
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Tap',
  props: {
    initData: {
      type: Object,
      required: true,
    },
    // onTouchEnd: {
    //   type: Function,
    //   default() {},
    // },
    // onTouchMove: {
    //   type: Function,
    //   default() {},
    // },
  },
  //   data() {
  //     return {
  //       senseDistance: 30,
  //       duration: 750,
  //       timer: null,
  //       isRabish: false,
  //       cache: {
  //         x: 0,
  //         y: 0,
  //       },
  //     };
  //   },
  methods: {
    // handleTouchStart(e) {
    //   this.isRabish = false;
    //   if (e.touches.length === 1) {
    //     this.cache = {
    //       x: e.touches[0].pageX,
    //       y: e.touches[0].pageY,
    //     };
    //     this.timer && clearTimeout(this.timer);
    //     this.timer = setTimeout(() => {
    //       this.isRabish = true;
    //       this.timer = null;
    //     }, this.duration);
    //   } else {
    //     this.isRabish = true;
    //   }
    // },
    // handleTouchEnd(e) {
    //   this.timer && clearTimeout(this.timer);
    //   if (!this.isRabish && e.changedTouches.length === 1) {
    //     this.isRabish = true;
    //     const touch = e.changedTouches[0];
    //     if (Math.abs(this.cache.x - touch.pageX) <= this.senseDistance &&
    //                 Math.abs(this.cache.y - touch.pageY) <= this.senseDistance) {
    //       this.initData.tapClick && this.initData.tapClick(e);
    //     } else {
    //       this.isRabish = true;
    //     }
    //   } else {
    //     this.isRabish = true;
    //   }
    // },
    // handleTouchMove(e) {
    //   this.timer && clearTimeout(this.timer);
    //   this.isRabish = true;
    // },
    tapItem(e) {
      this.initData.tapClick(e);
    },
  },
//   destroyed() {
//     this.timer && clearTimeout(this.timer);
//   },
};
</script>
