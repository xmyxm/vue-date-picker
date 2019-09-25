<template>
  <div :class="size + (sizeLimit ? '' : ' notLimitSize')">
    <div class="inner">
      <!-- 蒙层和日历组件 -->
      <el-mask v-if="tmpStatus" :on-cancel="handleCancelMaskFun">
        <Year
          v-if="tmpStatus == MODE.YEAR"
          v-bind="maskSpec"
          :year="displayDateNext.getFullYear()"
          :on-change="handleChoosedMaskFun"
        ></Year>
        <Month
          v-if="tmpStatus == MODE.MONTH"
          v-bind="maskSpec"
          :year="displayDateNext.getMonth()"
          :on-change="handleChoosedMaskFun"
        ></Month>
        <Clock
          v-if="tmpStatus == MODE.CLOCK"
          v-bind="maskSpec"
          :time="startDate"
          :on-change="handleClockChangedFun"
          :disable-clock="handleDisableClockFun"
        ></Clock>
      </el-mask>

      <!-- 日历头 -->
      <div class="header" data-role-class="calendar-header">
        <div class="headerInner">
          <div
            :title="locale.lang[lang].btns[0]"
            class="btn"
            @touchend="handleDateCalc('-1', 'year')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_MINUS_YEAR" />
            </div>
          </div>
          <div
            :title="locale.lang[lang].btns[1]"
            class="btn"
            @touchend="handleDateCalc('-1', 'month')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_MINUS_MONTH" />
            </div>
          </div>
          <div
            :title="displayDateNext.getFullYear() + '-' + tools.dateFormat('m', this.displayDateNext)"
            class="centerBtn"
          >
            <span @touchend="handleShowYearSelector">{{displayDateNext.getFullYear()}}</span>
            <span class="dateSplitLine">-</span>
            <span @touchend="handleShowMonthSelector">{{tools.dateFormat('m', this.displayDateNext)}}</span>
          </div>
          <div
            :title="locale.lang[lang].btns[2]"
            class="rightBtn"
            @touchend="handleDateCalc('+1', 'month')"
          >
            <div class="iconBtn">
              <Icon :type="btnsNext.BTN_PLUS_MONTH" />
            </div>
          </div>
          <div
            :title="locale.lang[lang].btns[3]"
            class="rightBtn"
            @touchend="handleDateCalc('+1', 'year')"
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
      <Swipe class-name="dayList" data-role-class="calendar-dayList">
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
      </Swipe>

      <!-- 渲染日历脚(clock相关) -->
      <div v-if="enableClock" class="footer" data-role-class="calendar-footer">
        <Clock
          v-bind="maskSpec"
          :time="startDate"
          disable-clock="handleDisableClockFun"
          on-change="handleClockChangedFun"
        />
      </div>

      <common-handle v-if="delayChange" />
    </div>
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
import CommonHandle from "./commonhandle";

const CONF = {
  CURRENT: "dayItem",
  ACTIVE: "dayActive",
  REGION: "dayRegion",
  TODAY: "today",
  ACTIVE_TODAY: "todayActive",
  REGION_TODAY: "todayRegion",
  DISABLED: "dayDisabled",
  PREV: "dayPrev",
  NEXT: "dayNext"
};

const cloneClockToDate = (date, parsedBasedDate) => {
  if (parsedBasedDate === false) {
    return date;
  }
  date = tools.cloneDate(date);
  date.setHours(parsedBasedDate.hour || 0);
  date.setMinutes(parsedBasedDate.minute || 0);
  date.setSeconds(parsedBasedDate.second || 0);
  date.setMilliseconds(0);
  return date;
};

