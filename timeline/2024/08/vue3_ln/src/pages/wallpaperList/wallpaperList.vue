<template>
<view class="wallpaperList">

<view class="loadingLayout" v-if="!wallpaperList.length && !noData">
  <uni-load-more status="loading"></uni-load-more>
</view>

<view class="content">
  <view class="item" v-for="item in wallpaperList" :key="item._id">
    <navigator :url="`/pages/preview/preview?id=`+item._id" class="img">
      <image
        :src="item.small_url"
        mode="aspectFill"/>
    </navigator>
  </view>
</view>

<view class="loadingLayout" v-if="wallpaperList.length || noData.value">
    <uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
</view>

<view class="safe-area-inset-bottom"></view>
</view>
</template>

<script setup>
import { ref } from 'vue'
import {apiGetWallpaperList} from '@/api/apis.js'
import { onLoad,onReachBottom } from '@dcloudio/uni-app';
const wallpaperList = ref([])
const queryParams = {
  pageNum: 1,
  pageSize: 12,
}
const noData = ref(false)

onLoad((e) => {
  let {id=null,name=null} = e
  queryParams.class_id = id
  uni.setNavigationBarTitle({
    title: name
  })
  get_wallList_by_classify()
  // console.log('wallpaperList.length',wallpaperList.length,'noData',noData)
  // if (wallpaperList.length || noData.value) {
  //   console.log('显示底部加载更多')
  //   console.log(wallpaperList.length || noData)
  // }
  // console.log(wallpaperList.length || noData)
})
onReachBottom(() => {
  console.log('到底了',noData.value)
  if (noData.value) {
    return
  }
  // TODO: 防抖
  queryParams.pageNum++
  get_wallList_by_classify()
})

const get_wallList_by_classify = async () => {
  let res_json = await apiGetWallpaperList(queryParams)
  console.log(res_json)
  // wallpaperList.value = res_json.data
  // 追加
  wallpaperList.value = [...wallpaperList.value,...res_json.data]
  if (res_json.data.length < queryParams.pageSize) noData.value = true
  // TODO: 缓存 后续建议使用 Pinia 来管理
  uni.setStorageSync("storeWallList",wallpaperList.value)
}
</script>

<style lang="scss" scoped>
.wallpaperList{
  .content{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;
    .item{
      height: 440rpx;
      .img{
        height: 100%;
        image{
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
}
</style>
    
      