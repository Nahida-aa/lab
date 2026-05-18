
<script setup>
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
  // uni.setTabBarBadge({
  //   index: 1,
  //   text: '33'
  // })
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "./common/css/style.css";
@import "./common/scss/self.scss";
view, swiper, swiper-item  {
  // 让边距和内边距不影响盒子的大小，即向内计算边距
	box-sizing: border-box;
}
// view {
//   font-size: 40rpx;
// }
</style>