// 给日期添加农历，节假日
const addLunarInfo = dayList => {
  let year;
  let month;
  let day;
  var firstDay;
  var monthDaySum;
  var tempMonth;
  var tempDay;

  for (let i = 0; i < dayList.length; i++) {
    let showInfo;
    let holiday;
    let work;
    year = parseInt(dayList[i].year, 10);
    month = parseInt(dayList[i].month, 10);
    day = parseInt(dayList[i].val, 10);
    // 初始化 或 新的一月，需要重新获取起始农历时间
    if (!tempDay || tempDay > monthDaySum) {
      firstDay = lunarUtil.solar2lunar(year, month, day);
      monthDaySum = firstDay.isLeap
        ? lunarUtil.leapDays(year)
        : lunarUtil.monthDays(firstDay.lYear, firstDay.lMonth);
      tempMonth = firstDay.lMonth;
      tempDay = firstDay.lDay;
    }
    showInfo = lunarUtil.toChinaDay(tempDay);
    if (tempDay === 1) {
      showInfo = firstDay.IMonthCn;
    }
    let holidayInfo = lunarUtil.getHolidayInfo(
      tempMonth,
      tempDay,
      year,
      month,
      day
    );
    // 展示信息优先级：农历节日 > 特殊节日（母亲节等）> 公历节日 > 月份（每月初一显示月份）> 日期
    showInfo = holidayInfo.vication || showInfo;
    holiday = holidayInfo.holiday;
    work = holidayInfo.work;

    dayList[i].lDay = showInfo;
    dayList[i].holiday = holiday;
    dayList[i].work = work;
    tempDay += 1;
  }
  return dayList;
};

