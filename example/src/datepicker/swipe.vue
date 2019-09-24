<template>
    <div :class="className"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd">
      <slot></slot>
    </div>
</template>

<script>
// 与纵轴方向最小的角度
const calcAngleV = (startPoint, endPoint) => {
  if (startPoint.x === endPoint.x) {
    return 0;
  }
  if (startPoint.y === endPoint.y) {
    return Math.PI / 2;
  }
  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2),
  );
  const vDistance = Math.abs(endPoint.y - startPoint.y);
  return Math.acos(vDistance / distance);
};

const calcAngleL = (startPoint, endPoint) => {
  if (startPoint.x === endPoint.x) {
    return Math.PI / 2;
  }
  if (startPoint.y === endPoint.y) {
    return 0;
  }
  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2),
  );
  const lDistance = Math.abs(endPoint.x - startPoint.x);
  return Math.acos(lDistance / distance);
};

export default {
  name: 'Swipe',
  props: {
      className: {
        type: String,
        default: ""
      },
      duration: {
        type: Number,
        default: 750
      },
      senseDistance: {
        type: Number,
        default: 80
      },
      allowedOffsetAngle: {
        type: Number,
        default: Math.PI / 4
      },
      onTouchStart: {
        type: Function
      },
      onTouchEnd: {
        type: Function,
        default: function(){}
      },
  },
  data: function(){
    return {
      timer: null,
      isRabish: false,
      cache: {
          x: 0,
          y: 0
      }
    }
  },
  methods: {
      onSwipeLeft: function(e) {
          this.$parent.prevChange && this.$parent.prevChange(e);
      },
      onSwipeRight: function(e) {
          this.$parent.nextChange && this.$parent.nextChange(e);
      },
      onSwipeUp: function() {
        
      },
      onSwipeDown: function() {
        
      },
    handleTouchStart: function(e) {
        this.isRabish = false;
        if (e.touches.length === 1) {
            this.cache = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            };
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isRabish = true;
                this.timer = null;
            }, this.duration);
        }
        else {
            this.isRabish = true;
        }
        this.onTouchStart && this.onTouchStart(e);
    },
    handleTouchEnd: function(e) {
        e.preventDefault();
        this.timer && clearTimeout(this.timer);
        if (!this.isRabish && e.changedTouches.length === 1) {
            this.isRabish = true;
            let touch = e.changedTouches[0];
            let changedL = this.cache.x - touch.pageX;
            let changedV = this.cache.y - touch.pageY;
            if (Math.abs(changedL) >= this.senseDistance &&
                calcAngleL({x: touch.pageX, y: touch.pageY}, this.cache) < this.allowedOffsetAngle) {
                if (changedL > 0) {
                    this.onSwipeLeft(e);
                } else {
                    this.onSwipeRight(e);
                }
            }
            else if (Math.abs(changedV) >= this.senseDistance &&
                calcAngleV({x: touch.pageX, y: touch.pageY}, this.cache) < this.allowedOffsetAngle) {
                if (changedV > 0) {
                    this.onSwipeUp(e);
                } else {
                    this.onSwipeDown(e);
                }
            }
        }
        else {
            this.isRabish = true;
        }
        this.onTouchEnd(e);
    },
  },
  destroyed: function() {
    this.timer && clearTimeout(this.timer);
  }
};
</script>

