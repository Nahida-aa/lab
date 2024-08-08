<template>
<view class="classifyLayout pageBg">

<custom-nav-bar title="分类"></custom-nav-bar>

<view class="classify">
  <topic_item v-for="item in classifyList" :key="item._id" :item="item"></topic_item>
</view>

</view>
</template>

<script setup>
import { ref } from 'vue'
import topic_item from '@/components/topic-item/topic-item.vue'
import {apiGetClassify} from '@/api/apis.js'
const classifyList = ref([])
const get_classify = async () => {
  let res_json = await apiGetClassify()
  console.log(res_json)
  classifyList.value = res_json.data
}
get_classify()
</script>

<style lang="scss" scoped>
.classify{
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}
</style>