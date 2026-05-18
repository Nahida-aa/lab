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
import { apiWallpaper, apiScore, apiDownload } from '@/api/apis.js'
import { onLoad, onReachBottom, onUnload } from '@dcloudio/uni-app';
import { gotoHome } from '@/utils/common.js'
import { is_dev } from '@/config/index.js'

const wallpaperList = ref([])
const queryParams = {
  page: 1,
  page_size: 12,
}
const noData = ref(false)
let pageName

onLoad((e) => {
  if(is_dev) console.log('wallpaper_onLoad:', e)
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
  // if(is_dev) console.log('wallpaperList.length',wallpaperList.length,'noData',noData)
  // if (wallpaperList.length || noData.value) {
  //   if(is_dev) console.log('显示底部加载更多')
  //   if(is_dev) console.log(wallpaperList.length || noData)
  // }
  // if(is_dev) console.log(wallpaperList.length || noData)
})
onReachBottom(() => {
  if(is_dev) console.log('到底了', noData.value)
  if (noData.value) {
    return
  }
  // TODO: 防抖
  queryParams.page++
  get_wallList_by_x()
})

const get_wallList_by_x = async () => {
  let res_json
  if(is_dev) console.log('queryParams:', queryParams)
  if (queryParams.class_id) { 
    res_json = await apiWallpaper(queryParams) 
    if(is_dev) console.log('wallpaperList', res_json)
  }
  // if (queryParams.type) res_json = await apiUserWall({data:queryParams})
  if (queryParams.type == 'score') {
    res_json = await apiScore({data:queryParams})
    if(is_dev) console.log('我的评分', res_json)
  }
  if (queryParams.type == 'download') {
    res_json = await apiDownload({data:queryParams})
    if(is_dev) console.log('我的下载', res_json)
  }
  // wallpaperList.value = res_json.data
  // 追加
  wallpaperList.value = [...wallpaperList.value, ...res_json.data]
  if (res_json.data.length < queryParams.page_size) noData.value = true
  // TODO: 缓存 后续建议使用 Pinia 来管理
  uni.setStorageSync("storeWallList", wallpaperList.value)
}

// 分享
onShareAppMessage((e) => {
  if(is_dev) console.log('分享', e)
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
  if(is_dev) console.log('页面卸载')
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