<template>
<view class="layout">
  <view class="header">
    <slot name="header"></slot>
  </view>
  <view class="main">
    <slot name="main"></slot>
  </view>
  <view class="footer">
  </view>
</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header {
    height: 50px;
    background-color: #f0f0f0;
  }
  .main {
    flex: 1;
    background-color: #f5f5f5;
  }
  .footer {
    height: 50px;
    background-color: #f0f0f0;
  }
}
</style>
    
      