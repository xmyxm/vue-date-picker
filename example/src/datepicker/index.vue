<template>
  <div v-if="open">
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
    <Calendar v-if="buttonKeyNext == 'day'" v-bind="dayConfig" :disabled="disabledWeek" ></Calendar>
    <Month v-if="buttonKeyNext == 'month'" v-bind="monthConfig" :disabled="disabledWeek"></Month>
    <Week v-if="buttonKeyNext == 'week'" v-bind="weekConfig" :disabled="disabledWeek"></Week>
    <Calendar v-if="buttonKeyNext == 'optional'" v-bind="optionalConfig" :disabled="disabledWeek"></Calendar>
    <Quarter v-if="buttonKeyNext == 'quarter'" v-bind="quarterConfig"  :disabled="disabledWeek"></Quarter>
    <Year v-if="buttonKeyNext == 'year'" v-bind="yearConfig" :disabled="disabledYear"></Year>
    <Holiday v-if="buttonKeyNext == 'festival'" v-bind="festivalConfig" :disabled="disabledWeek"></Holiday>
  </div>
</template>

<script>
import naturalCalc from './lib/natural-date-calc';
import changecall from "./lib/changecall";
import {lastWeek, lastYearMonth, lastDate, lastDateRange, lastQuarter} from "./lib/default-config";
import tools from "./lib/tools";
import Year from "./year";
import Month from "./month";
import Week from "./week";
import Mask from "./mask";
import Swipe from "./swipe";
import Tap from "./tap";
import Quarter from "./quarter";
import Holiday from "./holiday"
import Calendar from "./calendar";


export default {
  name: "DatePicker",
  components: {
    Year,
    Month,
    Week,
    Swipe,
    Tap,
    Quarter,
    Calendar,
    Holiday,
    "el-mask": Mask,
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    showKeyList: {
      type: Array,
      default: function(){ return ['day', 'week', 'month', 'quarter', 'year', 'festival', 'optional']}
    },
    buttonKey: {
      type: String,
      default: "day"
    },
    onSus: {
      type: Function,
      default: function(){}
    },
    dayConfig: {
      type: Object,
      default: function(){
        let onSus = this.onSus
        return {
          lunar : true,
          value: lastDate(),
          onChange: function(data){ onSus(changecall.handleDateChange(data)) }
        }
      }
    },
    weekConfig: {
      type: Object,
      default: function() {
        let onSus = this.onSus
        return {
          ...lastWeek(),
          onChange: function(data){ onSus(changecall.handleWeekChange(data)) }
        }
      }
    },
    monthConfig: {
      type: Object,
      default: function() {
        let onSus = this.onSus
        return {
          ...lastYearMonth(),
          onChange: function(data){ onSus(changecall.handleMonthChange(data)) }
        }
      }
    },
    quarterConfig: {
      type: Object,
      default: function(){
        let onSus = this.onSus
        return {
          ...lastQuarter(),
          enableRange: true,
          lunar: true,
          onChange: function(data){ onSus(changecall.handleQuarterChange(data)) }
        }
      }
    },
    yearConfig: {
      type: Object,
      default: function(){
        let onSus = this.onSus
        return {
          enableRange: true,
          lunar: true,
          year: tools.getYear(),
          onChange: function(data){ onSus(changecall.handleYearChange(data)) }
        }
      }
    },
    festivalConfig: {
      type: Object,
      default: function(){
        let onSus = this.onSus
        return {
          enableRange: true,
          lunar: true,
          year: tools.getYear(),
          title: '',
          onChange: function(data){ onSus(changecall.handleFestivalChange(data)) }
        }
      }
    },
    optionalConfig: {
      type: Object,
      default: function(){
        let onSus = this.onSus
        return {
          enableRange: true,
          lunar: true,
          value: lastDateRange(),
          onChange: function(data){ onSus(changecall.handleRangeChange(data)) }
        }
      }
    }
  },
  data: function() {
    return {
      buttonKeyNext: this.buttonKey
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
        // today = tools.buildNoTimesDate(yesterday);
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
    },

    susCallBack: function(fun) {
       return fun()
    }
  }
};
</script>

<style>
@import "./style/index.css";
</style>
