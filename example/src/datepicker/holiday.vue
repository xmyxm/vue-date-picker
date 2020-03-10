<template>
  <div class="normal">
        <!-- 头部年份选择 -->
        <div class="header">
            <div class="headerInner">
                <div class="btn" @click="prevChange">
                    <div class="iconBtn">
                        <Icon type="angleLeft" />
                    </div>
                </div>
                <div class="centerBtn">
                    {{showYear}}
                </div>
                <div class="rightBtn" @click="nextChange">
                    <div class="iconBtn">
                        <Icon type="angleRight" />
                    </div>
                </div>
            </div>
        </div>

        <div class="normalList">
            <div class="holidaynormalListInner">
                <Tap v-for="item in holidayList" :key="item.name"
                    :init-data="item"
                    :class="item.className">
                    <div class="holidayItemWrap">
                        <div :class="item.holidayClassName">
                            {{item.name}}
                        </div>
                        <div class="cellDate">
                            {{item.formatterDay ? item.formatterDay : '数据待就绪'}}
                        </div>
                    </div>
                </Tap>
            </div>
        </div>

        <common-handle v-if="delayChange" />
    </div>
</template>

<script>
import Icon from './icon';
// import Swipe from './swipe';
import Tap from './tap';
import CommonHandle from './commonhandle';
import lunarUtil from './lib/lunar-util';
import tools from './lib/tools';

const holiday = lunarUtil.getHolidayTypeList();
// 支持外部传入显示的节日，可按照节日配置表分类，暂时未做
const holidayListConfig = ['元旦', '春节', '清明', '劳动节', '端午', '中秋', '国庆'];

export default {
  name: 'Holiday',
  components: {
    Icon,
    //    Swipe,
    Tap,
    'common-handle': CommonHandle,
  },
  props: {
    title: {
      type: String,
      default: '春节',
    },
    disabled: {
      type: [Function, Boolean],
      default: false,
    },
    year: {
      type: Number,
      default: (new Date()).getFullYear(),
    },
    delayChange: {
      type: Boolean,
      default: true,
    },
    onClose: {
      type: Function,
      default() {},
    },
    onChange: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      titleNext: this.title,
      showYear: this.year,
      selectYear: this.year,
      holidayItem: {},
      touchStatus: null,
      touchInfo: {},
    };
  },
  computed: {
    holidayList() {
      const { showYear, disabled, titleNext, selectYear } = this;
      const disabledCheck = tools.disabledCheckCreator(disabled);
      const list = [];
      // 传入年份，获取节日开始日期和结束日期
      holidayListConfig.forEach((item, i) => {
        const data = this.getStartEndFormate(showYear, item, disabledCheck);
        data.holidayClassName = 'textName';
        let className = 'normalCell';
        if (data.name === titleNext && selectYear === showYear) {
          className = 'normalActiveCell';
        } else if (data.disabled) {
          className = 'normalDisabledCell';
        }
        data.className = className;
        data.tapClick = this.handleChooseHoliday.bind(this, data);
        list.push(data);
      });
      return list;
    },
  },
  watch: {
    title(newTitle) {
      this.titleNext = newTitle;
    },
    year(newYear) {
      this.selectYear = newYear;
    },
  },
  methods: {
    getStartEndFormate(year, holidayType, disabledCheck) {
      let day = [];
      let holidayData = [];
      let formatterDay;
      let disabled = false;

      holidayData = holiday.filter((item, i) => item.name.indexOf(holidayType) !== -1 && item.year === year);
      day = holidayData[0] && holidayData[0].value && holidayData[0].value.slice();
      if (day) {
        let start = day[0];
        const firstDay = start;
        let end = null;
        start = tools.dateFormat('m月d日', new Date(start));

        if (day.length - 1 > 0) {
          end = tools.dateFormat('d日', new Date(day[day.length - 1]));
        }
        if (end) {
          formatterDay = `${start}-${end}`;
        } else {
          formatterDay = `${start}`;
        }
        disabled = disabledCheck(new Date(firstDay));
      }
      if (!formatterDay) {
        disabled = true;
      }
      return {
        name: holidayType,
        day,
        formatterDay,
        disabled,
      };
    },
    // 选中
    handleChooseHoliday(holidayItem) {
      if (holidayItem.disabled) return;
      const { selectYear, showYear, delayChange, titleNext } = this;
      if (titleNext !== holidayItem.name || selectYear !== showYear) {
        this.selectYear = showYear;
        this.holidayItem = holidayItem;
        this.titleNext = holidayItem.name;
        if (!delayChange) {
          this.$nextTick(function () {
            this.onChange(this.holidayItem, this.selectYear);
          });
        }
      }
    },
    // 改变年
    prevChange() {
      this.showYear = this.showYear - 1;
    },
    nextChange() {
      this.showYear = this.showYear + 1;
    },

    onCancel() {
      this.onClose();
    },

    onSure() {
      const { holidayItem, selectYear } = this;
      delete holidayItem.disabled;
      delete holidayItem.formatterDay;
      if (holidayItem) {
        this.onChange(holidayItem, selectYear);
      }
    },

  },
};
</script>
