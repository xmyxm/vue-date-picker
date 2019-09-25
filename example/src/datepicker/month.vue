<template>
    <div class="normal monthWrap">
    <!-- 头部年份选择 -->
        <div class="header">
            <div class="headerInner">
                <div class="btn" @touchend="prevChange">
                    <div class="iconBtn">
                        <Icon type="angleLeft" />
                    </div>
                </div>
                <div class="centerBtn">{{showYear}}</div>
                <div class="rightBtn" @touchend="nextChange">
                    <div class="iconBtn">
                        <Icon type="angleRight" />
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 月份列表 -->
        <Swipe class-name="normalList" >
            <div class="normalListInner">
                <Tap v-for="item in monthList" :key="item.month" :init-data="item">
                    {{item.content}}
                </Tap>
            </div>
        </Swipe>

        <common-handle v-if="delayChange" />
    </div>
</template>

<script>
import Icon from './icon';
import common from './lib/common';
import tools from './lib/tools';
import conf from './lib/config';
import Swipe from './swipe';
import Tap from './tap';
import CommonHandle from './commonhandle';

export default {
    name: 'Month',
    components: {
        'common-handle': CommonHandle,
        Swipe,
        Icon,
        Tap
    },
    props: {
         locale: {
             type: Object,
             default: function(){ return conf.locale }
         },
        lang: {
            type: String,
            default: 'zh'
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
        month: {
            type: Number,
            default: (new Date()).getMonth()
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
            showYear: this.year,
            selectYear: this.year,
            selectMonth: this.month,
            touchStatus: null,
            touchInfo: {}
        }
    },
    computed: {
        monthList: function() {
            let langMap = (this.locale.lang[this.lang || 'zh'] || {}).month;
            let list = [];
            let disabledCheck = tools.disabledCheckCreator(this.disabled);
            for (let i = 0; i < 12; i++) {
                let disabled = disabledCheck(new Date(`${this.showYear}-${(i + 1) > 9 ? (i + 1) : '0' + (i + 1)}`));
                let className = "normalCell"
                if (i === this.selectMonth && this.selectYear === this.showYear) {
                    className = "normalActiveCell"
                } else if (disabled) {
                    className = "normalDisabledCell";
                }
                list.push({
                    month: i,
                    tapClassName: className,
                    content: langMap[i],
                    tapClick: this.handleChooseMonth
                });
            }
            return list
        }
    },
    watch: {
        year(newYear) {
            this.selectYear = newYear
        },
        month(newMonth) {
            this.selectMonth = newMonth
        }
    },
    methods: {
        // 选中
        handleChooseMonth: function(e) {
            let month = parseInt(e.target.getAttribute('data-month'), 10);
            if (this.selectMonth !== month || this.selectYear !== this.showYear) {
                this.selectMonth = month;
                this.selectYear = this.showYear;
                this.onChange(this.selectMonth + 1, this.selectYear);
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
            this.onChange(this.selectMonth + 1, this.selectYear);
        }
    }
};
</script>
