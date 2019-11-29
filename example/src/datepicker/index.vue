<template>
  <el-mask v-if="openNext" :top="topNext" :on-cancel="onClose" >
    <div v-if="selectKeyList" class="selectButtons">
        <div
        v-for="item in selectKeyList"
        :class="item.boxClassName"
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
  </el-mask>
</template>

<script>
import naturalCalc from './lib/natural-date-calc';
import changecall from './lib/changecall';
import { lastDate, lastDateRange, lastQuarter } from './lib/default-config';
import tools from './lib/tools';
import Year from './year';
import Month from './month';
import Week from './week';
import Mask from './mask';
import Swipe from './swipe';
import Tap from './tap';
import Quarter from './quarter';
import Holiday from './holiday';
import Calendar from './calendar';

export default {
  name: 'DatePicker',
  components: {
    Year,
    Month,
    Week,
    Swipe,
    Tap,
    Quarter,
    Calendar,
    Holiday,
    'el-mask': Mask,
  },
  props: {
    // 选择日期需要传递此参数
    value: {
      type: Date,
      default: lastDate(),
    },
    year: {
      type: Number,
      default: tools.getYear(),
    },
    startDate: {
      type: [Date, Object],
      default: null,
    },
    endDate: {
      type: [Date, Object],
      default: null,
    },
    quarter: {
      type: Number,
      default: lastQuarter(),
    },
    month: {
      type: Number,
      default: tools.getDateMonthNum(),
    },
    week: {
      type: Number,
      default: tools.getDateWeekNum(new Date()),
    },
    title: {
      type: String,
      default: '春节',
    },
    dateRange: {
      type: Object,
      default() { return lastDateRange(); },
    },
    top: {
      type: Number,
      default: 0,
    },
    open: {
      type: Boolean,
      default: false,
    },
    showKeyList: {
      type: Array,
      default() { return ['day', 'week', 'month', 'quarter', 'year', 'festival', 'optional']; },
    },
    buttonKey: {
      type: String,
      default: 'day',
    },
    onClose: {
      type: Function,
      default() {},
    },
    onSus: {
      type: Function,
      default() {},
    },
    dayConfig: {
      type: Object,
      default() {
        const { onSus, onClose, value } = this;
        return {
          onClose,
          lunar: true,
          value,
          onChange(data) { onSus(changecall.handleDateChange(data)); },
        };
      },
    },
    weekConfig: {
      type: Object,
      default() {
        const { onSus, onClose, year, week } = this;
        return {
          onClose,
          year,
          week,
          onChange(data) { onSus(changecall.handleWeekChange(data)); },
        };
      },
    },
    monthConfig: {
      type: Object,
      default() {
        const { onSus, onClose, month, year } = this;
        return {
          year,
          month,
          onClose,
          onChange(month, year) { onSus(changecall.handleMonthChange(month, year)); },
        };
      },
    },
    quarterConfig: {
      type: Object,
      default() {
        const { onSus, onClose, quarter, year } = this;
        return {
          year,
          quarter,
          onClose,
          enableRange: true,
          lunar: true,
          onChange(quarter, year) { onSus(changecall.handleQuarterChange(quarter, year)); },
        };
      },
    },
    yearConfig: {
      type: Object,
      default() {
        const { onSus, onClose, year } = this;
        return {
          year,
          onClose,
          enableRange: true,
          lunar: true,
          onChange(data) { onSus(changecall.handleYearChange(data)); },
        };
      },
    },
    festivalConfig: {
      type: Object,
      default() {
        const { onSus, onClose, title, year } = this;
        return {
          title,
          year,
          onClose,
          enableRange: true,
          lunar: true,
          onChange(data, year) { onSus(changecall.handleFestivalChange(data, year)); },
        };
      },
    },
    optionalConfig: {
      type: Object,
      default() {
        const { onSus, onClose, dateRange } = this;
        return {
          value: dateRange,
          onClose,
          enableRange: true,
          lunar: true,
          onChange(data) { onSus(changecall.handleRangeChange(data)); },
        };
      },
    },
  },
  data() {
    return {
      startDateNext: this.startDate || naturalCalc('-0day', new Date('2017-06-01')),
      endDateNext: this.endDate || naturalCalc('-1day', new Date()),
      openNext: this.open,
      topNext: this.top,
      buttonKeyNext: this.buttonKey,
    };
  },
  created() {

  },
  watch: {
    open(newOpen) {
      this.openNext = newOpen;
      this.$nextTick(function () {
        if (this.openNext) {
          window.addEventListener('touchmove', this.preventEvent, {
            passive: false,
          });
        } else {
          window.removeEventListener('touchmove', this.preventEvent);
        }
      });
    },
    top(newTop) {
      this.topNext = newTop;
    },
    year(newYear) {
      this.yearConfig.year = newYear;
      this.weekConfig.year = newYear;
      this.quarterConfig.year = newYear;
      this.monthConfig.year = newYear;
      this.weekConfig.year = newYear;
      this.dayConfig.year = newYear;
      this.festivalConfig.year = newYear;
    },
    quarter(newQuarter) {
      this.quarterConfig.quarter = newQuarter;
    },
    month(newMonth) {
      this.monthConfig.month = newMonth;
    },
    week(newWeek) {
      this.weekConfig.week = newWeek;
    },
    value(newValue) {
      this.dayConfig.value = newValue;
    },
    dateRange(newRange) {
      this.optionalConfig.value = newRange;
    },
    title(newtitle) {
      this.festivalConfig.title = newtitle;
    },
  },
  computed: {
    selectKeyList() {
      if (this.showKeyList) {
        const keyList = [
          { name: '按日', key: 'day', navName: false },
          { name: '按周', key: 'week', navName: false },
          { name: '按月', key: 'month', navName: false },
          { name: '季度', key: 'quarter', navName: false },
          { name: '按年', key: 'year', navName: false },
          { name: '节假日', key: 'festival', navName: false },
          { name: '自定义', key: 'optional', navName: false },
        ];
        let boxClassName = 'buttonItemWrapper4';
        if (this.showKeyList.length < 4) {
          switch (this.showKeyList.length) {
            case 3: boxClassName = 'buttonItemWrapper3'; break;
            case 2: boxClassName = 'buttonItemWrapper2'; break;
            case 1: boxClassName = 'buttonItemWrapper1'; break;
          }
        }
        const showList = keyList.filter((item) => {
          if (this.showKeyList.indexOf(item.key) > -1) {
            if (item.key == this.buttonKeyNext) {
              item.buttonClassName = 'buttonItem buttonActive';
            } else {
              item.buttonClassName = 'buttonItem';
            }
            item.boxClassName = boxClassName;
            return item;
          }
        });
        return showList;
      }
    },
  },
  methods: {
    preventEvent(e) {
      e.preventDefault();
    },

    buttonEventClick(item) {
      if (item.key !== this.buttonKeyNext) {
        this.buttonKeyNext = item.key;
      }
    },

    disabledWeek(date) {
      let yesterday = this.endDateNext;
      const boundary = this.startDateNext;
      // 按周，昨天所在的周可选
      if (this.buttonKeyNext === 'week') {
        yesterday = tools.resetToFirst(yesterday, 'week');
        yesterday = naturalCalc('+7day', yesterday);
      }
      if (this.buttonKeyNext === 'month') {
        const now = new Date();
        yesterday = now.setMonth(now.getMonth() - 1);
      }
      date = naturalCalc('-0day', date);
      // today = tools.buildNoTimesDate(yesterday);
      if (date < boundary || date > yesterday) {
        return true;
      }
      return false;
    },

    disabledYear(date) {
      const d = new Date();
      const currentYear = d.getFullYear();
      if (date < 2017 || date > currentYear) {
        return true;
      }
      return false;
    },

    susCallBack(fun) {
      return fun();
    },
  },
};
</script>

<style>
@import "./style/index.css";
</style>
