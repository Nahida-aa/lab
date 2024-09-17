<template>
<view class="userLayout pageBg">
<!-- 顶部导航栏占位 -->
<view :style="{height:getNavBarHeight()+'px'}"></view>

<view class="user-info">
	<view class="avatar" @click="clickAvatar">
		<image :src="avatarUrl" mode="aspectFill"/>
	</view>
	<view class="ip">{{user.IP}}</view>
	<view class="address">
		来自于：{{ user.address.city || user.address.province || user.address.country || '未知'  }}
	</view>
</view>

<!-- 菜单1 -->
<view class="menu">

  <view class="menu-item" v-for="item in 1" :key="item">
    <view class="row" @click="toWallpaperLst('我的下载','download')">
			<view class="left">
				<uni-icons type="download-filled" size="20" ></uni-icons>
				<view class="text">我的下载</view>
			</view>
			<view class="right">
				<view class="text">{{ downloadCount }}</view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
		</view>
  </view>

	<view class="menu-item">
    <view class="row" @click="toWallpaperLst('我的评分','score')">
			<view class="left">
				<uni-icons type="star-filled" size="20" ></uni-icons>
				<view class="text">我的评分</view>
			</view>
			<view class="right">
				<view class="text">{{ scoreCount }}</view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
		</view>
  </view>

	<view class="menu-item">
    <view class="row">
			<view class="left">
				<uni-icons type="chatboxes-filled" size="20" ></uni-icons>
				<view class="text">联系客服</view>
			</view>
			<view class="right">
				<view class="text"></view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
			<!-- 这个按钮会破坏布局，所以我使用隐形 -->
			<!-- #ifdef MP -->
			<button open-type="contact">联系客服</button>
			<!-- #endif -->
			<!-- 由于h5没有适配联系客服，进行不同平台的条件编译(在h5改成拨打电话) -->
			<!-- #ifdef H5 -->
			<button @click="clickContact">拨打电话</button>
			<!-- #endif -->
		</view>
  </view>
</view>

<!-- 菜单2 -->
<view class="menu">
	<view class="menu-item" v-for="item in 1" :key="item">
		<view class="row" @click="toNewsDetail(2)">
			<view class="left">
				<uni-icons type="notification-filled" size="20" ></uni-icons>
				<view class="text">订阅更新</view>
			</view>
			<view class="right">
				<view class="text"></view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
		</view>
	</view>
	<view class="menu-item">
    <view class="row" @click="toNewsDetail(3)">
			<view class="left">
				<uni-icons type="help-filled" size="20" ></uni-icons>
				<view class="text">常见问题</view>
			</view>
			<view class="right">
				<view class="text"></view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
		</view>
  </view>
</view>

<uni-popup ref="avatarPopup" type="bottom">
	<view class="avatar-sheet">
		<view class="text" @click="uploadAvatar">上传新头像</view>
		<view class="text" @click="clickAvatarCloser">取消</view>
	</view>
</uni-popup>

</view>
</template>

<script setup>
import { ref, computed } from "vue"
import { getNavBarHeight } from '@/utils/system.js'
// if(is_dev) console.log('getNavBarHeight', getNavBarHeight())
import { apiUserInfo } from '@/api/apis.js'
import {baseURL,defaultAvatar,is_dev} from '@/config/index.js'
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const scoreCount = computed(() => userStore.score_count)
const downloadCount = computed(() => userStore.download_count)

const user = ref({
    avatar: '',
    nickname: '',
    username: '',
		address: {},
})

const avatarUrl = computed( () => {
	if (!user.value.avatar) {
    return defaultAvatar;
  }
	return user.value.avatar
})

const getUserInfo = ()=>{
	apiUserInfo().then(res_json=>{
		if(is_dev) console.log('getUserInfo:', res_json)
		// user.value = res_json.data
		Object.assign(user.value, res_json.data)
		userStore.updateScoreCount(user.value.score_count)
		userStore.updateDownloadCount(user.value.download_count)
		downloadCount.value = userStore.download_count
		scoreCount.value = userStore.score_count
		if(is_dev) console.log('user:', user.value)
	})
}
getUserInfo()

const clickContact = () => {
	uni.makePhoneCall({
		phoneNumber: '18162711944'
	})
}

const toWallpaperLst = (name, type) => {
	if(is_dev) console.log('toWallpaperLst:', name, type)
	uni.navigateTo({
		url: '/pages/wallpaperList/wallpaperList?name='+name+'&type='+type
	})
}

