<template>
	<view class="wen-home">
		<image class="wen-bg" src="@/static/images/wentibg.png"></image>
		<view class="wen-box">
			<view class="boxtitle1">
				<view class="slicon"></view>
				<text>{{dataObj.title}}</text>
				<view class="sricon"></view>
			</view>
			<view class="boxtitle2" v-if="dataObj.desc" v-html="dataObj.desc"></view>
			<view class="wentibox-c">
				<text class="title" v-if="dataObj.desc">{{dataObj.titleF}}</text>
				<view class="progressbox" v-if="dataObj.titleF == '开始答题'">{{comnum}}/<span>{{totalnum}}</span></view>
			</view>
			<view class="itembox" v-for="(item,index) in questionsAnswer" :key="index">
				<view v-if="dataObj.ruleFlag">
					<!-- 单选题规则说明 -->
					<view class="rule-tip" v-if="firstIndexOfType['SINGLE'] === index">
						<view class="rule-content">一、单项选择题(下列各题中只有一个正确的答案，请将它的代码选出填涂在答题卡上。
							共 30 小题，每小题 1.8 分，共 54 分。)</view>
					</view>

					<!-- 多选题规则说明 -->
					<view class="rule-tip" v-if="firstIndexOfType['MULTY'] === index">
						<view class="rule-content">二、多项选择题(下列各题中都有两个或两个以上的正确答案，只有将它们全部选出，
							涂在答题卡上，而不错选漏选，方能得分。共 10 题，每题 2.1 分，共 21 分。)</view>
					</view>

					<view class="rule-tip" v-if="firstIndexOfType['SELECT'] === index">
						<view class="rule-content">三、判断题(对下列命题作出判断,正确的在答题卡上相应题号后涂“A”,错误的涂“B”
							全部涂“A”或"B”,均计为 0 分。共 25 题，每题 1 分,共 25 分）</view>
					</view>

					<!-- 简答题规则说明 -->
					<view class="rule-tip" v-if="firstIndexOfType['QUESTION'] === index">
						<view class="rule-content">请在下方文本框中输入您的答案，字数不限。</view>
					</view>
				</view>

				<view class="boxtitle">
					<text class="textl">{{index+1}}、</text>
					<text class="textr">{{item.title}}</text>
				</view>
				<view v-if="item.questionType == 'SINGLE' || item.questionType == 'SELECT' ">

					<view class="boxbody" v-for="(items,idxs) in item.children" :key="idxs">
						<view class="chooseitem" @click="singChoose(index,idxs)">
							<view class="bodyl" v-if="dataObj.titleF == '开始答题'">
								<image class="sinchoose-on" v-if="items.state == 1" src="@/static/images/single.png"
									mode=""></image>
								<view class="sinchoose" v-else></view>
							</view>
							<view class="bodyr">{{items.serial}}、{{items.content}} <uni-icons color="red"
									type="checkmarkempty" size="25"
									v-if="dataObj.titleF == '正确答案' && items.isCorrect == '是'"></uni-icons></view>
						</view>
					</view>
					<view v-if="dataObj.titleF == '正确答案'">

						<view class="boxbody" v-for="(itemsRe,idxsRe) in item.childrenRecord" :key="idxsRe">
							<view class="chooseitem">
								<view class="bodyr" style="color: #0081ff;">您选择的:{{itemsRe.serial}}
								</view>
							</view>
						</view>
					</view>

				</view>
				<view v-if="item.questionType == 'MULTY'">
					<view class="boxbody" v-for="(self,idxm) in item.children" :key="idxm">
						<view class="chooseitem" @click="multyChoose(index,idxm)">
							<view class="bodyl" v-if="dataObj.titleF == '开始答题'">
								<image class="manychoose-on" v-if="self.state == 1" src="../../static/many.png" mode="">
								</image>
								<view class="manychoose" v-else></view>
							</view>
							<view class="bodyr">{{self.serial}}、{{self.content}} <uni-icons color="red"
									type="checkmarkempty" size="25"
									v-if="dataObj.titleF == '正确答案' && self.isCorrect == '是'"></uni-icons></view>
						</view>
					</view>
					<view v-if="dataObj.titleF == '正确答案'">

						<view class="boxbody" v-for="(selfsRe,idxsRe) in item.childrenRecord" :key="idxsRe">
							<view class="chooseitem">
								<view class="bodyr" style="color: #0081ff;">您选择的:{{selfsRe.serial}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="writeitem" v-if="item.questionType == 'QUESTION'">
					<textarea v-model="item.children[0]" @input="bindTextAreaBlur(index)" auto-height
						maxlength="1000" />
				</view>
			</view>
			<view class="sumitbtn" @click="submitData" v-if="dataObj.titleF == '开始答题'">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataObj: {},
				totalnum: 0,
				comnum: 0,
				questionsAnswer: [], //问卷问题列表数据
				formSubmitData: [], //答题完成的数据
			};
		},
		computed: {
			firstIndexOfType() {
				// 返回 { SINGLE: 2, MULTY: 5, QUESTION: 8 } 这样的对象
				const result = {};
				this.questionsAnswer.forEach((item, idx) => {
					if (result[item.questionType] === undefined) {
						result[item.questionType] = idx;
					}
				});
				return result;
			}
		},
		methods: {
			//初始化数据结构
			initObj(obj) {
				this.dataObj = obj
				this.questionsAnswer = this.dataObj.questions
				this.totalnum = this.dataObj.number
				for (var i = 0; i < this.totalnum; i++) {
					let arr = {
						questionType: this.questionsAnswer[i].questionType, //每个问题类型(单选:SINGLE  多选:MULTY  简答:QUESTION)
						questionId: this.questionsAnswer[i].questionId, //每个问题ID
						userAnswer: '', //每个问题用户选择的答案(逗号拼接)
					}
					this.formSubmitData.push(arr)
				}
			},
			//单选题
			singChoose(j, e) {
				if (this.questionsAnswer[j].children[e].state == 1) {
					this.questionsAnswer[j].children[e].state = 0
					this.formSubmitData[j].userAnswer = ''
				} else {
					this.questionsAnswer[j].children.forEach(res => {
						if (res.state == 1) res.state = 0
					})
					this.questionsAnswer[j].children[e].state = 1
					this.formSubmitData[j].userAnswer = this.questionsAnswer[j].children[e].id
				}
				this.countNum()
			},
			//多选题
			multyChoose(j, e) {
				this.questionsAnswer[j].children[e].state = this.questionsAnswer[j].children[e].state ^ 1
				let obj = []
				this.questionsAnswer[j].children.forEach(res => {
					if (res.state == 1) obj.push(res.id)
				})
				this.formSubmitData[j].userAnswer = obj.toString()
				this.countNum()
			},
			//简答题
			bindTextAreaBlur(index) {
				this.formSubmitData[index].userAnswer = this.questionsAnswer[index].children[0]
				this.countNum()
			},
			//计算已答题目数量
			countNum() {
				this.comnum = 0
				this.formSubmitData.forEach(res => {
					if (res.userAnswer) this.comnum += 1
				})
			},
			//问卷结果提交
			submitData() {
				let num = ''
				for (var i = 0; i < this.formSubmitData.length; i++) {
					if (!this.formSubmitData[i].userAnswer) {
						num = i + 1
						break
					}
				}
				console.log('==========:' + JSON.stringify(this.formSubmitData))
				if (num) {
					uni.showToast({
						title: '请完成第' + num + '题',
						icon: 'none'
					})
					return
				}
				let obj = {
					pkId: this.dataObj.pkId, //问卷Id,
					userAnswerList: this.formSubmitData //用户答案
				}
				this.$emit('submit', obj)
			},
		}
	};
