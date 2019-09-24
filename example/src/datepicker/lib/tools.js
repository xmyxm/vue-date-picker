
// 月天数map
const monthDayNumMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 辅助获取可量化的星期
const weekMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

// 闰年判断
const isLeapYear = function isLeapYear(numberYear) {
  return !(numberYear % 4) && numberYear % 100 || !(numberYear % 400);
};

// 获取周几，绘制日历时，建议只获取每月第一天，之后的做+1判断
const getWeek = function getWeek(day, month, year) {
  let date = void 0;
  if (day instanceof Date) {
    date = day;
  } else {
    date = new Date();
    date.setFullYear(year, month - 1, day);
  }
  const DateStr = date.toDateString();
  return weekMap[DateStr.split(' ')[0]];
};

/**
 * 获取指定的Date实例是当年的多少周
 * @param  {Date} date 要处理的Date实例
 * @return {Number}      第几周
 */
const getDateWeekNum = function getDateWeekNum(date) {
  if (!date || !(date instanceof Date)) {
    date = new Date();
  }
  const year = date.getFullYear();
  const startDate = new Date(`${year}/01/01`);
  const splitDays = Math.ceil((date.getTime() - startDate.getTime()) / 86400000) + 1;
  const yearStartWeek = getWeek(startDate);
  const leftStartWeekDays = 8 - yearStartWeek;
  return Math.ceil((splitDays - leftStartWeekDays) / 7) + 1;
};

/**
 * 获取某年的周总数
 * @param  {Number} year 要判断的年数
 * @return {Number}      周总数
 */
const getYearWeekNums = function getYearWeekNums(year) {
  const date = year ? new Date(`${year}/12/31`) : new Date();
  return getDateWeekNum(date);
};

/**
 * 获取每个月的日期数
 * @param  {Number} month 月份
 * @param  {Number} year  年份
 * @return {Number}       天数
 */
const getMonthDaysNum = function getMonthDaysNum(month, year) {
  month = parseInt(month, 10);
  if (month !== 2) {
    return monthDayNumMap[month - 1];
  }
  return isLeapYear(year) ? 29 : 28;
};

const cloneDate = function cloneDate(date) {
  if (date instanceof Date) {
    return new Date(date.toGMTString());
  }
  return date;
};

const isDateObj = function isDateObj(date) {
  return date && date instanceof Date && !isNaN(date.getTime());
};

// 解析日期
const parseDate = function parseDate(dateObj) {
  dateObj = dateObj || new Date();

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes(),
    second: dateObj.getSeconds(),
    milliseconds: 0,
  };
};

