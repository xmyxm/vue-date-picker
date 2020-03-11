<template>
    <div
        :data-week="initData.number"
        :data-monday="initData.monday"
        :data-sunday="initData.sunday"
        :data-month="initData.month"
        :data-holiday="initData.name"
        :class="initData.tapClassName"
        @click="tapItem"

        >
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Tap',
  props: {
    initData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    tapItem(e) {
      this.initData.tapClick(e);
    },
  },
};
</script>
