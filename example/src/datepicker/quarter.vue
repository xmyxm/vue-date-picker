<template>
  <div>
        <div class="header">
            <div class="headerInner">
                <div
                    class="btn"
                    @touchend="prevChange">
                    <div class="iconBtn">
                        <Icon type="angleLeft" />
                    </div>
                </div>
                <div class="centerBtn"> {{showYear}} </div>
                <div
                    class="rightBtn"
                    @touchend="nextChange">
                    <div class="iconBtn">
                        <Icon type="angleRight" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 季度列表 -->
        <Swipe>
                <div class="holidaynormalListInner">
                    <Tap :key="item.index" v-for="item in quartList" :init-data="item" class="item.tapClassName">
                        <div key={i} class="itemWrap">
                            <div class="textName">
                                {{item.name}}
                            </div>
                            <div class="cellDate">
                                {{item.day}}
                            </div>
                        </div>
                    </Tap>
                </div>
            </Swipe>
            
            <common-handle v-if="delayChange"/> 
    </div>
</template>

<script>

import Swipe from './swipe';
import Tap from './tap';
import CommonHandle from './commonhandle';
import Icon from './icon';
import common from './lib/common';
import tools from './lib/tools';

export default {
    name: 'Quarter',
    components: {
        'common-handle': CommonHandle,
        Swipe,
        Icon,
        Tap
    },
    props: {
        lang: {
            type: String
        },
        year: {
            type: Number
        },
        quarter: {
            type: Number
        },
        disabled: {
            type: [Function, Boolean],
            default: false
        },
        delayChange: {
            type: Boolean,
            default: true
        },
        year: {
            type: Number,
            default: (new Date()).getFullYear()
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
  data: function() {
      return {
            showYear: this.year,
            selectYear: this.year,
            selectQuarter: this.quarter,
            quartListItem: {},
            touchStatus: null,
            touchInfo: {}
    }
  },
  computed: {
        quartList: function() {
            let disabledCheck = tools.disabledCheckCreator(this.disabled);
            const quartListConfig = [
                { name: '第一季度', day: '1月-3月', key: 1 },
                { name: '第二季度', day: '4月-6月', key: 2 },
                { name: '第三季度', day: '7月-9月', key: 3 },
                { name: '第四季度', day: '10月-12月', key: 4 }
            ];
            let listData = quartListConfig.map((item, i) => {
                let className = "normalCell";
                let disabled = this.getDisabledValue(this.showYear, item.key, disabledCheck);
                if (item.key === this.selectQuarter && this.selectYear === this.showYear) {
                    className = "normalActiveCell";
                } else if (disabled) {
                    className = "normalDisabledCell";
                }
                let data = {
                    index: i,
                    tapClassName: className,
                    key: item.key,
                    name: item.name,
                    day: item.day,
                    disabled: disabled
                }
                data.tapClick = this.handleChooseHoliday.bind(this, data)
                return data
            })
            return listData
        }
  },
  watch: {
        year(newYear) {
            this.selectYear = newYear
        },
        quarter(newQuarter) {
            this.selectQuarter = newQuarter
        }
  },
  methods: {
        getDisabledValue: function(year, type, disabledCheck) {
            let disabled = false;
            switch (type) {
                case 1:
                    disabled = disabledCheck(new Date(`${year}-01-01`));
                    break;
                case 2:
                    disabled = disabledCheck(new Date(`${year}-04-01`));
                    break;
                case 3:
                    disabled = disabledCheck(new Date(`${year}-07-01`));
                    break;
                case 4:
                    disabled = disabledCheck(new Date(`${year}-10-01`));
                    break;
            }
            return disabled;
        },

        // 选中
        handleChooseHoliday: function(quartListItem, e) {
            if (quartListItem.disabled) return

            let list = Object.assign(quartListItem);
            if (this.selectQuarter !== list.key || this.selectYear !== this.showYear) {
                this.selectYear = this.showYear;
                this.quartListItem = list;
                this.selectQuarter = list.key;
                if (!this.delayChange) {
                    this.$nextTick(function() {
                        this.onChange(list.key, this.selectYear);
                    });
                }
            }
        },
        // 改变年
        prevChange: function() {
            this.showYear = this.showYear - 1
        },
        nextChange: function() {
            this.showYear = this.showYear + 1
        },
        onCancel:function() {
            this.onClose();
        },
        onSure: function() {
            this.onChange(this.quartListItem.key || '', this.selectYear);
        }
    }
};
</script>
