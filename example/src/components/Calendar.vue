<template>
  <div class="calendar-box">
    <div class="headerbox">
      <header class="pageheader">
        <div class="back"></div>
        <div class="title"></div>
        <div class="next"></div>
      </header>
    </div>
    <div @click="onOff" ref="timebox" class="datetext">{{dateText}}<i :class="timeData.open ? 'open top' : 'open'"></i> </div>
    <date-picker v-bind="timeData"></date-picker>
  </div>
</template>

<script>
import DatePicker from '../datepicker/index';
// import DatePicker from "@dp/date-picker"

export default {
  name: 'calendar',
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      title: '日历组件',
      dateText: this.getDate(),
      timeData: {
        showKeyList: ['day', 'week', 'month', 'quarter', 'year', 'festival', 'optional'], //
        open: false,
        top: 0,
        year: 2019,
        quarter: 3,
        month: 9,
        week: 32,
        endDate: new Date(),
        title: '国庆',
        dateRange: { startDate: new Date('2019-10-1'), endDate: new Date('2019-10-5') },
        value: this.getYearMonthDay(),
        onSus: this.onSusFun,
      },
    };
  },
  methods: {
    getDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate() - 1;
      return `${year}-${month}-${day}`;
    },
    getYearMonthDay() {
      return new Date(this.getDate());
    },
    onOff() {
      this.timeData.open = !this.timeData.open;
      if (this.timeData.open) {
        const timebox = this.$refs.timebox;
        const timeboxPosition = timebox.getBoundingClientRect();
        const height = timeboxPosition.y + timeboxPosition.height;
        this.timeData.top = height;
      }
    },
    onSusFun(data) {
      this.timeData.open = false;
      this.dateText = data.fetchDate;
      if (data.year) {
        this.timeData.year = data.year;
      }
      switch (data.key) {
        case 'day':
          this.timeData.value = data.value;
          break;
        case 'week':
          this.timeData.week = data.week;
          break;
        case 'month':
          this.timeData.month = data.month;
          break;
        case 'quarter':
          this.timeData.quarter = data.quarter;
          break;
        case 'festival':
          this.timeData.title = data.navName;
          break;
        case 'optional':
          this.timeData.dateRange = { startDate: data.startDate, endDate: data.endDate };
          break;
      }
      console.log(data.key, data);
    },
  },
};
</script>

<style>
.pageheader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.back,
.next,
.next-page {
  height: 34px;
  width: 34px;
  cursor: pointer;
}

.back {
  background: url("../style/img/back.png") left center no-repeat;
  background-size: 24px 24px;
}

.next-page {
  background: url("../style/img/go.png") right center no-repeat;
  background-size: 24px 24px;
}

.title {
  flex: 1;
  text-align: center;
}

.headerbox {
  height: 44px;
}

.calendar-box .mask {
  top: 44px;
}

.open {
  display: inline-block;
  width: 0;
  height: 0;
  border: none;
  border-top: 4px solid #117AF4;
  border-left: 2px solid #fff;
  border-right: 2px solid #fff;
  vertical-align: middle;
  margin-left: 3px;
  transform-origin:center center;
  transition: transform 0.5s ease;
}

.open.top{
  transform: rotate(180deg);
}

</style>
