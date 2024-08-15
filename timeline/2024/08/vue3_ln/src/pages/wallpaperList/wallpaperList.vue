<template>
  <view class="wallpaperList">

    <view class="loadingLayout" v-if="!wallpaperList.length && !noData">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <view class="content">
      <view class="item" v-for="item in wallpaperList" :key="item._id">
        <navigator :url="`/pages/preview/preview?id=` + item._id" class="img">
          <image :src="item.small_url" mode="aspectFill" />
        </navigator>
      </view>
    </view>

    <view class="loadingLayout" v-if="wallpaperList.length || noData.value">
      <uni-load-more :status="noData ? 'noMore' : 'loading'"></uni-load-more>
    </view>

    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app';
import { apiWallpaper, apiUserWall } from '@/api/apis.js'
import { onLoad, onReachBottom, onUnload } from '@dcloudio/uni-app';
import { gotoHome } from '@/utils/common.js'

const wallpaperList = ref([])
const queryParams = {
  page: 1,
  pageSize: 12,
}
const noData = ref(false)
let pageName

onLoad((e) => {
  console.log('wallpaper_onLoad:', e)
  let { id = null, name = null, type = null } = e
  if (!id && !name) {
    gotoHome()
    return
  }
  if (id) queryParams.class_id = id
  if (type) queryParams.type = type
  pageName = name
  uni.setNavigationBarTitle({
    title: pageName
  })
  get_wallList_by_x()
  // console.log('wallpaperList.length',wallpaperList.length,'noData',noData)
  // if (wallpaperList.length || noData.value) {
  //   console.log('显示底部加载更多')
  //   console.log(wallpaperList.length || noData)
  // }
  // console.log(wallpaperList.length || noData)
})
onReachBottom(() => {
  console.log('到底了', noData.value)
  if (noData.value) {
    return
  }
  // TODO: 防抖
  queryParams.page++
  get_wallList_by_classify()
})

const get_wallList_by_x = async () => {
  let res_json
  console.log('queryParams:', queryParams)
  if (queryParams.class_id) { 
    console.log('apiWallpaper')
    res_json = await apiWallpaper(queryParams) 
  }
  if (queryParams.type) res_json = await apiUserWall(queryParams)
  console.log('apiUserWall:', res_json)
  // wallpaperList.value = res_json.data
  // 追加
  wallpaperList.value = [...wallpaperList.value, ...res_json.data]
  if (res_json.data.length < queryParams.pageSize) noData.value = true
  // TODO: 缓存 后续建议使用 Pinia 来管理
  uni.setStorageSync("storeWallList", wallpaperList.value)
}

// 分享
onShareAppMessage((e) => {
  console.log('分享', e)
  return {
    title: '小草壁纸-' + pageName,
    path: '/pages/wallpaperList/wallpaperList?id=' + queryParams.class_id + '&name=' + pageName,
  }
})
onMounted(() => {
  const instance = getCurrentInstance();
  if (instance) {
    instance.proxy.onShareTimeline = () => {
      return {
        title: '小草壁纸~~~',
        query: 'id=' + queryParams.class_id + '&name=' + pageName
      };
    };
  }
});
onUnload(() => {
  console.log('页面卸载')
  uni.removeStorageSync("storeWallList")
})
</script>

<style lang="scss" scoped>
.wallpaperList {
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;

    .item {
      height: 440rpx;

      .img {
        height: 100%;

        image {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
}
</style>