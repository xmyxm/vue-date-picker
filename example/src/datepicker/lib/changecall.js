
import tools from './tools';

const holidayQuery = [
  { name: '元旦', query: 'NewYearsDay' },
  { name: '春节', query: 'SpringFestival' },
  { name: '清明节', query: 'ChingMingFestival' },
  { name: '劳动节', query: 'MayDay' },
  { name: '端午节', query: 'DragonBoatFestival' },
  { name: '中秋节', query: 'MoonFestival' },
  { name: '国庆节', query: 'NationalHoliday' },
];

const handleDateChange = (value) => {
  const item = {
    value,
    year: value.getFullYear(),
    name: '按日',
    key: 'day',
    day: value.getDate(),
    navName: tools.dateFormat('m-d', value),
    fetchDate: tools.dateFormat('Y-m-d', value),
  };
  return item;
};

const handleWeekChange = (value) => {
  const year = new Date(value.sunday).getFullYear();
  const monday = tools.dateFormat('Y-m-d', new Date(value.monday));
  const sunday = tools.dateFormat('Y-m-d', new Date(value.sunday));
  const item = {
    value,
    year,
    week: value.week,
    name: '按周',
    key: 'week',
    navName: `W${value.week}`,
    fetchDate: `${monday}~${sunday}`,
  };
  return item;
};

const handleMonthChange = (month, year) => {
  const newMonth = month < 10 ? `0${month}` : month;
  const time = new Date();
  time.setFullYear(year);
  time.setMonth(month);
  const item = {
    value: time,
    year,
    month,
    name: '按月',
    key: 'month',
    navName: `${year}-${newMonth}`,
    fetchDate: `${year}-${newMonth}`,
  };
  return item;
};

const handleRangeChange = (dateGroup) => {
  // 选中单独一天无效
  if (dateGroup.startDate - dateGroup.endDate === 0) {
    return false;
  }
  const item = {
    year: dateGroup.endDate.getFullYear(),
    name: '自定义时间段',
    key: 'optional',
    navName: `${tools.dateFormat('m-d', dateGroup.startDate)}~${tools.dateFormat('m-d', dateGroup.endDate)}`,
    fetchDate: `${tools.dateFormat('Y-m-d', dateGroup.startDate)}~${tools.dateFormat('Y-m-d', dateGroup.endDate)}`,
    startDate: dateGroup.startDate,
    endDate: dateGroup.endDate,
  };
  return item;
};

const handleQuarterChange = (quarter, year) => {
  const item = {
    year,
    quarter,
    name: '按季',
    key: 'quarter',
    navName: `第${quarter}季度`,
    fetchDate: `${year}-${quarter}`,
  };
  return item;
};

const handleYearChange = (year) => {
  const item = {
    year,
    name: '按年',
    key: 'year',
    navName: `按年 ${year}年`,
    fetchDate: year,
  };
  return item;
};

const handleFestivalChange = (param, year) => {
  let data = [];
  data = holidayQuery.filter((item, i) => item.name.indexOf(param.name) !== -1);
  const item = {
    year,
    name: '按节日',
    key: 'festival',
    navName: `${param.name}`,
    fetchDate: `${year}-${data[0].query}`,
  };
  return item;
};

export default {
  handleDateChange,
  handleWeekChange,
  handleMonthChange,
  handleRangeChange,
  handleQuarterChange,
  handleYearChange,
  handleFestivalChange,
};

