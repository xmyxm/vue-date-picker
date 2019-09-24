<template>
  <div :class="'notLimitSize ' + size ">
        <div class="normalList">
            <div class="groupCell">
                <input
                    type="text"
                    :value="hour"
                    class="clockInput"
                    @change="handleHoursChange"
                    @keyup="handleHourKeyUp"/>
            </div>
            <div class="groupCellSplit">&nbsp;</div>
            <div class="groupCell">
                <input
                    type="text"
                    :value="minute"
                    class="clockInput"
                    @change="handleMinuteChange"
                    @keyup="handleMinuteKeyUp"/>
            </div>
        </div>
    </div>
</template>

<script>
import common from "./lib/common";
import tools from "./lib/tools";

const DEFAULT_TIME = { hour: 0, minute: 0 };

const sizeMap = {
  normal: "clockWrapper",
  medium: "clockWrapperMedium",
  large: "clockWrapperLarge"
};

export default {
  name: "Clock",
  props: {
    lang: {
      type: String,
      default: "zh"
    },
    time: {
      type: Object,
      default: new Date()
    },
    // 日历尺寸，可选normal, medium, large
    size: {
      type: String,
      default: "normal"
    },
    // 根据size参数来指定最外层容器尺寸，false时将撤去外层容器尺寸的硬性指定
    sizeLimit: {
      type: Boolean,
      default: true
    },
    disableClock: {
        type: Function
    },
    onChange: {
      type: Function,
      default: function() {}
    }
  },
  data: function(){
      return {
        hour: '00',
        minute: '00'
    }
  },
  created() {
    let dateObj = tools.isDateObj(this.time) ? tools.parseDate(this.time) : tools.smartyMerge(DEFAULT_TIME, this.time);
    this.hour = tools.subNum(dateObj.hour, 2);
    this.minute = tools.subNum(dateObj.minute, 2);
  },
  methods: {
    handleChange: function() {
        this.onChange({hour: this.hour, minute: this.minute});
    },

    handleHoursChange: function(e) {
        let el = e.currentTarget;
        if (el) {
            if (tools.likeInt(el.value, true)) {
                let hour = parseInt(el.value, 10);
                if (hour < 24) {
                    let flag = this.disableClock ? this.disableClock(hour, this.minute) : false;
                    if (!flag) {
                        this.hour = tools.subNum(hour, 2);
                        this.$nextTick(function(){
                            this.handleChange();
                        })
                    }
                }
            }
        }
    },

    handleMinuteChange: function(e) {
        let el = e.currentTarget;
        if (el) {
            if (tools.likeInt(el.value, true)) {
                let minute = parseInt(el.value, 10);
                if (minute < 60) {
                    let flag = this.disableClock ? this.disableClock(this.hour, minute) : false;
                    if (!flag) {
                        this.minute = tools.subNum(minute, 2);
                        this.$nextTick(function(){
                            this.handleChange();
                        })
                    }
                }
            }
        }
    },

    handleStepAct: function(type, act) {
        if (type === 'hour') {
            let hour = parseInt(this.hour, 10) || 0;
            hour += (act === 'add' ? 1 : -1);
            if (hour < 0) {
                hour = 23;
            }
            else if (hour > 23) {
                hour = 0;
            }
            this.hour = tools.subNum(this.hour, 2);
        }
        else {
            let minute = parseInt(this.minute, 10) || 0;
            minute += (act === 'add' ? 1 : -1);
            if (minute < 0) {
                minute = 59;
            }
            else if (minute >= 60) {
                minute = 0;
            }
            this.minute = tools.subNum(this.minute, 2);
        }
        let flag = this.disableClock ?
            this.disableClock(parseInt(this.hour, 10), parseInt(this.minute, 10)) : false;
        if (!flag) {
            this.$nextTick(function(){
                this.handleChange();
            })
        }
    },

    handleMinuteKeyUp: function(e) {
        let keyCode = e.keyCode;
        if (keyCode === 38) {
            this.handleStepAct('minute', 'add');
        }
        else if (keyCode === 40) {
            this.handleStepAct('minute', 'minus');
        }
    },
    handleHourKeyUp: function(e) {
        let keyCode = e.keyCode;
        if (keyCode === 38) {
            this.handleStepAct('hour', 'add');
        }
        else if (keyCode === 40) {
            this.handleStepAct('hour', 'minus');
        }
    }
  }
};
</script>
