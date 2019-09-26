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
import absoluteCalc from "./lib/absolute-calc";
import naturalCalc from './lib/natural-date-calc';
import {lastWeek, lastYearMonth, lastDate, lastDateRange, lastQuarter} from "./lib/default-config"
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

const holidayQuery = [
    { name: '元旦', query: 'NewYearsDay' },
    { name: '春节', query: 'SpringFestival' },
    { name: '清明节', query: 'ChingMingFestival' },
    { name: '劳动节', query: 'MayDay' },
    { name: '端午节', query: 'DragonBoatFestival' },
    { name: '中秋节', query: 'MoonFestival' },
    { name: '国庆节', query: 'NationalHoliday' }
];

const handleDateChange = (value) => {
    let item = {
        name: '按日',
        key: 'day',
        navName: tools.dateFormat('m-d', value),
        fetchDate: tools.dateFormat('Y-m-d', value)
    };
};

const handleWeekChange = (value) => {
    let year = new Date(value.sunday).getFullYear();
    let monday = tools.dateFormat('Y-m-d', new Date(value.monday));
    let sunday = tools.dateFormat('Y-m-d', new Date(value.sunday));
    let item = {
        name: '按周',
        key: 'week',
        navName: `W${value.week}`,
        fetchDate: `${monday}~${sunday}`
    };
};

const handleMonthChange = (month, year) => {
    let newMonth = month < 10 ? `0${month}` : month;
    let item = {
        name: '按月',
        key: 'month',
        navName: `${year}-${newMonth}`,
        fetchDate: `${year}-${newMonth}`
    };
};

const handleRangeChange = (dateGroup, formatString) => {
    // 选中单独一天无效
    if (dateGroup.startDate - dateGroup.endDate === 0) {
        return false;
    }
    let item = {
        name: '自定义时间段',
        key: 'optional',
        navName: `${tools.dateFormat('m-d', dateGroup.startDate)}~${tools.dateFormat('m-d', dateGroup.endDate)}`,
        fetchDate: `${tools.dateFormat('Y-m-d', dateGroup.startDate)}~${tools.dateFormat('Y-m-d', dateGroup.endDate)}`
    };
};

const handleQuarterChange = (quarter, year) => {
    if (quarter === '') {
        maskAction.update(MIDS.HEAD_CALENDAR_MASK, false, {});
        return;
    }
    let item = {
        name: '',
        key: 'quarter',
        navName: `第${quarter}季度`,
        fetchDate: `${year}-${quarter}`
    };
};

const handleYearChange = (y) => {
    let item = {
        name: '',
        key: 'year',
        navName: `按年 ${y}年`,
        fetchDate: y
    };
};

const handleFestivalChange = (param, year) => {
    let data = [];
    data = holidayQuery.filter((item, i) => {
        return item.name.indexOf(param.name) !== -1;
    });
    let item = {
        name: '',
        key: 'festival',
        navName: `${param.name}`,
        fetchDate: `${year}-${data[0].query}`
    };
};

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
    dayConfig: {
      type: Object,
      default: function(){
        return {
          lunar : true,
          onChange: handleDateChange,
          value: lastDate()
        }
      }
    },
    weekConfig: {
      type: Object,
      default: function() {
        return {
          ...lastWeek(),
          onChange: handleWeekChange,
        }
      }
    },
    monthConfig: {
      type: Object,
      onChange: handleMonthChange,
      default: lastYearMonth
    },
    quarterConfig: {
      type: Object,
      default: function(){
        return {
          ...lastQuarter(),
          enableRange: true,
          lunar: true,
          onChange: handleQuarterChange
        }
      }
    },
    yearConfig: {
      type: Object,
      default: function(){
        return {
          enableRange: true,
          lunar: true,
          year: tools.getYear(),
          onChange: handleYearChange
        }
      }
    },
    festivalConfig: {
      type: Object,
      default: function(){
        return {
          enableRange: true,
          lunar: true,
          year: tools.getYear(),
          title: '',
          onChange: handleFestivalChange
        }
      }
    },
    optionalConfig: {
      type: Object,
      default: function(){
        return {
          enableRange: true,
          lunar: true,
          value: lastDateRange(),
          onChange: handleRangeChange
        }
      }
    },
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
    }
  }
};
</script>

<style>
@import "./style/index.css";
</style>
