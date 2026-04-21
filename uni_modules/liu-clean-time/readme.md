### liu-clean-time适用于uni-app项目的问卷调查模版，包含单选、多选、简答题(超级好用)
### 本组件目前兼容微信小程序、H5
### 本组件是超级好用、超级好看的问卷调查模版，包含单选、多选、简答题，支持样式自定义，源码简单易修改
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用示例
``` 
<template>
	<view class="page-main">
		<liu-clean-time ref="liuCleanTime" @submit="submit"></liu-clean-time>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataObj: {
					pkId: '1', //问卷ID
					title: '问卷调查标题', //问卷标题
					desc: '描述：超级好用的问卷调查模版，更多组件请访问：https://ext.dcloud.net.cn/publisher?id=54309&type=UpdatedDate', //问卷描述
					number: 3, //问卷总题目数量
					questions: [{
						questionId: '11',
						questionType: 'SINGLE',
						title: '这是一个单选题？',
						children: [{
							id: '111',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'A', //选项序号
							content: '单选第一个选项' //选项内容
						}, {
							id: '222',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'B', //选项序号
							content: '单选第二个选项' //选项内容
						}, {
							id: '333',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'C', //选项序号
							content: '单选第三个选项' //选项内容
						}]
					}, {
						questionId: '22',
						questionType: 'MULTY',
						title: '这是一个多选题？',
						children: [{
							id: '111',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'A', //选项序号
							content: '多选第一个选项' //选项内容
						}, {
							id: '222',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'B', //选项序号
							content: '多选第二个选项' //选项内容
						}, {
							id: '333',
							state: 0, //是否选中(0未选中；1:已选中)
							serial: 'C', //选项序号
							content: '多选第三个选项' //选项内容
						}]
					}, {
						questionId: '33',
						questionType: 'QUESTION',
						title: '这个是简答题？',
						children: []
					}]
				},
			}
		},
		mounted() {
			this.$nextTick(res => {
				this.init()
			})
		},
		methods: {
			//问卷初始化
			init() {
				this.$refs.liuCleanTime.initObj(this.dataObj)
			},
			//提交回调
			submit(e) {
				console.log('提交回调信息：' + JSON.stringify(e))
			}
		}
	}
</script>
```

### 属性说明
| 事件                         | 类型            | 描述             |
| ----------------------------|---------------  | ---------------|
| @submit                     | Function        |问卷答案提交回调事件

