<template>
  <div class="normal weekWrap">
        <div class="header">
                <div class="headerInner">
                    <div class="btn" @touchend="prevChange">
                        <div class="iconBtn">
                            <Icon type="angleLeft" />
                        </div>
                    </div>
                    <div class="centerBtn">
                        <span class="dateSplitLine">{{selectYear}}</span>
                    </div>
                    <div class="rightBtn" @touchend="nextChange">
                        <div class="iconBtn">
                            <Icon type="angleRight" />
                        </div>
                    </div>
                </div>
            </div>

        <Swipe>
            <div class="weeknormalListInner" ref="list">
                <Tap v-for="item in weekList" :init-data="item" :key="item.index">
                    <div>
                        <span>W{{item.number}}</span>
                        <p class="weekdateRande">
                            {{item.content}}
                        </p>
                    </div>
                </Tap>
            </div>
        </Swipe>

        <common-handle v-if="delayChange"/> 
    </div>
</template>

<script>
import Icon from './icon';
import common from './lib/common';
import tools from './lib/tools';
import Swipe from './swipe';
import Tap from './tap';
import CommonHandle from './commonhandle';

export default {
  name: 'Week',
  components: {
    'common-handle': CommonHandle,
    Swipe,
    Icon,
    Tap
  },
  props: {
        year: {
            type: Number,
            default: tools.getYear()
        },
        week: {
            type: Number,
            default: tools.getDateWeekNum(new Date())
        },
        disabled: {
            type: [Function, Boolean],
            default: false
        },
        delayChange: {
            type: Boolean,
            default: true
        },
        onChange: {
            type: Function,
            default: function(){}
        },
        onClose: {
            type: Function,
            default: function(){}
        }
  },
  data: function(){
      return {
        selectWeek: this.week,
        selectYear: this.year,
        value: {week: this.week},
        showYear: this.year,
        startDate: null,
        endDate: null,
        touchStatus: null,
        touchInfo: {}
    }
  },
  created: function() {

  },
  computed: {
    // 周列表
    weekList: function() {
        // 起止时间默认为当前展示年份的第一天，最后一天
        let disabledCheck = tools.disabledCheckCreator(this.disabled);
        let startDate = `${this.showYear}-01-01`;
        let endData = `${this.showYear}-12-31`;
        let weekListDate = this.gerWeekList(startDate, endData, disabledCheck);
        let dataList = weekListDate.map((item, index) => {
            let className = "normalCell";
            if (index === (this.selectWeek - 1) && this.selectYear === this.showYear) {
                className = "normalActiveCell";
                // 默认值
                if (!this.value.monday) {
                    this.value.monday = item.monday;
                    this.value.sunday = item.sunday;
                }
            } else if (item.disabled) {
                className = "normalDisabledCell";
            }
            let data = {
                index,
                disabled: item.disabled,
                number: item.number,
                monday: item.monday,
                sunday: item.sunday,
                tapClassName: className,
                content: `${item.mondayStr}${item.sundayStr ? `-${item.sundayStr}` : ""}`
            }
            data.tapClick = this.handleChooseWeek.bind(this, data)
            return data
        })
        return dataList
    }
  },
  watch: {
      week(newWeek) {
          this.selectWeek = newWeek;
      },
      year(newYear){
          this.selectYear = newYear;
      }
  },
  mounted: function() {
      // 当前组件渲染完立即调用，服务端不会执行
    let parent = this.$refs.list;
    let parentPosition = parent && parent.getBoundingClientRect();
    let activeItem = this.$refs.list.querySelector('.normalActiveCell')
    let activeItemPosition = activeItem && activeItem.getBoundingClientRect();
    let parentScroll = parent.scrollTop;
    if (activeItemPosition.y > (parentPosition.y + parentPosition.height)) {
        parent.scrollTo(parentPosition.x, parentScroll + (activeItemPosition.y - parentPosition.y) + parentPosition.height / 2);
    }
  },
  methods: {
    gerWeekList: function(startDate, endDate, disabledCheck) {
        // 规范起始，截止日期
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let sum = (endDate - startDate) / 86400000 + 1;
        // 第一天是周几
        let firstDay = startDate.getDay();
        // 周一、周日的计算规律
        let mondayCount = (7 - firstDay + 2) % 7;
        let sundayCount = (7 - firstDay + 1) % 7;
        let tempWeek = 1;
        let dateList = [];
        for (let count = 1; count < (sum + 1); count++) {
            if (count === 1) {
                let referenceDate = new Date(startDate.toGMTString());
                let firstDate = null;
                let weekObj = {
                    number: tempWeek,
                    disabled: disabledCheck(firstDate),
                    monday: firstDate,
                    mondayStr: `${month > 9 ? '' : '0'}${month}${date > 9 ? '' : '0'}${date}`
                };
                if (firstDay === 1) {
                    firstDate = startDate;
                }
                else if (firstDay === 0) {
                    tempWeek += 1;
                    firstDate = new Date(referenceDate.setDate(-5));
                    let sundayMonth = startDate.getMonth() + 1;
                    let sundayDate = startDate.getDate();
                    weekObj.sunday = startDate;
                    weekObj.sundayStr = `${sundayMonth > 9 ? '' : '0'}${sundayMonth}${sundayDate > 9 ? '' : '0'}${sundayDate}`;
                }
                else {
                    firstDate = new Date(referenceDate.setDate(-(firstDay - 2)));
                }
                let month = firstDate.getMonth() + 1;
                let date = firstDate.getDate();
                weekObj = Object.assign({}, weekObj, {
                    disabled: disabledCheck(firstDate),
                    monday: firstDate,
                    mondayStr: `${month > 9 ? '' : '0'}${month}${date > 9 ? '' : '0'}${date}`
                });
                dateList.push(weekObj);
            }
            else if (count % 7 === mondayCount) {
                if (count === sum) {
                    continue;
                }
                let referenceDate = new Date(startDate.toGMTString());
                let firstDate = count === 0 ? referenceDate : new Date(referenceDate.setDate(count));
                let month = firstDate.getMonth() + 1;
                let date = firstDate.getDate();
                dateList.push({
                    number: tempWeek,
                    disabled: disabledCheck(firstDate),
                    monday: firstDate,
                    mondayStr: `${month > 9 ? '' : '0'}${month}${date > 9 ? '' : '0'}${date}`
                });
            }
            else if ((count % 7 === sundayCount) || (count === sum)) {
                let referenceDate = new Date(startDate.toGMTString());
                let lastDate = new Date(referenceDate.setDate(count));
                if ((count === sum) && (lastDate.getDay() !== 0)) {
                    dateList.pop();
                }
                else {
                    let month = lastDate.getMonth() + 1;
                    let date = lastDate.getDate();
                    let lastWeek = dateList[dateList.length - 1];
                    lastWeek.sunday = lastDate;
                    lastWeek.sundayStr = `${month > 9 ? '' : '0'}${month}${date > 9 ? '' : '0'}${date}`;
                    lastWeek.disabled = lastWeek.disabled || disabledCheck(lastDate);
                    tempWeek += 1;
                }
            }
        }
        return dateList;
    },
    // 选中
    handleChooseWeek: function(data, e) {
        if (data.disabled) return

        let target = e.currentTarget;
        let week = parseInt(target.getAttribute('data-week'), 10);
        let { delayChange, showYear } = this;
        if (this.selectWeek !== week || this.selectYear !== showYear) {
            let monday = target.getAttribute('data-monday');
            let sunday = target.getAttribute('data-sunday');
            this.selectWeek = week;
            this.selectYear = this.showYear;
            this.value = {
                week: this.selectWeek,
                monday,
                sunday
            };
            this.onChange(this.value);
        }
    },
    // 改变年
    prevChange: function() {
        this.showYear = this.showYear - 1
    },
    // 改变年
    nextChange: function() {
        this.showYear = this.showYear + 1
    },
    onCancel:function() {
        this.onClose();
    },
    onSure: function() {
        this.onChange(this.value);
    }
  }
};
</script>