const toNewsDetail = (id) => {
	if(is_dev) console.log('toNewsDetail:', id)
	uni.navigateTo({
		url: '/pages/notice/detail?id='+id
	})
}

const avatarPopup = ref(null)
const clickAvatar = () => {
	avatarPopup.value.open()
}
const uploadAvatar = () => {
	avatarPopup.value.close()
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			if(is_dev) console.log('chooseImage:', res)
			const tempFilePath = res.tempFilePaths[0];
			const fileName = res.tempFiles[0].name;
			// const localFilePath = res.tempFiles[0].path;
			// let file = res.tempFiles[0].path;
			if(is_dev) console.log('tempFilePath:', tempFilePath)
			if(is_dev) console.log('fileName:', fileName)
			// if (tempFilePath.startsWith('blob')) {
			// 	const fs = uni.getFileSystemManager()
			// 	fs.saveFile({
			// 		tempFilePath,
			// 		success: (res) => {
			// 			if(is_dev) console.log('saveFile:', res)
			// 			localFilePath = res.savedFilePath
			// 		}
			// 	})
				// fetch(tempFilePath)
				// .then(res => res.blob())
				// .then(blob => {
				// 		file = new File([blob], 'upload.jpg', { type: blob.type });
				// 		if(is_dev) console.log('file:', file)
				// })
			// }
			// 上传文件到服务器
			uni.uploadFile({
				url: baseURL+'/api/wallpaper/user-avatar/upload_avatar/', 
				filePath: tempFilePath,
				name: 'file',  // request body formData key: value[binary]
				// header: {  // uni会自己处理，不用设置 'Content-Type'
				// 	'Content-Type': 'multipart/form-data' // 设置 boundary
				// 	// 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' // 设置 boundary
				// },
				// formData: {
				// 	'fileName': fileName
				// },
				success: (uploadFileRes) => {
					const data = JSON.parse(uploadFileRes.data);
					if(is_dev) console.log('uploadFile:', data)
					if (data.errCode == 0) {
						// 更新用户头像
						user.avatar = data.url;
						uni.showToast({
							title: '头像上传成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: data.errMsg,
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					if(is_dev) console.log('因网络上传失败', err);
					uni.showToast({
						title: '因网络上传失败',
						icon: 'none'
					})
				}
			})
		}
	})
}
const clickAvatarCloser = () => {
	avatarPopup.value.close()
}
</script>

<style scoped lang="scss">
.userLayout {
	.user-info {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 50rpx 0;
		.avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}   
		}
		.ip {
			font-size: 44rpx;
			color: #333;
			margin: 20rpx 0 5rpx;
		}
		.address {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #aaa;
		}
	}

	.menu {
		width: 690rpx;
		margin: 50rpx auto;
		// 阴影边框
		border: 1px solid #f9f9f9;
		border-radius: 10rpx;
		box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.1);
		.menu-item {
			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:0 30rpx;
				height: 100rpx;
				border-bottom: 1px solid #f9f9f9;
				// 防止增加的button破坏布局
				position: relative;
				// 最后一个不显示下边框
				&:last-child {
					border-bottom: none;
				}
				.left {
					display: flex;
					align-items: center;
					:deep(){
						.uni-icons {
							color: $color_theme_green !important;
						}
					}
					.text {
						margin-left: 20rpx;
						font-size: 32rpx;
						color: #666;
						display: flex;
						align-items: center;
						text-align: center;
					}
				}
				.right {
					display: flex;
					align-items: center;
					.text {
						font-size: 32rpx;
						color: #999;
						display: flex;
						align-items: center;
						text-align: center;
					}
					uni-icons{
						// 上下居中
						display: flex;
						align-items: center;
					}
				}
				button{
					position: absolute;
					top: 0;
					right: 0;
					width: 100%;
					height: 100%;
					// 完全覆盖row后进行100%透明
					opacity: 0;
				}
			}
		}
	}
	.avatar-sheet {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		position: absolute;
		width: 100%;
		bottom:var(--window-bottom);

		// 圆角 ---
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
		// 防止子元素溢出
		overflow: hidden;
		// ---
		.text {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100rpx;
			font-size: 32rpx;
			color: #333;
			background-color: #f9f9f9;
			border-bottom: 1px solid #d0cccc;
			&:last-child {
				border-bottom: none;
			}
		}
	}
}
</style>