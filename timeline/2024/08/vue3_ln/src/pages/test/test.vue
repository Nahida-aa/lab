<template>
<view class="content">
  <view class="menu">
    <uni-segmented-control :current="current" :values="values" 
    :style-type="styleType"
    active-color="#4cd964" @clickItem="onClickItem" />
  </view>
  <view class="layout">
    <view class="box" v-for="item in preview_list" :key="item._id">
      <view class="pic">
        <image :src="item.url" lazy-load
          mode="widthFix"
          @click="onPreview($event, $index)"
        ></image>
      </view>
      <view class="text">{{ item.content }}</view>
      <view class="author">——{{ item.author }}</view>
    </view>
  </view>

  <view class="float">
    <view class="item" @click="onRefresh">
      <uni-icons type="refreshempty" size="26"></uni-icons>
    </view>
    <view class="item" @click="onTop">
      <uni-icons type="arrow-up" size="26"></uni-icons>
    </view>
    <view class="safe-area"></view>
  </view>
</view>
</template>

<script setup>
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { ref } from 'vue'
import {is_dev} from '@/config/index.js'

const pets = ref([])
const pet_cats = ref([])
const pet_dogs = ref([])
const preview_list = ref([])
const current = ref(0)
const pet_classify = [{key:"all", value:"全部"}, {key:"cat", value:"猫猫"}, {key:"dog", value:"狗狗"}]
const values = pet_classify.map(item => item.value)
const styleType = 'button'
const onClickItem = (e) => {
  // if(is_dev) console.log(e)
  current.value = e.currentIndex
  network()
}

const onRefresh = () => {
  pets.value = []
  network()
}

const onTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100
  })
}

const onPreview = (index) => {
  let urls = pets.value.map(item => item.url)
  uni.previewImage({
    current: urls[index],
    urls: urls
  })
}

function network() {
  // uni.showNavigationBarLoading()
  uni.request({
    url: 'https://tea.qingnian8.com/tools/petShow',
    data: {
      size: 5,
      type: pet_classify[current.value].key
    },
    // header:{
    //   "access-key": "xxm123321@#"
    // },
  }).then(res => {
    if (res.data.errCode === 0) {
      if (current.value === 0) {
        pets.value = [...pets.value, ...res.data.data]
        preview_list.value = pets.value
      }else if (current.value === 1) {
        if(is_dev) console.log(pet_classify[current.value].key)
        if(is_dev) console.log('点击了猫猫')
        pet_cats.value = [...pet_cats.value, ...res.data.data]
        preview_list.value = pet_cats.value
      }else if (current.value === 2) {
        pet_dogs.value = [...pet_dogs.value, ...res.data.data]
        preview_list.value = pet_dogs.value
      }else {
        pets.value = [...pets.value, ...res.data.data]
        preview_list.value = pets.value
      }
    }else if (res.data.errCode === 400) {
      uni.showToast({
        title: res.data.errMsg,
        icon: 'none'
      })
    }
  }).catch(err => {
    if(is_dev) console.log(err)
    uni.showToast({
      title: '网络错误, 请重新刷新',
      icon: 'none'
    })
  }).finally(() => {
    // uni.hideLoading()
    uni.hideNavigationBarLoading()
    // 停止下拉刷新的动画
    uni.stopPullDownRefresh()
  })
}
// 初始化
network()
// 触底追加
onReachBottom(() => {
  network()
})
// 下拉刷新
onPullDownRefresh(() => {
  pets.value = []
  network()
})
</script>

<style lang="scss" scoped>
.content {
  .menu{
    padding: 50rpx 50rpx 0;
  }
  .layout{
    padding: 50rpx;
    .box{
      margin-bottom: 60rpx;
      // 盒子阴影 让盒子有立体感
      box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
      border-radius: 15rpx;
      // 防止内容溢出容器
      overflow: hidden;
      .pic{
        image{
          width: 100%;
        }
      }
      .text{
        padding: 30rpx;
        // text-align: center;
        color: #333;
        font-size: 36rpx;
      }
      .author{
        padding:0 30rpx 30rpx;
        text-align: right;
        font-size: 28rpx;
        color: #999;
      }
    }
  }
  .float{
    position: fixed;
    bottom: 0rpx;
    right: 30rpx;
    .item{
      width: 90rpx;
      height: 90rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      margin-bottom: 20rpx;
      display: flex;
      align-items:center;
      justify-content: center;
      border: 1px solid #eee;
    }
    .safe-area{
      border: 1px solid red;
      // height: 100rpx;
      height: env(safe-area-inset-bottom);
    }
  }
}
</style>
    
      