<template>
  <div class="mask">
        <div class="maskInner">
            <slot></slot>
            <div class="maskCancel" @touchend="onCancel">
                <Icon type="close" />
            </div>
        </div>
    </div>
</template>

<script>
import Icon from './icon';

export default {
  name: 'Mask',
  props: {
      onCancel: {
          type: Function,
          default: function(){}
      }
  }
};
</script>
