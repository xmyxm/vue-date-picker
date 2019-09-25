<template>
<div>
    <div class="selectButtons">
        <div
        v-for="item in selectTypeList"
        class="buttonItemWrapper"
        :key="item.key"
        @click="buttonEventClick(item)"
        >
            <div :class="item.buttonClassName">
                <div class="text">{{item.name}}</div>
            </div>
        </div>
    </div>
    <Calendar v-if="typeNext == 'day'"></Calendar>
    <Month v-if="typeNext == 'month'"></Month>
    <Week v-if="typeNext == 'week'"></Week>
    <Calendar v-if="typeNext == 'optional'"></Calendar>
    <Quarter v-if="typeNext == 'quarter'"></Quarter>
    <Year v-if="typeNext == 'year'"></Year>
    <Holiday v-if="typeNext == 'festival'"></Holiday>
  </div>
</template>

<script>
import absoluteCalc from "./lib/absolute-calc";
import tools from "./lib/tools";
import conf from "./lib/config";
import common from "./lib/common";
import lunarUtil from "./lib/lunar-util";
import Year from "./year";
import Month from "./month";
import Week from "./week";
import Clock from "./clock";
import Mask from "./mask";
import Icon from "./icon";
import Swipe from "./swipe";
import Tap from "./tap";
import Holiday from "./holiday"
import Calendar from "./calendar";
import CommonHandle from "./commonhandle";

export default {
  name: "DatePicker",
  components: {
    Year,
    Month,
    Week,
    Clock,
    Swipe,
    Icon,
    Tap,
    Calendar,
    "el-mask": Mask,
    "common-handle": CommonHandle
  },
  props: {
    type: {
      type: String,
      default: "day"
    },
    buttonKey: {
      type: String,
      default: "day"
    }
  },
  data: function() {
    return {
      typeNext: this.type,
      buttonKeyNext: this.buttonKey
    };
  },
  created() {},
  watch: {},
  computed: {
    selectTypeList: function() {
      let typeList = [
        { name: "按日", key: "day", navName: false },
        { name: "按周", key: "week", navName: false },
        { name: "按月", key: "month", navName: false },
        { name: "季度", key: "quarter", navName: false },
        { name: "按年", key: "year", navName: false },
        { name: "节假日", key: "festival", navName: false },
        { name: "自定义", key: "optional", navName: false }
      ];
      typeList.forEach(item => {
        if (item.key == this.buttonKeyNext) {
          item.buttonClassName = "buttonItem buttonActive";
        } else {
          item.buttonClassName = "buttonItem";
        }
      });
      return typeList;
    }
  },
  methods: {
    buttonEventClick: function(item) {
      if (item.key !== this.buttonKeyNext) {
        this.buttonKeyNext = item.key;
      }
    }
  }
};
</script>

<style>
@import "./style/index.css";
</style>
