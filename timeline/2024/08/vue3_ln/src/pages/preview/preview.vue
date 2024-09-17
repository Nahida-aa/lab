<template>
  <view class="preview" v-if="current_info">
    <swiper circular :current="current_index" @change="swiperChange">
      <swiper-item v-for="(item,index) in previewList" :key="item._id">
        <!-- 这个if 避免一次加载全部的图片 -->
        <image v-if="read_imgs.includes(index)" @click="maskChange" :src="item.pic_url" mode="scaleToFill" />
      </swiper-item>
    </swiper>

    <view class="mask" v-show="maskState">
      <!-- #ifndef MP-TOUTIAO -->
      <view class="goBack" @click="goBack" :style="{top:getStatusBarHeight()+'px'}">
        <uni-icons type="back" color="#fff" size="20"></uni-icons>
      </view>
      <!-- #endif -->
      <view class="count">{{ current_index + 1 }} / {{ previewList.length }}</view>
      <view class="time">
        <uni-dateformat :date="new Date()" format="hh:mm"/>
      </view>
      <view class="date">
        <uni-dateformat :date="new Date()" format="MM月dd日"/>
      </view>
      <view class="footer">
        <view class="box" @click="clickInfo">
          <uni-icons type="info" color="" size="28" />
          <view class="text">信息</view>
        </view>
        <view class="box" @click="clickScore">
          <uni-icons type="star" color="" size="28" />
          <view class="text">{{formattedScore}}分</view>
        </view>
        <view class="box">
          <uni-icons @click="clickDownload" type="download" color="" size="28" />
          <view class="text">下载</view>
        </view>
      </view>
    </view>

    <uni-popup ref="infoPopup" type="bottom" :safe-area="false">
      <view class="infoPopup">
        <view class="popHeader">
          <view></view>
          <view class="title">壁纸信息</view>
          <view class="close" @click="clickInfoClose">
            <uni-icons type="closeempty" color="#999" size="18" />
          </view>
        </view>
        <scroll-view scroll-y>
          <view class="content">
            <view class="row">
              <view class="label">壁纸ID：</view>
              <text selectable class="value">{{ current_info._id }}</text>
            </view>
            <!-- <view class="row">
              <view class="label">分类：</view>
              <text class="value class">明星美女</text>
            </view> -->
            <view class="row">
              <view class="label">发布者：</view>
              <text class="value">{{ current_info.nickname }}</text>
            </view>
            <view class="row">
              <view class="label">评分：</view>
              <view class="value rateBox">
                <uni-rate readonly :touchable="false" :value="current_info.score" />
                <text class="score">{{formattedScore}}分</text>
              </view>
            </view>
            <view class="row">
              <view class="label">摘要：</view>
              <text class="value">
                {{ current_info.description }}
              </text>
            </view>
            <view class="row">
              <view class="label">标签：</view>
              <view class="value tabs">
                <view class="tab" v-for="tag in current_info.tags" :key="tag">{{ tag }}</view>
              </view>
            </view>
            <view class="copyright">
              声明：本图片来自用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱1276552337@qq.com，管理将删除侵权壁纸，维护您的权益。
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <uni-popup ref="scorePopup" :is-mask-click="false">
      <view class="scorePopup">
        <view class="popHeader">
          <view></view>
          <view class="title">{{is_has_score?'评分过了~':'壁纸评分'}}</view>
          <view class="close" @click="clickScoreClose">
            <uni-icons type="closeempty" color="#999" size="18" />
          </view>
        </view>
        <view class="content">
          <uni-rate v-model="user_score" allowHalf :readonly="is_has_score"/>
          <text class="text">{{user_score}}分</text>
        </view>
        <view class="footer">
          <button @click="submitScore" 
            :disabled="!user_score || is_has_score" 
            type="default" size="mini" plain>确认评分</button>
        </view>
      </view>
    </uni-popup>

  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app';
import { getStatusBarHeight } from '@/utils/system';
import { onLoad } from '@dcloudio/uni-app';
import { apiScore,apiDownload,apiWallpaper } from '@/api/apis';
import { useUserStore } from '@/store/user';
import {is_dev} from '@/config/index.js'

const userStore = useUserStore();
const scoreCount = ref(userStore.score_count);
// 使用 getStatusBarHeight 函数
// if(is_dev) console.log('StatusBarHeight:', getStatusBarHeight());

const storeWallList = uni.getStorageSync("storeWallList") || []
if(is_dev) console.log('storeWallList',storeWallList)
const previewList = ref([])
previewList.value = storeWallList.map(item=>{
  return {
    ...item,
    pic_url: item.small_url.replace("_small","").replace("small","index")
  }
})
if(is_dev) console.log('previewList',previewList)

const current_id = ref(null)
const current_index = ref(0)
const current_info = ref(null)
const formattedScore = computed(() => {
  return Number(current_info.value.score).toFixed(1);
})
const read_imgs = ref([])

