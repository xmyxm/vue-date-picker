<template>
  <div :class="size + (sizeLimit ? '' : ' notLimitSize')">
      <!-- 日历头 -->
      <div class="header" data-role-class="calendar-header">
        <div class="headerInner">
          <div
            :title="locale.lang[lang].btns[0]"
            class="btn"
            @click="handleDateCalc('-1', 'year')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_MINUS_YEAR" />
            </div>
          </div>
          <div
            :title="locale.lang[lang].btns[1]"
            class="btn"
            @click="handleDateCalc('-1', 'month')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_MINUS_MONTH" />
            </div>
          </div>
          <div
            :title="displayDateNext.getFullYear() + '-' + tools.dateFormat('m', this.displayDateNext)"
            class="centerBtn"
          >
            <span @click="handleShowYearSelector">{{displayDateNext.getFullYear()}}</span>
            <span class="dateSplitLine">-</span>
            <span @click="handleShowMonthSelector">{{tools.dateFormat('m', this.displayDateNext)}}</span>
          </div>
          <div
            :title="locale.lang[lang].btns[2]"
            class="rightBtn"
            @click="handleDateCalc('+1', 'month')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_PLUS_MONTH" />
            </div>
          </div>
          <div
            :title="locale.lang[lang].btns[3]"
            class="rightBtn"
            @click="handleDateCalc('+1', 'year')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_PLUS_YEAR" />
            </div>
          </div>
        </div>
      </div>

      <!-- 星期头 -->
      <div class="weekList" data-role-class="calendar-weekList">
        <span class="weekItemWeekend">
          <span>{{locale.lang[lang]['week' + (isLong ? '' : 'Short')][6]}}</span>
        </span>
        <span v-for="i in [0,1,2,3,4,5]" :class="'weekItem' + (i < 5 ? '' : 'Weekend')" :key="i">
          <span>{{locale.lang[lang]['week' + (isLong ? '' : 'Short')][i]}}</span>
        </span>
      </div>

      <!-- 日期单元 -->
      <div class="dayList">
        <Tap
          v-for="dayData in dayListData"
          :class="dayData.status"
          :init-data="dayData"
          :key="`${dayData.year}${dayData.month}${dayData.val}`"
        >
          <span class="dayItemVal">{{dayData.val}}</span>
          <p class="vicationWrap" :title="dayData.lDay">{{dayData.lDay}}</p>
          <p v-if="dayData.holiday" class="holidayWrap">假</p>
          <p v-if="dayData.work" class="workWrap">班</p>
        </Tap>
      </div>

      <common-handle v-if="delayChange" />
    </div>
</template>

<script>
import absoluteCalc from './lib/absolute-calc';
import { dayConverters, cloneClockToDate } from './lib/day-converters';
import tools from './lib/tools';
import conf from './lib/config';
import Icon from './icon';
import Tap from './tap';
import CommonHandle from './commonhandle';

