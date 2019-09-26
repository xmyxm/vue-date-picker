<template>
  <div class="calendar-box">
    <div class="headerbox">
      <header class="pageheader">
        <div class="back"></div>
        <div class="title"></div>
        <div class="next"></div>
      </header>
    </div>
    <div @click="onOff" class="datetext">{{dateText}}<i :class="isOpen ? 'open top' : 'open'"></i> </div>
    <date-picker :open="true" :on-sus="onSus"></date-picker>
  </div>
</template>

<script>
import DatePicker from '../datepicker/index';

export default {
  name: 'calendar',
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      title: '日历组件',
      dateText: this.getDate(),
      isOpen: false
    };
  },
  methods: {
      getDate() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDay();
            return `${year}-${month}-${day}`
      },
      onOff() {
          this.isOpen = !this.isOpen
      },
      onSus(data, msg) {
        debugger
        console.log(msg, data)
      }
  }
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
