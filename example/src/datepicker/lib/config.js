
/**
 * 配置界面
 */

// 多语言包配置
const lanMap = {
  zh: {
    date: ['年', '月', '日'],
    weekShort: ['一', '二', '三', '四', '五', '六', '日'],
    week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    btns: ['去年', '上个月', '下个月', '明年', '今年', '本月'],
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
  en: {
    date: ['Year', 'Month', 'Day'],
    weekShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    btns: ['Last year', 'Last month', 'Next month', 'Next year', 'This year', 'This Month'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

const locale = {
  timezoneOffset: null,
  lang: lanMap,
};

// 顶部按钮配置
const headBtns = {
  BTN_MINUS_YEAR: 'angleDoubleLeft',
  BTN_MINUS_MONTH: 'angleLeft',
  BTN_PLUS_MONTH: 'angleRight',
  BTN_PLUS_YEAR: 'angleDoubleRight',
  BTN_NORMAL_PREV: 'angleLeft',
  BTN_NORMAL_NEXT: 'angleRight',
  BTN_MINUS_CLOCK: 'angleDown',
  BTN_PLUS_CLOCK: 'angleUp',
};

export default {
  locale,
  headBtns,
};
