<template>
    <div class="commonHandle">
        <button class="commonHandlecancelBtn" v-on:click="onCancel">取消</button>
        <button class="commonHandleokBtn" v-on:click="onSure">确定</button>
    </div>
</template>

<script>
export default {
  name: 'CommonHandle',
  methods: {
      onSure: function(e){
          this.$parent.onSure && this.$parent.onSure(e);
      },
      onCancel: function(e){
        this.$parent.onCancel && this.$parent.onCancel(e);
      }
  },
};
</script>

<style scoped>
.common-handle {
    text-align: center;
    padding: 15px 0 20px;
}

.btn-cancel {
    color: #666;
    background-color: #e5e5e5;
    border-color: #e5e5e5;
}

.btn-com {
    width: 210px;
    height: 80px;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    cursor: pointer;
    user-select: none;
    border: solid transparent;
    border-width: 1px;
    font-size: 26px;
    line-height: 80px;
    border-radius: 2px;
    margin-right: 8px;
    text-decoration: none;
}

.btn-sus {
    color: #fff;
    background-color: #118bfb;
    border-color: #118bfb;
}

</style>
