# cc-downloadDialog


#### 使用方法 
```使用方法
<!-- show：是否显示 peanNum：获取的积分/豆数量 type:类型 word：按钮文字 money：金额 @close：关闭弹框事件  -->
<cc-downloadDialog :show="show" :peanNum="20" :type="1" word="去App领取" :money="0.6"
@close="closeDiologClick"></cc-downloadDialog>
				
```

#### HTML代码实现部分
```html
<template>
	<view class="content">

		<view style="height: 52px;"></view>

		<button @click="openDiologClick">显示积分弹框</button>

		<!-- show：是否显示 peanNum：获取的积分/豆数量 type:类型 word：按钮文字 money：金额 @close：关闭弹框事件  -->
		<cc-downloadDialog :show="show" :peanNum="20" :type="1" word="去App领取" :money="0.6"
			@close="closeDiologClick"></cc-downloadDialog>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		onLoad() {

		},
		methods: {

			// 打开弹框
			openDiologClick() {

				this.show = true;
			},
			// 关闭弹框
			closeDiologClick() {

				this.show = false;
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;

	}
</style>



```
