/**
 * 简单的时间计算
 */
import tools from './tools';

// 辅助时间结算的正则
const calcReg = /^(\+|-)(\d+)([a-zA-Z]+)$/;

// 单位 s，辅助时间计算
const stepKeyword = {
  year: 'year',
  month: 'month',
  week: 7 * 24 * 3600,
  day: 1 * 24 * 3600,
  hours: 3600,
  minutes: 60,
  seconds: 1,
};

const calc = (offset, time) => {
  const offsetStr = offset || '';
  let date = tools.cloneDate(time) || (new Date());
  date.setMilliseconds(0);

  const matchArr = offsetStr.match(calcReg);
  if (!matchArr) {
    return date;
  }

  const offsetNum = parseFloat(matchArr[2]);
  const offsetSym = matchArr[1] === '+' ? 1 : -1;
  const offsetStep = stepKeyword[matchArr[3].toLowerCase()];

  if (!offsetStep) {
    return date;
  }
  let result = date;

  // 对月份和年份做特殊处理，其它做统一处理
  if (typeof offsetStep === 'string') {
    let tmpY;
    let tmpM;
    switch (offsetStep) {
      case 'year':
        tmpY = date.getFullYear();
        tmpY += (offsetSym * offsetNum);
        date.setFullYear(tmpY);
        break;

      case 'month':
        tmpM = date.getMonth();
        date.setMonth(tmpM + offsetSym * offsetNum);
        break;
      default:
        result = false;
    }
  } else {
    // 得到毫秒数
    date = +date;
    date += (offsetSym * offsetNum * offsetStep * 1000);
    result = new Date(date);
  }
  if (result) {
    result.setMilliseconds(0);
  }
  return result;
};

export default calc;

