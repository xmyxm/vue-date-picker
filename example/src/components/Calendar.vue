<template>
  <div class="calendar-box">
    <header class="header">
      <div class="back"></div>
      <div class="title"></div>
      <div class="next"></div>
    </header>
    <div class="headerbox"></div>
    <date-picker></date-picker>
  </div>
</template>

<script>
// import DatePicker from "../../../src/index.vue"
import DatePicker from '../datepicker/index';

export default {
  name: 'calendar',
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      title: '日历组件',
    };
  },
};
</script>

<style scoped>
.header {
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
</style>