onLoad(async (e)=>{  // 此时页面还未显示，没有开始进入的转场动画，页面dom还不存在
  if(is_dev) console.log('onLoad',e)
  current_id.value = e.id
  if (e.type == 'share') {
    let res_json = await apiWallpaper({id: current_id.value})
    if(is_dev) console.log('apiWallpaper:',res_json)
    previewList.value = res_json.data.map(item=>{
      return {
        ...item,
        pic_url: item.small_url.replace("_small","").replace("small","index")
      }
    })
  }
  current_index.value = previewList.value.findIndex(item=>item._id == current_id.value)
  preloadImages(read_imgs, current_index, previewList)
  current_info.value = previewList.value[current_index.value]
})
const swiperChange = (e)=>{
  current_index.value = e.detail.current
  preloadImages(read_imgs, current_index, previewList)
  current_info.value = previewList.value[current_index.value]
}

// H5没有懒加载，自己实现(预加载3张), 三目运算符是为了可以循环
const preloadImages = (read_imgs, current_index, previewList) => {
  read_imgs.value.push(
    current_index.value <= 0 ? previewList.value.length - 1 : current_index.value - 1,
    current_index.value,
    current_index.value >= previewList.value.length - 1 ? 0 : current_index.value + 1
  );
  // 去重
  read_imgs.value = [...new Set(read_imgs.value)]
};

// click info, open info 弹窗
const infoPopup = ref(null)
const clickInfo = ()=>{
  if(is_dev) console.log('clickInfo')
  infoPopup.value.open()
}
// close info 
const clickInfoClose = ()=>{
  infoPopup.value.close()
}

// open score popup
const scorePopup = ref(null)
// const scoring = ref(false)
const clickScore = ()=>{
  if(is_dev) console.log('clickScore')
  if (current_info.value.user_score) {
    is_has_score.value = true
    user_score.value = current_info.value.user_score
  }
  scorePopup.value.open()
}
// close score popup
const clickScoreClose = ()=>{
  scorePopup.value.close()
  is_has_score.value = false
  // user_score.value = 0
}
const user_score = ref(0)
const is_has_score = ref(false)
const submitScore = async ()=>{
  if(is_dev) console.log('submitScore', user_score.value)
  let {class_id, _id:wall_id} = current_info.value
  let res_json = await apiScore({
    method: 'post',
    data: {
      class_id,
      wall_id,
      user_score: user_score.value
    }
  })
  if(is_dev) console.log('apiScore:',res_json)
  if (res_json.errCode == 0) {
    is_has_score.value = true
    uni.showToast({
      title: '评分成功',
      // icon: 'success'
    })
    current_info.value.score = res_json.data.score
    // 存到store
    storeWallList[current_index.value].score = res_json.data.score
    // 更新 pinia store 的用户评分的壁纸个数
    if(is_dev) console.log('user__score_count',res_json.data.user__score_count)
    userStore.updateScoreCount(res_json.data.user__score_count)
    previewList.value[current_index.value].user_score = user_score.value
    uni.setStorageSync("storeWallList", previewList.value)
  }
  scorePopup.value.close()
}

// download
const clickDownload = async ()=>{
  if(is_dev) console.log('clickDownload')
  // #ifdef H5
  if(is_dev) console.log('H5')
  uni.showModal({
    content: '请长按保存壁纸',
    showCancel: false,
  })
  // #endif
  // #ifndef H5
  try {  // 利用 try 异步同步化
    if(is_dev) console.log('not H5')
    uni.showLoading({
      title: '下载中...',
      mask: true
    })
    let {class_id, _id:wall_id} = current_info.value
    let res_json = await apiDownload({
      method: 'post',
      data: {
        class_id,
        wall_id,
      }
    })
    // if(is_dev) console.log(res_json)
    // if (res_json.errCode != 0) throw res_json
    // download
    uni.getImageInfo({
      src: current_info.value.pic_url,
      success: (res) => {
        if(is_dev) console.log('getImageInfo', res)
        uni.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (success) => {
            if(is_dev) console.log('saveImageToPhotosAlbum', success)
            // 更新 pinia store 的用户下载的壁纸个数
            userStore.updateDownloadCount(res_json.data.user__download_count)
          },
          fail: (err) => {
            if(is_dev) console.log('saveImageToPhotosAlbum', err)
            if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
              uni.showToast({
                title: '取消保存',
                icon: 'none'
              })
              return
            }
            // if (err.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
            // }
            uni.showModal({
              title: '提示',
              content: '需要授权保存到相册',
              success:(success)=>{
                if (success.confirm) {
                  uni.openSetting({
                    success: (res) => {
                      if(is_dev) console.log('res.authSetting',res.authSetting)
                      if (res.authSetting['scope.writePhotosAlbum']) {
                        uni.showToast({
                          title: '授权成功',
                          icon: 'success'
                        })
                      } else {
                        uni.showToast({
                          title: '授权失败',
                          icon: 'none'
                        })
                      }
                    }
                  })
                }
              },
            })
          },
          complete:(complete)=>{
            uni.hideLoading()
          },      
        })
      },
    })
  } catch (error) {
    if(is_dev) console.log('unH5 download_err:',error)
    uni.hideLoading()
  }
  // #endif
}

