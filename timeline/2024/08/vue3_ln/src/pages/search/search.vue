<template>
	<view class="searchLayout">
		<view class="search">
			<uni-search-bar 
        @confirm="onSearch"
        @cancel="onClear"
        @clear="onClear"
        focus 
        placeholder="搜索"
        v-model="queryParams.keyword">
			</uni-search-bar>
		</view>
		
		
		<view v-if="!wallList.length || noSearch">
			<view class="history" v-if="historySearch.length">
				<view class="topTitle">
					<view class="text">最近搜索</view>
					<view class="icon" @click="removeHistory">
						<uni-icons type="trash" size="25"></uni-icons>
					</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>		
				</view>
			</view>
			
			<view class="recommend">
				<view class="topTitle">
					<view class="text">热门搜索</view>				
				</view>
				<view class="tabs">				
					<view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>
		</view>
		
		
		<view class="noSearch" v-if="noSearch">
			<uv-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></uv-empty>
		</view>
		
		
		<view v-else>
			<view class="list">
				<navigator :url="`/pages/preview/preview?id=${item._id}`"  class="item" 
					v-for="item in wallList" :key="item._id">				
					<image :src="item.small_url" mode="aspectFill"></image>				
				</navigator>
			</view>		
			<view class="loadingLayout" v-if="noData || wallList.length">
				<uni-load-more :status="noData?'noMore':'loading'"/>
			</view>
		</view>
		
		
	</view>
</template>

<script setup>
import {ref} from "vue";
import {onLoad,onUnload,onReachBottom} from "@dcloudio/uni-app";
import { apiSearch } from "@/api/apis.js";
import {is_dev} from '@/config/index.js'

//查询参数
const queryParams = ref({	
	page:1,
	page_size:12,
	keyword:""
})

//搜索历史词
const historySearch = ref(uni.getStorageSync("historySearch") || []);

//热门搜索词
const recommendList = ref(["美女","帅哥","宠物","卡通"]);

//没有更多
const noData = ref(false)
//没有搜索结果
const noSearch = ref(false)

//搜索结果列表
const wallList = ref([])

//点击搜索
const onSearch = ()=>{
	// if 纯空格
	if (!queryParams.value.keyword.trim()) return
	if(is_dev) console.log("搜索param",queryParams.value);
	// 去除左右空格
	const trimmedKeyword = queryParams.value.keyword.trim();
	uni.showLoading()
	// if(is_dev) console.log("追加前搜索历史",historySearch.value);
	// 追加到首位 and 去重 and 截取前10个
	historySearch.value = [...new Set([trimmedKeyword,...historySearch.value])].slice(0,10);

	uni.setStorageSync("historySearch",historySearch.value)
	// if(is_dev) console.log("追加后搜索历史",historySearch.value);
	initParams()
	getSearchList()
}

//点击清除搜索框按钮
const onClear = ()=>{
	initParams()
}

//点击标签进行搜索
const clickTab = (value)=>{
	initParams()
	queryParams.value.keyword = value
	onSearch()
}

//点击清空搜索记录
const removeHistory = ()=>{
	uni.showModal({
		title:"是否清空历史搜索？",
		success:res=>{
			if(res.confirm){
				if(is_dev) console.log("确认删除")
				uni.removeStorageSync("historySearch")
				historySearch.value = []
			}
		}
	})
}
//点击预览
// const toPreview = (id)=>{
// 	uni.navigateTo({
// 		url:`/pages/preview/preview?id=${id}`
// 	})
// 	// uni.setStorageSync("storeWallList", wallList.value)
// }

const getSearchList = async()=>{
	try{
		let res_json = await apiSearch(queryParams.value)
		if(is_dev) console.log("搜索结果",res_json)
		// 追加到列表
		wallList.value = [...wallList.value,...res_json.data]
		if (!res_json.next) noData.value = true
		if (res_json.count == 0) noSearch.value = true
		uni.setStorageSync("storeWallList", wallList.value)
		if(is_dev) console.log("搜索结果列表",wallList.value)
	}finally{
		uni.hideLoading()
	}
}

const initParams = ()=>{
	queryParams.value.page = 1
	wallList.value = []
	noData.value = false
	noSearch.value = false
}

//触底加载更多
onReachBottom(()=>{
	if (noData.value) return
	queryParams.value.page++
	getSearchList()
})

//关闭有页面
onUnload(()=>{
})
</script>

<style lang="scss" scoped>
.searchLayout{
	.search{
		padding:0 10rpx;
	}
	.topTitle{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color:#999;
	}
	.history{
		padding:30rpx;		
	}
	.recommend{
		padding:30rpx;
	}
	.tabs{
		display: flex;		
		align-items: center;
		flex-wrap: wrap;
		padding-top:20rpx;
		.tab{
			background: #F4F4F4;
			font-size: 28rpx;
			color:#333;
			padding:10rpx 28rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}
	}	
	.list{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 5rpx;
		padding:20rpx 5rpx;		
		.item{
			height: 440rpx;
			image{
				width: 100%;
				height: 100%;
				display: block;
			}			
		}		
	}
}
</style>