// 日期数据转换器，生成render所需的日期数据
// 添加enablefix，表示是否范围日历，若范围日历enablefix设为true
const dayConverters = (
  { month, year },
  { start: startDateData, end: endDateData },
  disabledMap,
  cache,
  enablefix,
  lunar
) => {
  // 该月日期总数
  let dayNum = tools.getMonthDaysNum(month, year);
  // 该月第一天是周几
  let startDayWeek = tools.getWeek(1, month, year);
  // 该月最后一天是周几
  let lastDayWeek = tools.getWeek(dayNum, month, year);

  let startDate, endDate, startDateStamp, endDateStamp;
  // 今天的
  let todayStartNum = parseInt(tools.dateFormat("Ymd", new Date()), 10);
  // 完全没选中的标识
  let absoluteNoChoosed = true;

  // 禁用检测器
  let disabledCheck = tools.disabledCheckCreator(disabledMap);

  // 非范围状态下表示已选择，范围模式下表示存在起点
  // 分别获取对应的时间戳，自动归类起点/终点
  if (startDateData) {
    startDate = tools.resetToFirst(startDateData, "hours");
    endDate = tools.resetToFirst(endDateData, "hours");
    startDateStamp = +startDate;
    endDateStamp = +endDate;

    if (startDateStamp > endDateStamp) {
      let tmpDate = endDate;
      let tmpEndDateData = endDateData;
      startDateStamp = endDateStamp;
      endDateStamp = +startDate;
      endDate = startDate;
      startDate = tmpDate;
      endDateData = startDateData;
      startDateData = tmpEndDateData;
    }

    absoluteNoChoosed = false;
  }

  let dayVal;
  let checkedParam;
  let dayData = [];
  let startDateNum = year + (month.toString().length < 2 ? "0" : "") + month;
  let disabledFlag = false;
  let currentPos;
  // 用于比较范围/选中
  startDate = startDate && parseInt(tools.dateFormat("Ymd", startDate), 10);
  endDate = endDate && parseInt(tools.dateFormat("Ymd", endDate), 10);

  // 获取主体部分数据
  for (let i = 0; i < dayNum; i++) {
    dayVal = i + 1;

    let status = CONF.CURRENT;
    // 日期的数字形式，用于比较选中
    let tmpDate = new Date([year, month, dayVal].join("/"));
    let tmpDateNum = parseInt(
      startDateNum + (dayVal < 10 ? "0" : "") + dayVal,
      10
    );
    checkedParam = cloneClockToDate(tmpDate, cache);
    currentPos = "normal";

    if (
      !absoluteNoChoosed &&
      tmpDateNum >= startDate &&
      tmpDateNum <= endDate
    ) {
      status = CONF.ACTIVE;
      if (tmpDateNum === startDate && tmpDateNum === endDate) {
        currentPos = "startEnd";
      } else if (tmpDateNum === startDate) {
        currentPos = "start";
      } else if (tmpDateNum === endDate) {
        currentPos = "end";
      } else {
        status = CONF.REGION;
        currentPos = "choosed";
      }
    }
    disabledFlag = disabledCheck(checkedParam, currentPos);
    if (disabledFlag) {
      status = CONF.DISABLED;
    }

    // 追加当天状态
    if (tmpDateNum === todayStartNum) {
      switch (status) {
        case CONF.ACTIVE:
          status = CONF.ACTIVE_TODAY;
          break;
        case CONF.REGION:
          status = CONF.REGION_TODAY;
          break;
        default:
          status = CONF.TODAY;
      }
      if (disabledFlag) {
        status += "Disabled";
      }
    }

    dayData.push({
      month: month,
      year: year,
      val: dayVal,
      status,
      disabled: disabledFlag
    });
  }

  // 补齐本月之前的数据
  let prevOffset = startDayWeek % 7;

  if (prevOffset) {
    let prevMonth = month - 1;
    let isFirstMonth = prevMonth <= 0;

    prevMonth = isFirstMonth ? 12 : prevMonth;

    let prevYear = isFirstMonth ? year - 1 : year;
    let prevMonthDayNum = tools.getMonthDaysNum(prevMonth, prevYear);
    let prevDayBorder = prevMonthDayNum - prevOffset;

    for (; prevMonthDayNum > prevDayBorder; prevMonthDayNum--) {
      let status = CONF.PREV;
      let tmpDate = new Date([prevYear, prevMonth, prevMonthDayNum].join("/"));
      let tmpDateNum = parseInt(tools.dateFormat("Ymd", tmpDate), 10);
      checkedParam = cloneClockToDate(tmpDate, cache);
      currentPos = "normal";

      // 选中状态
      if (!absoluteNoChoosed) {
        if (tmpDateNum === startDate) {
          currentPos = "start";
        }
        if (tmpDateNum === endDate) {
          currentPos = currentPos === "start" ? "startEnd" : "end";
        }
        // if(tmpDateNum == startDate || tmpDateNum == endDate)
        //  status = CONF.ACTIVE;
        // else   status = CONF.REGION;
      }

      // 追加当天状态
      if (tmpDateNum === todayStartNum) {
        status = CONF.TODAY;
      }

      disabledFlag = disabledCheck(checkedParam, currentPos);
      if (disabledFlag) {
        status = CONF.DISABLED;
      }

      dayData.unshift({
        month: prevMonth,
        year: prevYear,
        val: prevMonthDayNum,
        status,
        disabled: disabledFlag
      });
    }
  }

  // 补齐本月之后的数据
  // 将日历数据补全6行；

  let nextOffset = (7 - ((lastDayWeek + 1) % 7)) % 7;

  if (dayNum + prevOffset <= 28 && enablefix) {
    nextOffset = nextOffset + 7 * 2;
  } else if (
    dayNum + prevOffset > 28 &&
    dayNum + prevOffset <= 35 &&
    enablefix
  ) {
    nextOffset = nextOffset + 7;
  }

  if (nextOffset) {
    let nextMonth = month + 1;
    let isLastMonth = nextMonth > 12;

    nextMonth = isLastMonth ? 1 : nextMonth;
    let nextYear = isLastMonth ? year + 1 : year;

    let nextDayBorder = nextOffset;

    for (let i = 1; i <= nextDayBorder; i++) {
      let status = CONF.NEXT;
      let tmpDate = new Date([nextYear, nextMonth, i].join("/"));
      let tmpDateNum = parseInt(tools.dateFormat("Ymd", tmpDate), 10);
      checkedParam = cloneClockToDate(tmpDate, cache);
      currentPos = "normal";

      // 选中状态
      if (
        !absoluteNoChoosed &&
        tmpDateNum >= startDate &&
        tmpDateNum <= endDate
      ) {
        // if(tmpDateNum == startDate || tmpDateNum == endDate)
        //     status = CONF.ACTIVE;
        // else status = CONF.REGION;
        if (tmpDateNum === startDate) {
          currentPos = "start";
        }
        if (tmpDateNum === endDate) {
          currentPos = currentPos === "start" ? "startEnd" : "end";
        }
      }

      // 追加当天状态
      if (tmpDateNum === todayStartNum) {
        status = CONF.TODAY;
      }

      disabledFlag = disabledCheck(checkedParam, currentPos);
      if (disabledFlag) {
        status = CONF.DISABLED;
      }

      dayData.push({
        month: nextMonth,
        year: nextYear,
        val: i,
        status,
        disabled: disabledFlag
      });
    }
  }
  // 增加农历、节假日信息
  if (lunar) {
    dayData = addLunarInfo(dayData);
  }
  return dayData;
};

