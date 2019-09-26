import tools from './tools';
import naturalCalc from './natural-date-calc';

export const lastWeek = () => {
  const date = naturalCalc('-1week', new Date());
  let year = date.getFullYear();
  // 计算当前周数 和 当年的总周数是否相等，相等需要判断该天是否为周日，若不是则是新年的第一周
  let week = tools.getDateWeekNum(date);
  const currentYearTotalWeek = tools.getYearWeekNums(year);
  if (week === currentYearTotalWeek) {
    const weekNumber = tools.getWeek(date);
    if (weekNumber !== 7) {
      week = 1;
      year += 1;
    }
  }
  return { year, week };
};
export const lastYearMonth = (date = new Date(), offset) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = naturalCalc(`-${offset}month`, date).getFullYear();
  const month = naturalCalc(`-${offset}month`, date).getMonth();
  return { year, month };
};

export const lastDate = () => {
  const date = naturalCalc('-1day', new Date());
  return date;
};

export const lastDateRange = () => {
  // 默认显示本周一到昨天
  let startDate = tools.resetToFirst(new Date(), 'week'); // 重置周一
  startDate = tools.dateFormat('Y/m/d', startDate);
  let endDate = naturalCalc('-1day', new Date());
  endDate = tools.dateFormat('Y/m/d', endDate);
  return { startDate, endDate };
};

export const lastQuarter = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = month > 8 ? 4 : month > 5 ? 3 : month > 2 ? 2 : 1;
  return { year, quarter };
};