const buildNoTimesDate = function buildNoTimesDate(date) {
  date = isDateObj(date) ? cloneDate(date) : new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const buildEndNoTimesDate = function buildEndNoTimesDate(date) {
  date = isDateObj(date) ? cloneDate(date) : new Date();
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

// 将日期重置到第一天，逆向操作，规避某些不存在的天数
const FROM_CUR_MAP = {
  month: ['setMilliseconds', 'setSeconds', 'setMinutes', 'setHours', 'setDate', 'setMonth'],
  day: ['setMilliseconds', 'setSeconds', 'setMinutes', 'setHours', 'setDate'],
  hours: ['setMilliseconds', 'setSeconds', 'setMinutes', 'setHours'],
  minutes: ['setMilliseconds', 'setSeconds', 'setMinutes'],
  seconds: ['setMilliseconds', 'setSeconds'],
  milliseconds: ['setMilliseconds'],
};
const CUR_RULES = {
  setMilliseconds: { val: 0 },
  setSeconds: { val: 0 },
  setHours: { val: 0 },
  setMinutes: { val: 0 },
  setDate: { val: 1 },
  setMonth: { val: 0 },
};
const resetToFirst = function resetToFirst(date) {
  const fromCur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'month';
  let extraVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  date = cloneDate(date);
  // 季度特殊处理
  if (fromCur === 'quarter') {
    extraVal = parseInt(extraVal, 10);
    if (extraVal >= 1 && extraVal <= 4) {
      // 先重置天及以下
      FROM_CUR_MAP.day.forEach((rule) => {
        date[rule](CUR_RULES[rule].val);
      });
      // 再调整月份
      date.setMonth(extraVal * 3);
    }
  } else if (fromCur === 'week') {
    // 先重置小时及以下
    FROM_CUR_MAP.hours.forEach((rule) => {
      date[rule](CUR_RULES[rule].val);
    });
    // 再调整日期
    const weekNum = getWeek(date);
    date.setDate(date.getDate() - weekNum + 1);
  } else if (FROM_CUR_MAP[fromCur]) {
    FROM_CUR_MAP[fromCur].forEach((rule) => {
      date[rule](CUR_RULES[rule].val);
    });
  }
  return date;
};

// 辅助时间格式化的正则
const dateFormateReg = /Y|y|m|n|d|j|g|G|h|H|i|s/g;

const dateFormatUnitRegMap = {
  // 4位完整年份数
  Y: '[0-9]{1,4}',
  // 2位年份数
  y: '[0-9]{1,2}',
  // 有前导零的月份，01-12
  m: '0[1-9]|1[0-2]',
  // 无前导零的月份，1-12
  n: '[1-9]|1[0-2]',
  // 有前导零的日期数，01-31
  d: '0[1-9]|[1-2][0-9]|3[0-1]',
  // 无前导零的日期数，1-31
  j: '[1-9]|[1-2][0-9]|3[0-1]',
  // 无前导零的12小时，1-12
  g: '[1-9]|1[0-2]',
  // 无前导零的24小时，0-23
  G: '[0-9]|1[0-9]|2[0-3]',
  // 有前导零的12小时，01-12
  h: '0[1-9]|1[0-2]',
  // 有前导零的24小时，00-23
  H: '0[0-9]|1[0-9]|2[0-3]',
  // 有前导零的分钟数，00-59
  i: '0[0-9]|[1-5][0-9]',
  // 有前导零的秒数，00-59
  s: '0[0-9]|[1-5][0-9]',
};

/**
 * 时间格式化
 */
const dateFormat = function dateFormat() {
  const formateStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Y-m-d H:i:s';
  const dateObj = arguments[1];

  const dObj = dateObj && dateObj.constructor === Date ? dateObj : new Date();

  let dStr = '';
  const year = dObj.getFullYear();
  const month = dObj.getMonth() + 1;
  const date = dObj.getDate();
  const hours = dObj.getHours();
  const minutes = dObj.getMinutes();
  const seconds = dObj.getSeconds();
  const yearStr = year.toString();
  const monthStr = month.toString();
  const dateStr = date.toString();
  const hoursStr = hours.toString();
  const minuStr = minutes.toString();
  const secStr = seconds.toString();
  let gHours = void 0;
  // 12 AM
  if (hours === 0) {
    gHours = 12;
  }
  // 12 PM
  else if (hours === 12) {
    gHours = 12;
  } else {
    gHours = hours % 12;
  }
  gHours = gHours.toString();

  const dateKeyMap = {
    Y: yearStr,
    y: yearStr.slice(yearStr.length - 2),
    m: monthStr.length < 2 ? `0${monthStr}` : monthStr,
    n: monthStr,
    d: dateStr.length < 2 ? `0${dateStr}` : dateStr,
    j: dateStr,
    g: gHours,
    G: hours,
    h: gHours.length < 2 ? `0${gHours}` : gHours,
    H: hoursStr.length < 2 ? `0${hoursStr}` : hoursStr,
    i: minuStr.length < 2 ? `0${minuStr}` : minuStr,
    s: secStr.length < 2 ? `0${secStr}` : secStr,
  };

  dStr = formateStr.replace(dateFormateReg, matchItem => (typeof dateKeyMap[matchItem] === 'undefined' ? matchItem : dateKeyMap[matchItem]));

  return dStr;
};

const setDateBySym = function setDateBySym(val, sym, date) {
  const currentYear = date.getFullYear();
  switch (sym) {
    case 'Y':
      date.setFullYear(val);
      break;

    case 'y':
      var targetYear = void 0;
      if (Math.abs(currentYear) >= 100) {
        targetYear = Math.ceil(currentYear / 100) * 100 + val;
      } else {
        targetYear = val;
      }
      date.setFullYear(targetYear);
      break;

    case 'm':
      date.setMonth(val - 1);
      break;

    case 'n':
      date.setMonth(val - 1);
      break;

    case 'd':
      date.setDate(val);
      break;

    case 'j':
      date.setDate(val);
      break;

    case 'g':
      date.setHours(val);
      break;

    case 'G':
      date.setHours(val);
      break;

    case 'h':
      date.setHours(val);
      break;

    case 'H':
      date.setHours(val);
      break;

    case 'i':
      date.setMinutes(val);
      break;

    case 's':
      date.setSeconds(val);
      break;
  }
  return date;
};

const formatStrToDate = function formatStrToDate(valStr, format, date) {
  date = cloneDate(date);
  if (!format) {
    return { status: false, date };
  }
  const itemMap = {};
  let offset = 1;
  let matchReg = format.replace(dateFormateReg, (matchItem) => {
    if (dateFormatUnitRegMap[matchItem]) {
      itemMap[matchItem] = offset++;
      return `(${dateFormatUnitRegMap[matchItem]})`;
    }
    return matchItem;
  });
  matchReg = new RegExp(matchReg);
  const matchResult = valStr.match(matchReg);
  if (!matchResult) {
    return { status: false, date };
  }
  date = date || buildNoTimesDate();
  // 先将date日期位以下清空，防止月份变更时，无对应日期的问题(如 31 号)
  date = resetToFirst(date, 'day');
  for (const i in itemMap) {
    if (itemMap.hasOwnProperty(i)) {
      let itemVal = matchResult[itemMap[i]];
      if (typeof itemVal === 'undefined') {
        continue;
      }
      itemVal = parseInt(itemVal, 10);
      setDateBySym(itemVal, i, date);
    }
  }
  date && date.setMilliseconds(0);

  return { status: true, date };
};

// 解析传入的参数值为具体的Date实例
const resolveDate = function resolveDate(dateObj, formatStr, defaultDate) {
  defaultDate = cloneDate(defaultDate);
  if (isDateObj(dateObj)) {
    return {
      status: true,
      date: cloneDate(dateObj),
    };
  } else if (typeof dateObj === 'string') {
    return formatStrToDate(dateObj, formatStr, defaultDate);
  }
  return {
    status: !!defaultDate,
    date: defaultDate,
  };
};

// 以源的key为依据，进行合并
const smartyMerge = function smartyMerge(rootObj, newObj) {
  const tempObj = {};
  newObj = newObj || {};

  for (const i in rootObj) {
    if (rootObj.hasOwnProperty(i)) {
      tempObj[i] = rootObj[i];

      if (i in newObj) {
        tempObj[i] = newObj[i];
      }
    }
  }
  return tempObj;
};

// 美化数字
const beautifyNum = function beautifyNum(num) {
  const step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  return Math.floor(num / step) * step;
};

// 判断是否为整数或整数字符
const INT_REG = /^-?(\d)+$/;
const POSITIVE_INT_REG = /^(\d)+$/;
const likeInt = function likeInt(val) {
  const mustPositive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  val = val.toString();
  return (mustPositive ? POSITIVE_INT_REG : INT_REG).test(val);
};

// 补充零操作
const subNum = function subNum(val) {
  const length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  val = val.toString();
  if (val.length < length) {
    let subZero = [];
    subZero.length = length - val.length + 1;
    subZero = subZero.join('0');
    val = subZero + val;
  }
  return val;
};

const isArray = function isArray(item) {
  return item instanceof Array;
};
// 禁用状态检测方法生成器
// 禁用的范围，false为不禁用，true为全部禁用
// 数组时为多点禁用
// 如：[new Date('2015/11/11'), [new Date('2015/11/01'), new Date('2015/11/04')]]表示禁用 2015/11/11 和 2015/11/01 - 2015/11/04
const disabledCheckCreator = function disabledCheckCreator() {
  const disabledMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (disabledMap === true) {
    return function () {
      return true;
    };
  } else if (typeof disabledMap === 'function') {
    return disabledMap;
  }
  return function () {
    return false;
  };
};

const getYear = function () {
  return (new Date()).getFullYear();
};

const tools = {
  getYear,
  isLeapYear,
  getMonthDaysNum,
  getWeek,
  getDateWeekNum,
  getYearWeekNums,
  cloneDate,
  isDateObj,
  parseDate,
  buildNoTimesDate,
  buildEndNoTimesDate,
  resetToFirst,
  dateFormat,
  formatStrToDate,
  resolveDate,
  smartyMerge,
  likeInt,
  subNum,
  beautifyNum,
  isArray,
  disabledCheckCreator,
};

export default tools;
