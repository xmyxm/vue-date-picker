<template>
<div>
    <div v-if="selectKeyList" class="selectButtons">
        <div
        v-for="item in selectKeyList"
        class="buttonItemWrapper"
        :key="item.key"
        @click="buttonEventClick(item)"
        >
            <div :class="item.buttonClassName">
                <div class="text">{{item.name}}</div>
            </div>
        </div>
    </div>
    <Calendar v-if="buttonKeyNext == 'day'" lunar :value="lastDate" :disabled="disabledWeek" ></Calendar>
    <Month v-if="buttonKeyNext == 'month'" :disabled="disabledWeek"></Month>
    <Week v-if="buttonKeyNext == 'week'" :disabled="disabledWeek"></Week>
    <Calendar v-if="buttonKeyNext == 'optional'" enable-range  lunar :value="lastDateRange" :disabled="disabledWeek"></Calendar>
    <Quarter v-if="buttonKeyNext == 'quarter'" enable-range  lunar :year="lastQuarter.year" :quarter="lastQuarter.quarter"  :disabled="disabledWeek"></Quarter>
    <Year v-if="buttonKeyNext == 'year'" enable-range  lunar :year="lastYear.year" :disabled="disabledYear"></Year>
    <Holiday v-if="buttonKeyNext == 'festival'" enable-range  lunar :year="lastFestival.year" :title="lastFestival.title" :disabled="disabledWeek"></Holiday>
  </div>
</template>

<script>
import absoluteCalc from "./lib/absolute-calc";
import naturalCalc from './lib/natural-date-calc';
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
import Quarter from "./quarter";
import Holiday from "./holiday"
import Calendar from "./calendar";
import CommonHandle from "./commonhandle";

const getLastDateRange = function() {
  // 默认显示本周一到昨天
  let startDate = tools.resetToFirst(new Date(), 'week'); // 重置周一
  startDate = tools.dateFormat('Y/m/d', startDate);
  let endDate = naturalCalc('-1day', new Date());
  endDate = tools.dateFormat('Y/m/d', endDate);
  return { startDate, endDate };
}

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
    Quarter,
    Calendar,
    Holiday,
    "el-mask": Mask,
    "common-handle": CommonHandle
  },
  props: {
    showKeyList: {
      type: Array,
      default: function(){ return ['day', 'week', 'month', 'quarter', 'year', 'festival', 'optional']}
    },
    buttonKey: {
      type: String,
      default: "day"
    }
  },
  data: function() {
    return {
      buttonKeyNext: this.buttonKey,
      lastQuarter: {
          year: 2019,
          quarter: 3
      },
      lastFestival: {
        year: 2019,
        title: "节假日"
      },
      lastYear: {
        year: 2019
      },
      lastDate: naturalCalc('-1day', new Date()),
      lastDateRange: getLastDateRange()
    };
  },
  created() {

  },
  watch: {},
  computed: {
    selectKeyList: function() {
      if (this.showKeyList) {
        let keyList = [
        { name: "按日", key: "day", navName: false },
        { name: "按周", key: "week", navName: false },
        { name: "按月", key: "month", navName: false },
        { name: "季度", key: "quarter", navName: false },
        { name: "按年", key: "year", navName: false },
        { name: "节假日", key: "festival", navName: false },
        { name: "自定义", key: "optional", navName: false }
      ];
      let showKey = keyList.filter(item => {
        if (this.showKeyList.indexOf(item.key) > -1) {
          if (item.key == this.buttonKeyNext) {
            item.buttonClassName = "buttonItem buttonActive";
          } else {
            item.buttonClassName = "buttonItem";
          }
          return item
        }
      });
      return keyList;
      }
    }
  },
  methods: {
    buttonEventClick: function(item) {
      if (item.key !== this.buttonKeyNext) {
        this.buttonKeyNext = item.key;
      }
    },

    disabledWeek: function (date) {
        let yesterday = naturalCalc('-1day', new Date());
        let boundary = naturalCalc('-0day', new Date('2017-06-01'));
        // 按周，昨天所在的周可选
        if (this.buttonKeyNext === 'week') {
            yesterday = tools.resetToFirst(yesterday, 'week');
            yesterday = naturalCalc('+7day', yesterday);
        }
        date = naturalCalc('-0day', date);
        // today = tool.buildNoTimesDate(yesterday);
        if (date < boundary || date > yesterday) {
            return true;
        }
        return false;
    },

    disabledYear: function(date) {
        let d = new Date();
        let currentYear = d.getFullYear();
        if (date < 2017 || date > currentYear) {
            return true;
        }
        return false;
    }

  }
};
</script>

<style>
@import "./style/index.css";
</style>
