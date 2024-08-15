<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { apiNewsRead } from '@/api/apis.js'
import markdown from '@/components/markdown/markdown.vue'

let news_id
const news = ref({})
const isMarkdown = ref(false)

onLoad((e) => {
  news_id = e.id
  apiNewsRead({ id:news_id }).then(res_body => {
    console.log('apiNewsRead:', res_body)
    news.value = res_body.data
    if (news.value.detail_content && news.value.detail_content.endsWith('.md')) {
      console.log('isMarkdown')
      isMarkdown.value = true
    }
  })
})
</script>

<template>
<view class="noticeLayout">

  <view class="title">
    <view class="tag">
      <uni-tag inverted 
        text="置顶"
        size="normal"
        type="error"
      />
    </view>
    <view class="font">这个区域写标题</view>
  </view>

  <view class="info">
    <view class="item">Nahida</view>
    <view class="item">
      <uni-dateformat
        :date="Date.now()"
        format="yyyy/MM/dd hh:mm:ss"
      />
    </view>
  </view>

  <view class="content">
    <div v-if="news.detail_content && isMarkdown">
      <markdown :src="news.detail_content"></markdown>
    </div>
    <div v-else v-html="news.detail_content"></div>
  </view>

  <view class="count">
    阅读 5588
  </view>
  
</view>
</template>

<style lang="scss" scoped>
.noticeLayout{
  padding: 30rpx;
  .title{
    font-size: 40rpx;
    color: #111;
    line-height: 1.6em;
    padding-bottom: 30rpx;
    display: flex;
    .tag{
      transform: scale(0.8);
      transform-origin: left center;
      flex-shrink: 0;
    }
    .font{
      padding-left: 6rpx;
    }
  }
  .info{
    display: flex;
    align-items: center;
    .item{
      padding-right: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }
  .content{
    margin-top: 50rpx;
    font-size: 32rpx;
    color: #333;
  }
  .count{
    margin-top: 50rpx;
    font-size: 28rpx;
    color: #999;
  }
}
</style>