<template>
<view class="userLayout pageBg">

<view class="user-info">
	<view class="avatar">
		<image :src="user.avatar" mode="aspectFill"/>
	</view>
	<view class="ip">100.100.100.100</view>
	<view class="address">来自于：南极</view>
</view>

<!-- 菜单1 -->
<view class="menu">
  <view class="menu-item" v-for="item in 1">
    <view class="row" @click="toWallpaperLst">
			<view class="left">
				<uni-icons type="download-filled" size="20" ></uni-icons>
				<view class="text">我的下载</view>
			</view>
			<view class="right">
				<view class="text">33</view>
				<uni-icons type="right" size="15" color="#999"></uni-icons>
			</view>
		</view>
  </view>
	<view class="menu-item">
    <view class="row" @click="toWallpaperLst">
			<view class="left">
				<uni-icons type="star-filled" size="20" ></uni-icons>
				<view class="text">评分</view>
			</view>
			<view class="right">
				<view class="text">22</view>
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
	<view class="menu-item" v-for="item in 1">
		<view class="row">
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
    <view class="row">
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

</view>
</template>

<script setup>
import { ref } from "vue"

const user = ref({
    avatar: '/static/images/Nahida.jpg',
    nickname: 'aa',
    username: 'Nahida'
})

const clickContact = () => {
		uni.makePhoneCall({
				phoneNumber: '18162711944'
		})
}

const toWallpaperLst = () => {
	uni.navigateTo({
		url: '/pages/wallpaperList/wallpaperList'
	})
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
					}
				}
				.right {
					display: flex;
					align-items: center;
					.text {
						font-size: 32rpx;
						color: #999;
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
}
</style>