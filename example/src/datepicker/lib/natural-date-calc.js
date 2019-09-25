/**
 * 自然时间计算，会忽略具体细节，如：
 *     20170314  -1month 的结果将会是 20170201
 */
import tools from './tools';

const reg = /^(\+|-)(\d+)([a-zA-Z]+)$/;

// 单位 s
const enableMap = {
  year: true,
  quarter: true,
  month: true,
  week: true,
  day: true,
  hours: true,
  minutes: true,
};

/**
 * @param  {String}  offsetStr 运算表达式
 * @param  {Date Inst}  date      待运算日期
 * @param  {Int/String} offsetDays    偏移天数，对运算后结果进行再次偏移；
 *                                    当其值为关键词"end"时，将偏移到运算粒度的最后那天(所以天及以下将不参与运算)
 * @return {[type]}            [description]
 */
const natureCalc = (offsetStr, date, offsetDays = 0) => {
  date = tools.cloneDate(date);
  offsetStr = offsetStr || '';
  date = (date && date instanceof Date) ? date : (new Date());

  const matchArr = offsetStr.match(reg);
  if (!matchArr) {
    return date;
  }

  const offsetNum = parseFloat(matchArr[2]);
  const offsetSym = matchArr[1] === '+' ? 1 : -1;
  const offsetStep = matchArr[3].toLowerCase();

  if (!enableMap[offsetStep]) {
    return date;
  }

  const isEndOffset = offsetDays === 'end';
  switch (offsetStep) {
    case 'year':
      date = tools.resetToFirst(date, 'month');
      let tmpY = date.getFullYear();
      tmpY += (offsetSym * offsetNum);
      date.setFullYear(tmpY);
      if (isEndOffset) {
        date.setMonth(11);
        date.setDate(31);
      }
      break;

      // 季度
    case 'quarter':
      // 重置日以下
      date = tools.resetToFirst(date, 'day');
      // 计算偏移月份
      const tmpQuarterM = (Math.ceil((date.getMonth() + 1) / 3) - 1) * 3;
      let targetQuarterM = tmpQuarterM + (offsetSym * offsetNum * 3);
      date.setMonth(targetQuarterM);
      if (isEndOffset) {
        targetQuarterM = date.getMonth() + 2;
        date.setMonth(targetQuarterM);
        targetQuarterM = Math.abs((12 + targetQuarterM) % 12);
        date.setDate(
          tools.getMonthDaysNum(targetQuarterM + 1, date.getFullYear()),
        );
      }
      break;

    case 'month':
      date = tools.resetToFirst(date, 'day');
      const tmpM = date.getMonth();
      let targetM = tmpM + offsetSym * offsetNum;
      date.setMonth(targetM);
      if (isEndOffset) {
        targetM = Math.abs((12 + targetM) % 12);
        date.setDate(
          tools.getMonthDaysNum(targetM + 1, date.getFullYear()),
        );
      }
      break;

    case 'week':
      // 重置为本周一
      date = tools.resetToFirst(date, 'week');
      // 按天做偏移
      date.setDate(
        date.getDate() + (offsetSym * offsetNum * 7) + (isEndOffset ? 6 : 0),
      );
      break;

    case 'day':
      date = tools.resetToFirst(date, 'hours');
      date.setDate(
        date.getDate() + (offsetSym * offsetNum),
      );
      break;

    case 'hours':
      date = tools.resetToFirst(date, 'minutes');
      date.setHours(
        date.getHours() + (offsetSym * offsetNum),
      );
      break;

    case 'minutes':
      date = tools.resetToFirst(date, 'seconds');
      date.setMinutes(
        date.getMinutes() + (offsetSym * offsetNum),
      );
      break;
    default:
            // do nothing;
  }
  // 结果偏移
  if (!isEndOffset && offsetDays) {
    date.setDate(
      date.getDate() + offsetDays,
    );
  }

  return date;
};

export default natureCalc;
