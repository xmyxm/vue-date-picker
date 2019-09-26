<template>
  <i v-bind:class="type"> </i>
</template>

<script>

export default {
  name: 'Icon',
  props: {
      type: {
        type: String,
        required: true,
      },
  },
};
</script>

<style scoped>
.angleDoubleLeft {
    background: url("./style/icon/angleDoubleLeft.png") center no-repeat;
}

.angleLeft {
    background: url("./style/icon/angleLeft.png") center no-repeat;
}

.angleRight {
    background: url("./style/icon/angleRight.png") center no-repeat;
}

.angleDoubleRight {
    background: url("./style/icon/angleDoubleRight.png") center no-repeat;
}

.angleDown {
    background: red;
}

.angleUp {
    background: red;
}

.fa {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: 40px 40px;
}

.angleDoubleLeft,
.angleLeft,
.angleRight,
.angleDoubleRight {
    width: 20px;
    height: 20px;
    background-size: 10px 10px;
}


</style>

