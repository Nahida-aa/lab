<template>
<view class="layout">
  <view class="navbar">
    <view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
    <view class="titleBar" :style="{height:getTitleBarHeight()+'px', marginLeft:getLeftIconLeft()+'px'}">
      <view class="title">{{ title }}</view>
      <view class="search">
        <uni-icons class="icon" type="search" colo="#888" size="18"></uni-icons>
        <text>搜索</text>
      </view>
    </view>
  </view>
  <!-- 撑开被 nav 挡住的大小的, 用于给内容占位, 让内容 -->
  <view class="fill" :style="{height:getNavBarHeight()+'px'}">

  </view>
</view>
</template>

<script setup>
import { getStatusBarHeight,getTitleBarHeight,getNavBarHeight,getLeftIconLeft } from '@/utils/system.js'
defineProps({
  title: String,
  default: '壁纸'
})
</script>

<style lang="scss" scoped>
.layout{
  .navbar{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 10;
    background: 
    linear-gradient(180deg, rgba(0, 0, 0, 0), #ffffff 400rpx),
    linear-gradient(90deg, #beecd8 20%, #f4e2d8);
    .statusBar{ }
    .titleBar{
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      .title{
        line-height: 100%;
        font-size: 22px;
        font-weight: 700;
        color: $color_text_font;
      }
      .search{
        width: 220rpx;
        height: 50rpx;
        border-radius: 60rpx;
        background: rgba(255,255,255,0.4);
        border: 1px solid #fff;
        margin-left: 30rpx;
        color: #999;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        .icon{
          margin-left: 5rpx;
        }
        .text{
          padding-left: 10rpx;
        }
      }
    }
  }
  .fill{

  }
}
</style>
    
      