export default {
  name: "Calendar",
  components: {
    Year,
    Month,
    Week,
    Clock,
    Swipe,
    Icon,
    Tap,
    'el-mask': Mask,
    'common-handle': CommonHandle,
  },
  props: {
    // 多语言，'zh' 或 'en'
    lang: {
      type: String,
      default: "zh"
    },
    locale: {
      type: Object,
      default: function(){ return conf.locale }
    },
    // 返回数据的格式，默认'Y/m/d'
    format: {
      type: String,
      default: "Y/m/d"
    },
    // 是否使用长文本，默认否
    isLong: {
      type: Boolean,
      default: false
    },
    // 范围模式
    enableRange: {
      type: Boolean,
      default: false
    },
    // 启用时钟
    enableClock: {
      type: Boolean,
      default: false
    },
    enablefix: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    // 禁用的范围，false为不禁用，true为全部禁用
    // 数组时为多点禁用
    // 如：[new Date('2015/11/11'), [new Date('2015/11/01'), new Date('2015/11/04')]]表示禁用 2015/11/11 和 2015/11/01 - 2015/11/04
    disabled: {
      type: [Function, Boolean, Object],
      default: false
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
    // 是否需要显示农历、节假日信息
    lunar: {
      type: Boolean,
      default: false
    },
    // 是否点击后直接回调
    delayChange: {
      type: Boolean,
      default: true
    },
    // 展示的日期
    displayDate: {
      type: Object
    },
    // 选中的日期，范围模式下表示起始日期
    value: {
      type: Object
    },
    enablefix: {
      type: Boolean
    },
    // 配置按钮类型，其值取自Icon组件中的type列表
    btns: {
      type: String
    },
    // 选择改变时的回调，非范围模式下一般无用
    onChange: {
      type: Function,
      default: function() {}
    },
    onClose: {
      type: Function,
      default: function() {}
    },
    onInit: {
      type: Function,
      default: function() {}
    },
    onUpdate: {
      type: Function,
      default: function() {}
    },
    // 选中时的回调
    onSelected: {
      type: Function,
      default: function() {}
    }
  },
  data: function(){
   return {
      tools,
      displayDateNext: this.displayDate,
      date: null,
      MODE: {
        CALENDAR: "calendar",
        YEAR: "year",
        MONTH: "month",
        CLOCK: "clock"
      },
      status: "calendar",
      tmpStatus: "calendar",
      touchStatus: null,
      touchInfo: {},
      cache: {},
      injectStatus: false,
      validCache: false,
      // disabledCheck: null,
      startDate: null,
      handleChoosedMaskFun: function(spec) {
        this.handleChoosedMask(spec)
      },
      handleClockChangedFun: function(clockObj) {
        this.handleClockChanged(clockObj)
      },
      handleDisableClockFun: function(hour, minute) {
        this.handleDisableClock(hour, minute)
      },
      handleCancelMaskFun: function() {
        this.handleCancelMask()
      }
    }
  },
  created() {
    let injectStatus = this.getInjectStatus();
    this.validCache = this.injectStatus = injectStatus;
    let parsedClock = tools.parseDate(this.startDate);
    this.cache.hour = parsedClock.hour;
    this.cache.minute = parsedClock.minute;

    this.$nextTick(function() {
      this.triggerInjectEvt("init");
    });
  },
  watch: {

  },
  computed: {
    btnsNext: function() {
      return tools.smartyMerge(conf.headBtns, this.btns || {});
    },
    disabledNext: function() {
      return this.parseDisabledParam();
    },
    disabledCheckNext: function() {
      return tools.disabledCheckCreator(this.disabledNext);
    },
    maskSpec: function() {
      return {
        lang: this.lang,
        size: this.size,
        sizeLimit: this.sizeLimit,
        btns: this.btnsNext
      }
    },
    dayListData: function() {
      let {displayDateNext, enableRange, endDate, startDate, disabled, validCache, cache, enablefix, lunar} = this
      let dateVal = tools.parseDate(displayDateNext);
      let _endDate = enableRange ? (endDate || startDate) : startDate;

      let dayList = dayConverters(
            {
                month: dateVal.month,
                year: dateVal.year
            },
            {
                start: startDate,
                end: _endDate
            },
            disabled,
            validCache ? cache : tools.parseDate(),
            enablefix,
            lunar
        );
        dayList.forEach(item => {
          item.tapClick = this.handleChooseDay.bind(this, item)
        })
        return dayList
    }
  },
  methods: {
    parseDisabledParam: function (){
        if (['function', 'boolean'].indexOf(typeof this.disabled) > -1) {
            return this.disabled;
        }
        if (!tools.isArray(this.disabled)) {
            return false;
        }
        let validFlag = true;
        let pureDisabledParam = [];
        this.disabled.forEach((disabledUnit) => {
            if (tools.isArray(disabledUnit)) {
                let pureParamItem = [];
                for (let i = 0, unitL = disabledUnit.length; i < unitL; i++) {
                    let item = disabledUnit[i];
                    if (typeof item === 'string') {
                        let dataGroup = this.parseDateUnit(item, undefined);
                        if (!dataGroup.status) {
                            validFlag = false;
                            pureParamItem = [];
                            break;
                        }
                        else {
                            pureParamItem.push(dataGroup.date);
                        }
                    }
                    else if (tools.isDateObj(item)) {
                        pureParamItem.push(item);
                    }
                    else {
                        pureParamItem.push(undefined);
                    }
                }
                if (pureParamItem.length) {
                    pureDisabledParam.push(pureParamItem);
                }
            }
            else if (typeof disabledUnit === 'string') {
                let dataGroup = this.parseDateUnit(disabledUnit, undefined);
                if (dataGroup.status) {
                    pureDisabledParam.push(dataGroup.date);
                }
                else {
                    validFlag = false;
                }
            }
            else if (tools.isDateObj(disabledUnit)) {
                pureDisabledParam.push(disabledUnit);
            }
            else {
                validFlag = false;
            }
        });
        return validFlag && pureDisabledParam;
    },
    getInjectStatus: function() {
      let injectStatus = false;
      let { enableRange, value, startDate, endDate, displayDateNext } = this;
      if (enableRange) {
        if (value) {
          if (value.startDate && value.endDate) {
            let resolvedStartDate = this.parseDateUnit(
              value.startDate,
              startDate
            );
            let resolvedEndDate = this.parseDateUnit(value.endDate, endDate);
            this.startDate = resolvedStartDate.date;
            this.endDate = resolvedEndDate.date;
            if (this.startDate > this.endDate) {
              this.endDate = this.startDate;
              this.startDate = resolvedEndDate.date;
            }
            injectStatus = resolvedStartDate.status && resolvedEndDate.status;
          } else if (value.startDate) {
            let resolvedStartDate = this.parseDateUnit(
              value.startDate,
              startDate
            );
            this.startDate = resolvedStartDate.date;
            this.endDate = null;
            injectStatus = resolvedStartDate.status;
          }
        } else if (value === false) {
          this.startDate = null;
          this.endDate = null;
        }
      } else {
        if (value === false) {
          this.startDate = null;
        } else {
          let resolvedStartDate = this.parseDateUnit(value, startDate);
          this.startDate = resolvedStartDate.date;
          injectStatus = resolvedStartDate.status;
        }
      }
      if (!tools.isDateObj(displayDateNext)) {
        this.displayDateNext = tools.cloneDate(this.startDate) || new Date();
      }
      return injectStatus;
    },
    triggerInjectEvt: function(ref = "init") {
      if (this.injectStatus) {
        let dateGroup = this.getData();
        if (this.enableRange && (!dateGroup.date || !dateGroup.date.endDate)) {
          return;
        }
        let cbk = ref === "init" ? this.onInit : this.onUpdate;
        cbk && cbk(dateGroup.date, dateGroup.format);
      }
    },
    triggerChangeEvt: function(ref = 'date') {
        let dateGroup = this.getData();
        // 范围选择的情况下，在选择完毕之后才出发onChange事件
        if (this.enableRange && (!dateGroup.date || !dateGroup.date.endDate)) {
            return;
        }
        this.onChange(dateGroup.date, dateGroup.format, ref);
    },
    // 获取当前选中的时间/时间范围
    getData: function() {
      let formateResult;
      let dateResult = {};
      if (this.enableRange) {
        let startStr = this.startDate
          ? tools.dateFormat(this.format, this.startDate)
          : null;
        let endStr = this.endDate
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
          formateResult = "";
        }
      } else {
        if (!dateResult.startDate && !dateResult.endDate) {
          dateResult = null;
          formateResult = "";
        }
      }
      return {
        format: formateResult,
        date: dateResult
      };
    },
    parseDateUnit: function (date, defaultDate) {
        let resolvedDate = tools.resolveDate(date, this.format, defaultDate);
        return resolvedDate;
    },
    updateClock: function(date) {
        date = tools.cloneDate(date);
        date.setHours(this.cache.hour);
        date.setMinutes(this.cache.minute);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },
    // 选中某个日期
    handleChooseDay: function(dayData) {
        if(dayData.disabled) return

        let targetDate = new Date(dayData.year + '/' + dayData.month + '/' + dayData.val);
        // 设置clock
        targetDate.setHours(this.cache.hour || 0);
        targetDate.setMinutes(this.cache.minute || 0);

        let {enableRange, startDate, endDate} = this

        if (enableRange) {
            // 上一次完整设置后，当次先清除旧设置
            if (startDate && endDate) {
                this.startDate = this.endDate = null;
            }
            this[this.startDate ? 'endDate' : 'startDate'] = targetDate;

            // 判断起始日期是否正常
            if (this.startDate && this.endDate) {
                let startDate = this.startDate;
                let startStamp = +startDate;
                let endStamp = +this.endDate;

                if (endStamp < startStamp) {
                    this.startDate = this.endDate;
                    this.endDate = startDate;
                }
            }
        }
        else {
            this.startDate = targetDate;
        }
        this.displayDateNext = new Date(targetDate.toGMTString());
        if (!this.delayChange) {
          if (this.onSelected) {
              let choosedDateStr = tools.dateFormat(this.format, targetDate);
              this.onSelected(
                  tools.cloneDate(targetDate),
                  choosedDateStr
              );
          }
          this.$nextTick(function() {
            this.triggerChangeEvt();
          });
        }
    },

    prevChange: function() {
        this.displayDateNext = absoluteCalc("+1month", this.displayDateNext);
    },
    nextChange: function() {
        this.displayDateNext = absoluteCalc("-1month", this.displayDateNext);
    },
    // date的翻页操作
    handleDateCalc: function(offset, type) {
        this.displayDateNext = absoluteCalc(offset + type, this.displayDateNext);
    },

    // 年份选择器
    handleShowYearSelector: function() {
        this.tmpStatus = this.tmpStatus === this.MODE.CALENDAR ? this.MODE.YEAR : this.MODE.CALENDAR;
    },

    // 月份选择器
    handleShowMonthSelector: function() {
        this.tmpStatus = this.tmpStatus === this.MODE.CALENDAR ? this.MODE.MONTH : this.MODE.CALENDAR;
    },

    handleChoosedMask: function(spec) {
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

    handleCancelMask: function() {
        this.tmpStatus = this.MODE.CALENDAR;
    },

    handleDisableClock: function (hour, minute) {
        let {startDate, endDate, enableRange} = this;
        if (startDate) {
            startDate = cloneClockToDate(startDate, {hour, minute, second: 0, milliseconds: 0});
        }
        if (endDate) {
            endDate = cloneClockToDate(endDate, {hour, minute, second: 0, milliseconds: 0});
        }
        if (enableRange) {
            let startFlag = startDate ? this.disabledCheckNext(startDate) : false;
            let endFlag = endDate ? this.disabledCheckNext(endDate) : false;
            return startFlag || endFlag;
        }
        return startDate ? this.disabledCheckNext(startDate) : false;
    },

    // 时间的更改
    handleClockChanged: function(clockObj) {
        this.cache.hour = clockObj.hour;
        this.cache.minute = clockObj.minute;
        let { startDate, endDate} = this
        if (this.enableRange) {
            if (startDate && endDate) {
                this.validCache = true;
                this.startDate = this.updateClock(startDate);
                this.endDate = this.updateClock(endDate);
                this.$nextTick(function(){
                  this.triggerChangeEvt('clock');
                })
            }
        } else if (startDate) {
            this.validCache = true;
            this.startDate = this.updateClock(startDate);
            this.$nextTick(function(){
              this.triggerChangeEvt('clock');
            })
        }
    },

    onCancel: function() {
        this.onClose();
    },

    onSure: function() {
        if (this.onSelected) {
            let choosedDateStr = tools.dateFormat(this.format, this.startDate);
            this.onSelected(
                tools.cloneDate(this.startDate),
                choosedDateStr
            );
        }
        this.triggerChangeEvt();
    }
  }
};
</script>

