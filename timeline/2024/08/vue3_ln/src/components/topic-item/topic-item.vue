<template>

<view class="topic-item" >
  <navigator class="box" :url="`/pages/wallpaperList/wallpaperList?id=`+item._id+`&name=`+item.name" v-if="!isMore">
    <image class="pic"
      :src="item.pic_url" mode="aspectFill"/>
    <view class="tab" v-if="formatTimeDifference(item.update_time)">{{ formatTimeDifference(item.update_time) }}前更新</view>
    <view class="mask">{{ item.name }}</view>
  </navigator>
  <navigator class="box more" url="/pages/classify/classify" open-type="reLaunch" v-if="isMore">
    <image class="pic" src="/static/images/more.jpg" mode="aspectFill"/>
    <view class="mask">
      <uni-icons type="more-filled" size="34" color="#fff"></uni-icons>
      <view class="text">更多</view>
    </view>
  </navigator>
</view>
</template>

<script setup>
import { formatTimeDifference } from '@/utils/common';
defineProps({
  isMore:{
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({
      name: '明星美女',
      pic_url: '/static/images/classify1.jpg',
      update_time: Date.now()-1000*60*60*24*2
    })
  }
})
</script>

<style lang="scss" scoped>
.topic-item {
  .box{
    height: 340rpx;
    border-radius: 10rpx;
    // 防止子元素的图片溢出（因为我给子元素的父元素加了圆角）
    overflow: hidden;
    // 相对定位的元素相对于其正常位置进行定位
    // 元素被设置为 position: relative; 其子元素可以使用 position: absolute; 
    // 进行绝对定位，并且这些子元素的定位是相对于这个相对定位的父元素的
    position: relative;
    .pic{
      width: 100%;
      height: 100%;
    }
    .tab{
      position: absolute;
      left: 0;
      top:0;
      background: rgba(250,129,90,0.7);
      backdrop-filter: blur(20rpx);
      color:#fff;
      font-size: 22rpx;
      // 由于字与边框太近导致太丑，加一个边框
      padding: 6rpx 14rpx;
      // 从左上角开始 顺时针
      border-radius: 0 0 20rpx 0;
      // 缩小字体的兼容写法(以前最小12px),效果是缩小整个元素,以元素中心缩小
      transform: scale(0.8);
      // 调整为以左上角为基准
      transform-origin: left top;
    }
    .mask{
      width: 100%;
      height: 70rpx;
      position: absolute;
      bottom: 0;
      left: 0;
      // 磨砂玻璃
      // 黑色半透明
      background: rgba($color: #000000, $alpha: 0.2);
      // 前景色
      color: #fff;
      // 对半透明进行模糊
      backdrop-filter: blur(20rpx);
      // 居中
      align-items: center;
      justify-content: center;
      display: flex;
      // ---
      font-weight: 600;
      font-size: 30rpx;
    }
  }
  .box.more{
    .mask{
      width: 100%;
      height: 100%;
      // 排列顺序
      flex-direction: column;
    }
    .text{
      font-size: 28rpx;
    }
  }
}
</style>
    
      