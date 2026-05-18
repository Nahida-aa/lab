<template>
  <view class="common-title">
    <view class="name">
      <slot name="name"></slot>
    </view>
    <view class="custom">
      <slot name="custom"></slot>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.common-title {
  display: flex;
  // 水平居中
  justify-content: space-between;
  // 垂直居中
  align-items: center;
  // 上下 0 左右 30rpx
  padding: 0 30rpx;
  .name {
    font-size: 40rpx;
  }
}
</style>
    
      