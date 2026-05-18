<script setup>
import {is_dev} from '@/config/index.js'
if(is_dev) console.log('markdown.vue')
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { onLoad } from '@dcloudio/uni-app'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})
const htmlContent = ref('')

const loadMarkdownContent = async (md_file_url) => {
  if(is_dev) console.log('loadMarkdownContent:', md_file_url)
  try {
    uni.request({
      url: md_file_url,
      success: (response) => {
        if(is_dev) console.log('success:', response)
        if(is_dev) console.log('Markdown content:', response.data)
        const markdown = response.data
        htmlContent.value = marked(markdown)
      },
      fail: (error) => {
        if(is_dev) console.error('Error fetching markdown content:', error)
      }
    })
  } catch (error) {
    if(is_dev) console.error('Error loading markdown content:', error)
  }
}

// onLoad(() => {
//   console.log('onLoad:', props.src)
//   loadMarkdownContent(props.src)
// })
onMounted(() => {
  if(is_dev) console.log('onMounted:', props.src)
  loadMarkdownContent(props.src)
})
</script>

<template>
  <div class="markdown-content" v-html="htmlContent"></div>
</template>

<style scoped>
.markdown-content {
  font-size: 32rpx;
  line-height: 1.6;
  color: #333;
}
</style>