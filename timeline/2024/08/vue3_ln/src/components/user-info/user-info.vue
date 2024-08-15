<template>
  <view class="userinfo">
    <image
      :src="user.avatar"
      mode="aspectFit"
      class="avatar"
    />
    <view class="text-info">
      <text class="nickname">{{ user.nickname }}</text>
      <text class="username">{{ user.username }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
	user: {
		type: Object,
		default() {
			return {
				avatar: '',
				nickname: '',
				username: ''
			}
		}
	}
})
console.log('props:',props)
</script>

<style lang="scss" scoped>
.userinfo {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}

.text-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 18px;
	// 加粗
	font-weight: 600;
  color: #333;
}
.username {
  font-size: 16px;
  color: #666;
  margin-bottom: 4px; /* 添加一点间距，区分名字和用户名 */
}
</style>