<template>
    <div class="normal monthWrap">
    <!-- 头部年份选择 -->
        <div class="header">
            <div class="headerInner">
                <div class="btn" @click="prevChange">
                    <div class="iconBtn">
                        <Icon type="angleLeft" />
                    </div>
                </div>
                <div class="centerBtn">{{showYear}}</div>
                <div class="rightBtn" @click="nextChange">
                    <div class="iconBtn">
                        <Icon type="angleRight" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 月份列表 -->
        <div class-name="normalList" >
            <div class="normalListInner">
                <Tap v-for="item in monthList" :key="item.month" :init-data="item">
                    {{item.content}}
                </Tap>
            </div>
        </div>

        <common-handle v-if="delayChange" />
    </div>
</template>

<script>
import Icon from './icon';
import tools from './lib/tools';
import conf from './lib/config';
// import Swipe from './swipe';
import Tap from './tap';
import CommonHandle from './commonhandle';

export default {
  name: 'Month',
  components: {
    'common-handle': CommonHandle,
    // Swipe,
    Icon,
    Tap,
  },
  props: {
    locale: {
      type: Object,
      default() { return conf.locale; },
    },
    lang: {
      type: String,
      default: 'zh',
    },
    disabled: {
      type: [Function, Boolean],
      default: false,
    },
    delayChange: {
      type: Boolean,
      default: true,
    },
    year: {
      type: Number,
      default: tools.getDateYearNum(),
    },
    month: {
      type: Number,
      default: tools.getDateMonthNum(),
    },
    onChange: {
      type: Function,
      default() {},
    },
    onClose: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      showYear: this.year,
      selectYear: this.year,
      selectMonth: this.month,
      touchStatus: null,
      touchInfo: {},
    };
  },
  computed: {
    monthList() {
      const langMap = (this.locale.lang[this.lang || 'zh'] || {}).month;
      const list = [];
      const disabledCheck = tools.disabledCheckCreator(this.disabled);
      for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const disabled = disabledCheck(new Date(`${this.showYear}-${month > 9 ? month : `0${month}`}`));
        let className = 'normalCell';
        if (month === this.selectMonth && this.selectYear === this.showYear) {
          className = 'normalActiveCell';
        } else if (disabled) {
          className = 'normalDisabledCell';
        }
        const data = {
          month,
          disabled,
          tapClassName: className,
          content: langMap[i],
        };
        data.tapClick = this.handleChooseMonth.bind(this, data);
        list.push(data);
      }
      return list;
    },
  },
  watch: {
    year(newYear) {
      this.selectYear = newYear;
    },
    month(newMonth) {
      this.selectMonth = newMonth;
    },
  },
  methods: {
    // 选中
    handleChooseMonth(data, e) {
      if (data.disabled) return;
      const month = parseInt(e.target.getAttribute('data-month'), 10);
      if (this.selectMonth !== month || this.selectYear !== this.showYear) {
        this.selectMonth = month;
        this.selectYear = this.showYear;
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
      this.onChange(this.selectMonth, this.selectYear);
    },
  },
};
</script>
