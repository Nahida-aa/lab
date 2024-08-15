<template>
<view class="homeLayout pageBg">

<!-- 顶部栏 -->
<custom-nav-bar title="推荐"></custom-nav-bar>

<!-- 水平轮播图 -->
<view class="banner">
  <swiper
    indicator-dots
    indicator-color="rgba(255,255,255,0.5)"
    indicator-active-color="#ffffff"
    autoplay
    circular>
    <swiper-item v-for="item in bannerList" :key="item._id">
      <image
        :src="item.pic_url"
        mode="aspectFill"
      />
    </swiper-item>
  </swiper>
</view>

<!-- 公告（竖直轮播图） -->
<view class="notice">
  <view class="left">
    <uni-icons type="sound-filled" size="20"></uni-icons>
    <text class="text">公告</text>
  </view>
  <view class="center">
    <swiper vertical interval="1500"
      autoplay
      circular>
      <swiper-item v-for="item in noticeList" :key="item._id" @click="goNoticeDetail(item._id)">{{ item.title }}</swiper-item>
    </swiper>
  </view>
  <view class="right">
    <uni-icons type="right" size="16" color="#333"></uni-icons>
  </view>
</view>

<!-- 每日推荐 -->
<view class="recommend">
  <common-title>
    <template #name>每日推荐</template>
    <template #custom>
      <view class="date">
        <uni-icons type="calendar" size="20"></uni-icons>
        <view class="text">
          <uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
        </view>
      </view>
    </template>
  </common-title>
  <view class="content">
    <scroll-view scroll-x>
      <view class="box" 
        v-for="item in recommendList" :key="item._id" 
        @click="goPreview(item._id)"
      >
        <image
          :src="item.small_url"
          mode="aspectFill"/>
      </view>
    </scroll-view>
  </view>
</view>

<!-- 专题精选 -->
<view class="topic">
  <common-title>
    <template #name>专题精选</template>
    <template #custom>
      <navigator class="more" url="/">
        More+
      </navigator>
    </template>
  </common-title>
  <view class="content">
    <!-- 8+1 = 3*3 -->
    <topic-item v-for="item in classifyList" :key="item._id" :item="item"></topic-item>
    <topic-item :isMore="true"></topic-item>
  </view>
</view>
</view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import {apiGetBanner,apiNewsList,apiGetRecommend,apiGetClassify} from '@/api/apis.js'
import { onShareAppMessage } from '@dcloudio/uni-app';

const bannerList = ref([])
const noticeList = ref([])
const recommendList = ref([])
const classifyList = ref([])

// 异步请求
const get_banner = async () => {
  // 异步等待
  let res_json = await apiGetBanner()
  // console.log(res_json)
  // console.log(res_json.data)
  bannerList.value = res_json.data
  // console.log(bannerList.value)
}
const get_notice = async () => {
  let res_json = await apiNewsList(
    // {is_recommend:true}
  )
  // console.log(res_json.data)
  noticeList.value = res_json.data
}
const get_recommend = async () => {
  let res_json = await apiGetRecommend()
  // console.log(res_json.data)
  recommendList.value = res_json.data
}
const get_classify = async () => {
  let res_json = await apiGetClassify({
    is_recommend: true
  })
  console.log(res_json)
  classifyList.value = res_json.data
}

get_banner()
get_notice()
get_recommend()
get_classify()

const goPreview = (id) => {
  uni.setStorageSync("storeWallList",recommendList.value)
  uni.navigateTo({
    url: '/pages/preview/preview?id='+id
  })
}

const goNoticeDetail = (new_id) => {
  uni.navigateTo({
    url: '/pages/notice/detail?id='+new_id
  })
}

// 分享
onShareAppMessage((e) => {
  console.log('分享',e)
  return {
    title: '小草壁纸~~~',
  }
})
onMounted(() => {
  const instance = getCurrentInstance();
  if (instance) {
    instance.proxy.onShareTimeline = () => {
      return {
        title: '小草壁纸~~~',
      };
    };
  }
});
</script>

<style lang="scss" scoped>
.homeLayout {
  .banner {
    width: 750rpx;
    // 上下30rpx 左右0
    padding: 30rpx 0;
    swiper {
      width: 750rpx;
      height: 340rpx;
      swiper-item {
        // 100% 即继承父元素的宽度
        width: 100%;
        height: 100%;
        padding: 0 30rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
    }
  }
  
  .notice {
    width: 690rpx;
    height: 80rpx;
    // margin 外边距 上下 0 左右自动 = 居中
    margin: 0 auto;
    line-height: 80rpx;
    border-radius: 80rpx;
    display: flex;
    background-color: #f9f9f9;
    .left {
      width: 140rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      // 穿透到子元素就能 使 MP 端支持
      :deep(){
        // 选择所有子元素
        .uni-icons {
        // 最高权重避免被覆盖，但是 MP 端不支持
        color: $color_theme_green !important;
        }
      }
      // 公告
      .text {
        color: $color_theme_green;
        // bold
        font-weight: 600;
        font-size: 28rpx;
      }
    }
    .center {
      flex:1;
      swiper {
        height: 100%;
        swiper-item {
          height: 100%;
          font-size: 30rpx;
          color: #666;
          // 隐藏溢出内容
          overflow: hidden;
          // 不换行
          white-space: nowrap;
          // 显示省略号
          text-overflow: ellipsis;
        }
      }
    }
    .right {
      width: 70rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .recommend {
    padding-top: 50rpx;
    .date{
      color: $color_theme_green;
      display: flex;
      align-items: center;
      :deep(){
        .uni-icons {
          color: $color_theme_green !important;
        }
      }
      .text {
        font-size: 28rpx;
        margin-left: 5rpx;
      }
    }
    .content {
      width: 720rpx;
      margin-left: 30rpx;
      margin-top: 30rpx;
      scroll-view {
        white-space: nowrap;
        .box {
          width: 200rpx;
          height: 430rpx;
          display: inline-block;
          margin-right: 15rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
        .box:last-child {
          margin-right: 30rpx;
        }
      }
    }
  }

  .topic {
    padding: 50rpx 0;
    .more {
      font-size: 32rpx;
      color: #888;
    }
    .content {
      margin-top: 30rpx;
      padding: 0 30rpx;
      // 网格布局
      display: grid;
      // 网格间距
      gap: 15rpx;
      // 3列
      grid-template-columns: repeat(3, 1fr);
      // ---------------------
    }
  }
}

</style>