// 遮罩层状态
const maskState = ref(true)
const maskChange = ()=>{
  if(is_dev) console.log('maskChange')
  maskState.value = !maskState.value
}

// 返回
const goBack = ()=>{
  if(is_dev) console.log('goBack')
  uni.navigateBack({
    success: (res) => {
    },
    fail: (err) => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    },
  })
}

// 分享
onShareAppMessage((e) => {
  if(is_dev) console.log('分享',e)
  return {
    title: '小草壁纸',
    path: '/pages/preview/preview?id='+current_id.value+"&type=share",
  }
})
onMounted(() => {
  const instance = getCurrentInstance();
  if (instance) {
    instance.proxy.onShareTimeline = () => {
      return {
        title: '小草壁纸~~~',
        query: 'id='+current_id.value+"&type=share"
      };
    };
  }
});
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100vh;
  position: relative;
  swiper {
    width: 100%;
    height: 100%;
    swiper-item {
      width: 100%;
      height: 100%;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .mask{
    &>view{
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      width: fit-content;
      color: #fff;
    }
    .goBack{
      width: 38px;
      height: 38px;
      top: 0;
      left: 30rpx;
      margin-left: 0;
      background: rgba(0,0,0,0.5);
      border-radius: 100px;
      backdrop-filter: blur(10rpx);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .count{
      top: 10vh;
      background: rgba(0,0,0,0.3);
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 8rpx 28rpx;
      backdrop-filter: blur(10rpx);
    }
    .time{
      top: calc(10vh + 80rpx);
      font-size: 140rpx;
      font-weight: 100;
      line-height: 1em;
      text-shadow: 0 4rpx rgba(0,0,0,0.3);
    }
    .date{
      font-size: 34rpx;
      top: calc(10vh + 80rpx + 130rpx);
      text-shadow: 0 2rpx rgba(0,0,0,0.3);
    }
    .footer{
      background: rgba(255,255,255,0.8);
      bottom: 10vh;
      width: 65vw;
      height: 120rpx;
      border-radius: 120rpx;
      color:#000;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 2rpx 0 rgba(0,0,0,0.1);
      backdrop-filter: blur(20rpx);
      .box{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // 增加点击有效区域
        padding: 2rpx 12rpx;
        uni-icons{
          // margin-right: 10rpx;
          display: flex;
          align-items: center;
        }
        .text{
          font-size: 26rpx;
          color:$color_subtitle;
        }
      }
    }
  }
  .popHeader{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      color: $color_subtitle;
      font-size: 26rpx;
    }
    .close{
      padding: 6rpx;
      uni-icons{
        
        border-radius: 50%;
        background: #f5f5f5;
      }
    }
  }
  .infoPopup{
    background: #fff;
    padding: 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;

    scroll-view{
      max-height: 60vh;
      .content{
        .row{
          display: flex;
          padding: 16rpx 0;
          font-size: 32rpx;
          line-height: 1.7em;
          .label{
            color: $color_light_gray;
            width: 140rpx;
            text-align: right;
            font-size: 30rpx;
          }
          .value{
            flex: 1;
            width: 0;
          }
          .rateBox{
            display: flex;
            align-items: center;
            .score{
              font-size: 26rpx;
              padding-left: 20rpx;
              color: $color_light_gray;
            }
          }
          .tabs{
            display: flex;
            flex-wrap: wrap;
            .tab{
              border: 1rpx solid $color_theme_green;
              color: $color_theme_green;
              font-size: 22rpx;
              padding: 10rpx 30rpx;
              border-radius: 40rpx;
              line-height: 1em;
              margin: 0 10rpx 10rpx 0;
            }
          }
          .class{
            color: $color_theme_green;
          }
        }
        .copyright{
          font-size: 28rpx;
          padding: 20rpx;
          background: #f6f6f6;
          color: #666;
          border-radius: 10rpx;
          margin: 20rpx 0;
          line-height: 1.6rem;
        }
      }
    }

  }
  .scorePopup{
    background: #fff;
    padding: 30rpx;
    width: 70vw;
    border-radius: 30rpx;
    overflow: hidden;

    .content{
      // 上下30 左右0 用于拉开上下间距
      padding: 30rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .text{
        font-size: 30rpx;
        color: #ffca3e;
        padding-left: 10rpx;
        width: 80rpx;
        line-height: 1em;
        text-align: right;
      }
    }
    .footer{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10rpx 0;
      button{
        width: 80%;
        border-radius: 40rpx;
        // background: $color_theme_green;
        // color: #fff;
      }
    }
  }
}
</style>