export default {
  name: 'Calendar',
  components: {
    Icon,
    Tap,
    'common-handle': CommonHandle,
  },
  props: {
    // 多语言，'zh' 或 'en'
    lang: {
      type: String,
      default: 'zh',
    },
    locale: {
      type: Object,
      default() { return conf.locale; },
    },
    // 返回数据的格式，默认'Y/m/d'
    format: {
      type: String,
      default: 'Y/m/d',
    },
    // 是否使用长文本，默认否
    isLong: {
      type: Boolean,
      default: false,
    },
    // 范围模式
    enableRange: {
      type: Boolean,
      default: false,
    },
    enablefix: {
      type: Boolean,
      default: false,
    },
    isFirst: {
      type: Boolean,
      default: false,
    },
    // 禁用的范围，false为不禁用，true为全部禁用
    // 数组时为多点禁用
    // 如：[new Date('2015/11/11'), [new Date('2015/11/01'), new Date('2015/11/04')]]表示禁用 2015/11/11 和 2015/11/01 - 2015/11/04
    disabled: {
      type: [Function, Boolean, Object],
      default: false,
    },
    // 日历尺寸，可选normal, medium, large
    size: {
      type: String,
      default: 'normal',
    },
    // 根据size参数来指定最外层容器尺寸，false时将撤去外层容器尺寸的硬性指定
    sizeLimit: {
      type: Boolean,
      default: true,
    },
    // 是否需要显示农历、节假日信息
    lunar: {
      type: Boolean,
      default: false,
    },
    // 是否点击后直接回调
    delayChange: {
      type: Boolean,
      default: true,
    },
    // 展示的日期
    displayDate: {
      type: Object,
    },
    // 选中的日期，范围模式下表示起始日期
    value: {
      type: [Object, Date],
    },
    enablefix: {
      type: Boolean,
    },
    // 配置按钮类型，其值取自Icon组件中的type列表
    btns: {
      type: String,
    },
    // 选择改变时的回调，非范围模式下一般无用
    onChange: {
      type: Function,
      default() {},
    },
    onClose: {
      type: Function,
      default() {},
    },
    onInit: {
      type: Function,
      default() {},
    },
    onUpdate: {
      type: Function,
      default() {},
    },
    // 选中时的回调
    onSelected: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      tools,
      valueNext: this.value,
      displayDateNext: this.displayDate,
      date: null,
      MODE: {
        CALENDAR: 'calendar',
        YEAR: 'year',
        MONTH: 'month',
        CLOCK: 'clock',
      },
      status: 'calendar',
      tmpStatus: 'calendar',
      touchStatus: null,
      touchInfo: {},
      cache: {},
      injectStatus: false,
      validCache: false,
      // disabledCheck: null,
      startDate: null,
      handleChoosedMaskFun(spec) {
        this.handleChoosedMask(spec);
      },
      handleCancelMaskFun() {
        this.handleCancelMask();
      },
    };
  },
  created() {
    const injectStatus = this.getInjectStatus();
    this.validCache = this.injectStatus = injectStatus;
    const parsedClock = tools.parseDate(this.startDate);
    this.cache.hour = parsedClock.hour;
    this.cache.minute = parsedClock.minute;

    this.$nextTick(function () {
      this.triggerInjectEvt('init');
    });
  },
  watch: {
    value(newValue) {
      this.valueNext = newValue;
      const injectStatus = this.getInjectStatus();
      this.validCache = this.injectStatus = injectStatus;
      const parsedClock = tools.parseDate(this.startDate);
      this.cache.hour = parsedClock.hour;
      this.cache.minute = parsedClock.minute;
    },
  },
  computed: {
    btnsNext() {
      return tools.smartyMerge(conf.headBtns, this.btns || {});
    },
    disabledNext() {
      return this.parseDisabledParam();
    },
    disabledCheckNext() {
      return tools.disabledCheckCreator(this.disabledNext);
    },
    dayListData() {
      const { displayDateNext, enableRange, startDate, endDate, disabled, validCache, cache, enablefix, lunar } = this;
      const dateVal = tools.parseDate(displayDateNext);
      const _endDate = enableRange ? (endDate || startDate) : startDate;

      const dayList = dayConverters(
        {
          month: dateVal.month,
          year: dateVal.year,
        },
        {
          start: startDate,
          end: _endDate,
        },
        disabled,
        validCache ? cache : tools.parseDate(),
        enablefix,
        lunar,
      );
      dayList.forEach((item) => {
        item.tapClick = this.handleChooseDay.bind(this, item);
      });
      return dayList;
    },
  },
  methods: {
    parseDisabledParam() {
      if (['function', 'boolean'].indexOf(typeof this.disabled) > -1) {
        return this.disabled;
      }
      if (!tools.isArray(this.disabled)) {
        return false;
      }
      let validFlag = true;
      const pureDisabledParam = [];
      this.disabled.forEach((disabledUnit) => {
        if (tools.isArray(disabledUnit)) {
          let pureParamItem = [];
          for (let i = 0, unitL = disabledUnit.length; i < unitL; i++) {
            const item = disabledUnit[i];
            if (typeof item === 'string') {
              const dataGroup = this.parseDateUnit(item, undefined);
              if (!dataGroup.status) {
                validFlag = false;
                pureParamItem = [];
                break;
              } else {
                pureParamItem.push(dataGroup.date);
              }
            } else if (tools.isDateObj(item)) {
              pureParamItem.push(item);
            } else {
              pureParamItem.push(undefined);
            }
          }
          if (pureParamItem.length) {
            pureDisabledParam.push(pureParamItem);
          }
        } else if (typeof disabledUnit === 'string') {
          const dataGroup = this.parseDateUnit(disabledUnit, undefined);
          if (dataGroup.status) {
            pureDisabledParam.push(dataGroup.date);
          } else {
            validFlag = false;
          }
        } else if (tools.isDateObj(disabledUnit)) {
          pureDisabledParam.push(disabledUnit);
        } else {
          validFlag = false;
        }
      });
      return validFlag && pureDisabledParam;
    },
    getInjectStatus() {
      let injectStatus = false;
      const { enableRange, valueNext, startDate, endDate, displayDateNext } = this;
      if (enableRange) {
        if (valueNext) {
          if (valueNext.startDate && valueNext.endDate) {
            const resolvedStartDate = this.parseDateUnit(
              valueNext.startDate,
              startDate,
            );
            const resolvedEndDate = this.parseDateUnit(valueNext.endDate, endDate);
            this.startDate = resolvedStartDate.date;
            this.endDate = resolvedEndDate.date;
            if (this.startDate > this.endDate) {
              this.endDate = this.startDate;
              this.startDate = resolvedEndDate.date;
            }
            injectStatus = resolvedStartDate.status && resolvedEndDate.status;
          } else if (valueNext.startDate) {
            const resolvedStartDate = this.parseDateUnit(
              valueNext.startDate,
              startDate,
            );
            this.startDate = resolvedStartDate.date;
            this.endDate = null;
            injectStatus = resolvedStartDate.status;
          }
        } else if (valueNext === false) {
          this.startDate = null;
          this.endDate = null;
        }
      } else if (valueNext === false) {
        this.startDate = null;
      } else {
        const resolvedStartDate = this.parseDateUnit(valueNext, startDate);
        this.startDate = resolvedStartDate.date;
        injectStatus = resolvedStartDate.status;
      }
      if (!tools.isDateObj(displayDateNext)) {
        this.displayDateNext = tools.cloneDate(this.startDate) || new Date();
      }
      return injectStatus;
    },
    triggerInjectEvt(ref = 'init') {
      if (this.injectStatus) {
        const dateGroup = this.getData();
        if (this.enableRange && (!dateGroup.date || !dateGroup.date.endDate)) {
          return;
        }
        const cbk = ref === 'init' ? this.onInit : this.onUpdate;
        cbk && cbk(dateGroup.date, dateGroup.format);
      }
    },
    triggerChangeEvt(ref = 'date') {
      const dateGroup = this.getData();
      // 范围选择的情况下，在选择完毕之后才出发onChange事件
      if (this.enableRange && (!dateGroup.date || !dateGroup.date.endDate)) {
        return;
      }
      this.onChange(dateGroup.date, dateGroup.format, ref);
    },
    // 获取当前选中的时间/时间范围
    getData() {
      let formateResult;
      let dateResult = {};
      if (this.enableRange) {
        const startStr = this.startDate
          ? tools.dateFormat(this.format, this.startDate)
          : null;
        const endStr = this.endDate
          ? tools.dateFormat(this.format, this.endDate)
          : null;
        let result = null;
        if (startStr && endStr) {
          result = [startStr, endStr];
          dateResult.startDate = tools.cloneDate(this.startDate);
          dateResult.endDate = tools.cloneDate(this.endDate);
        }
        formateResult = result;
      } else {
        formateResult =
          this.startDate && tools.dateFormat(this.format, this.startDate);
        dateResult = this.startDate && tools.cloneDate(this.startDate);
      }
      if (!this.enableRange) {
        if (!dateResult) {
          formateResult = '';
        }
      } else if (!dateResult.startDate && !dateResult.endDate) {
        dateResult = null;
        formateResult = '';
      }
      return {
        format: formateResult,
        date: dateResult,
      };
    },
    parseDateUnit(date, defaultDate) {
      const resolvedDate = tools.resolveDate(date, this.format, defaultDate);
      return resolvedDate;
    },
    updateClock(date) {
      date = tools.cloneDate(date);
      date.setHours(this.cache.hour);
      date.setMinutes(this.cache.minute);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    },
    // 选中某个日期
    handleChooseDay(dayData) {
      if (dayData.disabled) return;

      const targetDate = new Date(`${dayData.year}/${dayData.month}/${dayData.val}`);
      // 设置clock
      targetDate.setHours(this.cache.hour || 0);
      targetDate.setMinutes(this.cache.minute || 0);

      const { enableRange, startDate, endDate } = this;

      if (enableRange) {
        // 上一次完整设置后，当次先清除旧设置
        if (startDate && endDate) {
          this.startDate = this.endDate = null;
        }
        this[this.startDate ? 'endDate' : 'startDate'] = targetDate;

        // 判断起始日期是否正常
        if (this.startDate && this.endDate) {
          const startDate = this.startDate;
          const startStamp = +startDate;
          const endStamp = +this.endDate;

          if (endStamp < startStamp) {
            this.startDate = this.endDate;
            this.endDate = startDate;
          }
        }
      } else {
        this.startDate = targetDate;
      }
      this.displayDateNext = new Date(targetDate.toGMTString());
      if (!this.delayChange) {
        if (this.onSelected) {
          const choosedDateStr = tools.dateFormat(this.format, targetDate);
          this.onSelected(
            tools.cloneDate(targetDate),
            choosedDateStr,
          );
        }
        this.$nextTick(function () {
          this.triggerChangeEvt();
        });
      }
    },

    prevChange() {
      this.displayDateNext = absoluteCalc('+1month', this.displayDateNext);
    },
    nextChange() {
      this.displayDateNext = absoluteCalc('-1month', this.displayDateNext);
    },
    // date的翻页操作
    handleDateCalc(offset, type) {
      this.displayDateNext = absoluteCalc(offset + type, this.displayDateNext);
    },

    // 年份选择器
    handleShowYearSelector() {
      this.tmpStatus = this.tmpStatus === this.MODE.CALENDAR ? this.MODE.YEAR : this.MODE.CALENDAR;
    },

    // 月份选择器
    handleShowMonthSelector() {
      this.tmpStatus = this.tmpStatus === this.MODE.CALENDAR ? this.MODE.MONTH : this.MODE.CALENDAR;
    },

    handleChoosedMask(spec) {
      switch (this.tmpStatus) {
        case this.MODE.YEAR:
          this.displayDateNext.setFullYear(spec);
          break;
        case this.MODE.MONTH:
          this.displayDateNext.setMonth(spec);
          break;
      }
      this.tmpStatus = this.MODE.CALENDAR;
    },

    handleCancelMask() {
      this.tmpStatus = this.MODE.CALENDAR;
    },

    handleDisableClock(hour, minute) {
      let { startDate, endDate, enableRange } = this;
      if (startDate) {
        startDate = cloneClockToDate(startDate, { hour, minute, second: 0, milliseconds: 0 });
      }
      if (endDate) {
        endDate = cloneClockToDate(endDate, { hour, minute, second: 0, milliseconds: 0 });
      }
      if (enableRange) {
        const startFlag = startDate ? this.disabledCheckNext(startDate) : false;
        const endFlag = endDate ? this.disabledCheckNext(endDate) : false;
        return startFlag || endFlag;
      }
      return startDate ? this.disabledCheckNext(startDate) : false;
    },

    // 时间的更改
    handleClockChanged(clockObj) {
      this.cache.hour = clockObj.hour;
      this.cache.minute = clockObj.minute;
      const { startDate, endDate } = this;
      if (this.enableRange) {
        if (startDate && endDate) {
          this.validCache = true;
          this.startDate = this.updateClock(startDate);
          this.endDate = this.updateClock(endDate);
          this.$nextTick(function () {
            this.triggerChangeEvt('clock');
          });
        }
      } else if (startDate) {
        this.validCache = true;
        this.startDate = this.updateClock(startDate);
        this.$nextTick(function () {
          this.triggerChangeEvt('clock');
        });
      }
    },

    onCancel() {
      this.onClose();
    },

    onSure() {
      if (this.onSelected) {
        const choosedDateStr = tools.dateFormat(this.format, this.startDate);
        this.onSelected(
          tools.cloneDate(this.startDate),
          choosedDateStr,
        );
      }
      this.triggerChangeEvt();
    },
  },
};
</script>