</script>

<style lang="scss" scoped>
	.wen-home {
		width: 100%;
		height: 100%;
		background-color: #4098FF !important;
		padding: 120rpx 32rpx 30rpx 32rpx;
		box-sizing: border-box;

		.wen-bg {
			width: 100%;
			height: 280rpx;
		}

		.wen-box {
			margin-top: -24rpx;
			padding: 32rpx 24rpx 10rpx;
			background: #FFFFFF;

			.boxtitle1 {
				font-size: 32rpx;
				color: #2175FF;
				line-height: 48rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;

				.slicon,
				.sricon {
					width: 50rpx;
					height: 34rpx;
				}

				.slicon {
					background: linear-gradient(90deg, #BDE9FF 0%, #ffffff 100%);
				}

				.sricon {
					background: linear-gradient(270deg, #BDE9FF 0%, #ffffff 100%);
				}
			}

			.boxtitle2 {
				white-space: pre-line;
				margin-top: 32rpx;
				padding: 12rpx 20rpx;
				background: #F7FBFF;
				border-radius: 6rpx;
				border: solid #BBD5FF 1px;
				font-size: 28rpx;
				color: #666666;
				line-height: 38rpx;
				text-indent: 56rpx;
				text-align: justify;
			}

			.wentibox-c {
				text-align: center;
				margin: 36rpx 0 16rpx 0;

				.title {
					font-size: 32rpx;
					color: #2175FF;
					line-height: 48rpx;
				}

				.progressbox {
					font-size: 30rpx;
					text-align: right;
					color: #2175FF;

					span {
						color: #333333;
					}
				}
			}


			.itembox {
				font-size: 30rpx;
				color: #333333;

				.rule-tip {
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					padding: 12rpx 20rpx;
					background: #F7FBFF;
					border-radius: 6rpx;
					border: solid #BBD5FF 1px;
					font-size: 28rpx;
					color: #666666;
					line-height: 38rpx;
					text-indent: 56rpx;
					text-align: justify;
				}

				.rule-title {
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.rule-content {
					text-indent: 0;
				}

				.boxtitle {
					.textl {
						width: 50rpx;
						height: 34rpx;
						background: linear-gradient(90deg, #BDE9FF 0%, #ffffff 100%);
					}
				}

				.boxbody {
					padding-left: 40rpx;
					line-height: 64rpx;
					margin: 16rpx 0;
				}

				.chooseitem {
					display: flex;
					align-items: center;

					.bodyl {
						margin-right: 16rpx;

						.sinchoose {
							width: 28rpx;
							height: 28rpx;
							border-radius: 50%;
							background: #FFFFFF;
							border: 2rpx solid #BFBDBD;
						}

						.sinchoose-on {
							width: 32rpx;
							height: 32rpx;
						}

						.manychoose {
							width: 28rpx;
							height: 28rpx;
							background: #FFFFFF;
							border: 2rpx solid #BFBDBD;
						}

						.manychoose-on {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}

				.writeitem textarea {
					min-height: 164rpx;
					margin: 24rpx auto;
					padding: 16rpx;
					border: 2rpx solid #EBEBEB;
					border-radius: 4px;
				}
			}

			.sumitbtn {
				width: 50%;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #2178FF 100%, #BDE9FF 0%);
				font-size: 32rpx;
				color: #FFFFFF;
				margin: 48rpx auto 48rpx auto;
			}
		}
	}
</style>