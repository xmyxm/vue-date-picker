<template>
  <div :class="'normal' + (sizeLimit ? '' : ' notLimitSize')">
    <div class="header">
      <div class="headerInner">
        <div class="btn">
          <div class="iconBtn" @click="handlePageRange('prev')">
            <Icon type="angleLeft" />
          </div>
        </div>
        <div class="centerBtn" @click="handleChooseRange">
          {{yearRange.start}}
          <span class="normalSplitLine">-</span>
          {{yearRange.end}}
        </div>
        <div class="rightBtn" data-type="next" @click="handlePageRange('next')">
          <div class="iconBtn">
            <Icon type="angleRight" />
          </div>
        </div>
      </div>
    </div>
    <div class="normalList">
      <div class="normalListInner">
        <div
          v-for="item in yearList"
          v-bind:key="item.index || item.start"
          :class="item.className"
          @click="item.touchendHandle(item)"
        >{{item.start}}</div>
      </div>
    </div>
    <div class="normalFooter">
      <div class="currentYearBtn" @click="handleCurrentYear">{{langMap.btns && langMap.btns[4]}}</div>
    </div>
    <common-handle v-if="delayChange" />
  </div>
</template>

<script>
/**
 * 年份选择器，可单独抽出使用，calendar中有集成
 */
import tools from './lib/tools';
import conf from './lib/config';
import Icon from './icon';
import CommonHandle from './commonhandle';

const BTNS = conf.headBtns;
// 一小组年数
const LIST_YEARS = 12;
// 小组年数分组步进
const LIST_RANGE_STEP = 10;
// 大组年数分组步进
const GROUP_RANGE_STEP = 80;

// 12年一组
const parseYearRange = (year = tools.getYear()) => {
  year = parseInt(year, 10);
  const startY = tools.beautifyNum(year, LIST_RANGE_STEP);
  const endY = startY + LIST_YEARS;

  return { start: startY, end: endY - 1 };
};

// 60年一组跨度
const parseMoreRange = (year = tools.getYear()) => {
  year = parseInt(year, 10);
  const startY = tools.beautifyNum(year, GROUP_RANGE_STEP);
  const endY = startY + GROUP_RANGE_STEP;
  const rangeGroup = [];
  for (let i = startY; i < endY; i += LIST_RANGE_STEP) {
    rangeGroup.push({
      start: i,
      end: i + LIST_YEARS - 1,
    });
  }
  return { group: rangeGroup, range: { start: startY, end: endY + 1 } };
};

export default {
  name: 'Year',
  components: {
    Icon,
    'common-handle': CommonHandle,
  },
  props: {
    year: {
      type: Number,
      default: tools.getYear(),
    },
    lang: {
      type: String,
      default: 'zh',
    },
    size: {
      type: String,
      default: 'normal',
    },
    delayChange: {
      type: Boolean,
      default: true,
    },
    sizeLimit: {
      type: Boolean,
      default: true,
    },
    onChange: {
      type: Function,
      default() {},
    },
    btns: {
      type: Object,
    },
    onClose: {
      type: Function,
      default() {},
    },
    disabled: {
      type: [Function, Boolean],
      default: false,
    },
  },
  data() {
    return {
      locale: conf.locale,
      yearRange: null,
      moreYearGroup: null,
      moreYearRange: null,
      // 固定值，当前年份
      currentYear: tools.getYear(),
      // 选择年份
      selectYear: this.year,
      status: 'year',
    };
  },
  computed: {
    langMap() {
      return this.locale.lang[this.lang || 'zh'] || {};
    },
    btnsData() {
      const _btns = tools.smartyMerge(BTNS, this.btns || {});
      return _btns;
    },
    yearList() {
      if (this.status === 'year') {
        return this.renderYearList(this.yearRange);
      }
      const yearStart =
          this.selectYear &&
          tools.beautifyNum(this.selectYear, LIST_RANGE_STEP);
      return this.renderYearRange(this.moreYearGroup, yearStart);
    },
  },
  created() {
    this.selectYear = this.year;
    this.yearRange = parseYearRange(this.selectYear || this.currentYear);
  },
  watch: {
    year(newYear) {
      this.selectYear = newYear;
      this.yearRange = parseYearRange(this.selectYear || this.currentYear);
    },
  },
  methods: {
    // 选中当前年
    handleCurrentYear() {
      this.selectYear = tools.getYear();
      this.status = 'year';
      this.yearRange = parseYearRange(this.selectYear);
    },

    // 选中
    handleChooseYear(data) {
      if (data.disabled) return;
      const year = data.start;
      if (this.selectYear !== year) {
        this.selectYear = year;
      }
    },

    // 翻页
    handlePageRange(act) {
      // 年列表翻页
      if (this.status === 'year') {
        const rangeParam =
          this.yearRange.start +
          (act === 'next' ? LIST_RANGE_STEP : -LIST_RANGE_STEP);
        this.yearRange = parseYearRange(rangeParam);
      }
      // 年范围翻页
      else {
        const rangeParam =
          this.moreYearRange.start +
          (act === 'next' ? GROUP_RANGE_STEP : -GROUP_RANGE_STEP);
        const parsedMoreRange = parseMoreRange(rangeParam);
        this.moreYearRange = parsedMoreRange.range;
        this.moreYearGroup = parsedMoreRange.group;
      }
    },

    // 范围选择
    handleChooseRange() {
      if (this.status === 'year') {
        const parsedMoreRange = parseMoreRange(this.yearRange.start);
        this.status = 'range';
        this.moreYearRange = parsedMoreRange.range;
        this.moreYearGroup = parsedMoreRange.group;
      } else {
        this.status = 'year';
      }
    },

    onCancel() {
      this.onClose();
    },
    onSure() {
      this.onChange(this.selectYear);
    },
    // 选中大的年范围
    handleChoosedLargeRange(rangeStartYear) {
      this.status = 'year';
      this.yearRange = parseYearRange(rangeStartYear);
    },

    // 年份列表
    renderYearList(range) {
      let { start, end } = range;
      const list = [];
      const disabledCheck = tools.disabledCheckCreator(this.disabled);
      for (; start <= end; start++) {
        let className = 'normalCell';
        const disabled = disabledCheck(start);
        if (this.selectYear === start) {
          className = 'normalActiveCell';
        }
        if (disabled) {
          className = 'normalDisabledCell';
        }
        const data = {
          start,
          className,
          disabled,
        };
        data.touchendHandle = this.handleChooseYear.bind(this, data);
        list.push(data);
      }
      return list;
    },

    // 年份范围
    renderYearRange(rangeGroup, currentRangeStart) {
      const list = rangeGroup.map((range, index) => {
        const data = {
          index,
          start: `${range.start} - ${range.end}`,
          className: range.start === currentRangeStart ? 'twoRowActiveCell' : 'twoRowCell',
        };
        data.touchendHandle = this.handleChoosedLargeRange.bind(this, range.start);
        return data;
      });
      return list;
    },
  },
};
</script>
