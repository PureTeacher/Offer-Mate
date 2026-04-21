<template>
  <view :class="['test-page', containerClasses]" :style="{'--theme-color': themeColor}">
    <!-- 顶部导航 -->
  

    <!-- 顶部进度条 -->
    <view class="progress-container">
      <text class="progress-text">第 {{currentIndex+1}}/{{questions.length}} 题</text>
      <progress 
        :percent="progress" 
        activeColor="var(--theme-color)"
        backgroundColor="#EBEDF0"
        stroke-width="12"
        class="progress-bar"
      />
    </view>

    <!-- 题目卡片 -->
    <view class="question-card">
      <view class="card-header">
        <view class="question-type-tag" :style="{background: typeTag.color}">
          <image :src="typeTag.icon" class="type-icon"/>
          <text>{{typeTag.text}}</text>
        </view>
        <view class="question-number">Q{{currentIndex+1}}</view>
      </view>
      
      <scroll-view scroll-y class="question-content">
        <text class="question-text">{{currentQuestion.text}}</text>
        <text class="question-tip">请根据最近两周的情况选择</text>
      </scroll-view>
    </view>

    <!-- 选项列表 -->
    <view class="options-container">
      <view 
        v-for="(option, index) in currentQuestion.options" 
        :key="index"
        class="option-card"
        :class="{selected: selectedOption === index}"
        @click="selectOption(index)"
        :style="getOptionStyle(index)"
      >
        <view class="option-selector">
          <view class="selector-outer">
            <view class="selector-inner" v-if="selectedOption === index"/>
          </view>
        </view>
        <view class="option-content">
          <text class="option-text">{{option.text}}</text>
          <text class="option-desc" v-if="option.desc">{{option.desc}}</text>
        </view>
        <image 
          src="/static/icons/check-circle.png" 
          class="option-check"
          v-if="selectedOption === index"
        />
      </view>
    </view>

    <!-- 导航按钮 -->
    <view class="navigation-buttons">
      <button 
        class="nav-button prev-button"
        :class="{disabled: currentIndex === 0}"
        @click="prevQuestion"
		 
      >
        <!-- <image src="/static/icons/arrow-left.png" class="button-icon"/> -->
		<!-- <uni-icons type="arrow-left" size="30" style="margin-right: 20rpx;"></uni-icons> -->
        上一题
      </button>
      <button 
        class="nav-button next-button"
        :class="{disabled: selectedOption === null}"
        @click="nextQuestion"
      >
        {{ isLastQuestion ? '查看结果' : '下一题' }}
<!-- 		<uni-icons type="arrow-right" size="30" style="margin-left: 20rpx;"></uni-icons> -->

        <!-- <image src="/static/icons/arrow-right.png" class="button-icon"/> -->
      </button>
    </view>

    <!-- 鼓励反馈 -->
    <view class="encouragement-feedback" v-if="showEncouragement">
      <image :src="encouragement.emoji" class="encouragement-emoji"/>
      <text class="encouragement-text">{{encouragement.text}}</text>
    </view>

    <!-- 结果弹窗 -->
    <view class="result-modal" v-if="showResult" @click="closeResult">
      <view class="result-content" @click.stop>
        <view class="result-header">
          <text class="result-title">测试结果</text>
          <view class="close-btn" @click="closeResult">×</view>
        </view>
        
        <view class="result-body">
          <view class="score-section">
            <text class="score-label">总分</text>
            <text class="score-value">{{resultData.totalScore}}分</text>
          </view>
          
          <view class="level-section">
            <text class="level-label">焦虑程度</text>
            <text class="level-value" :class="getLevelClass(resultData.anxietyLevel)">{{resultData.anxietyLevel}}</text>
          </view>
          
          <view class="description-section">
            <text class="description-text">{{resultData.levelDescription}}</text>
          </view>
          
          <view class="suggestion-section">
            <text class="suggestion-label">建议</text>
            <text class="suggestion-text">{{resultData.suggestion}}</text>
          </view>
        </view>
        
        <view class="result-footer">
          <button class="result-btn primary" @click="restartTest">重新测试</button>
          <button class="result-btn secondary" @click="closeResult">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { savePhq9Result } from '@/api/questionnaire'

export default {
  data() {
    return {
      themeColor: '#FFA500', // 主色调 - 橙色代表焦虑评估
	  answers: [],  // 初始化空数组
      questions: [
        {
          id: 1,
          type: 'anxiety',
          text: "感觉紧张、焦虑或烦躁",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 2,
          type: 'anxiety',
          text: "不能停止或控制担忧",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 3,
          type: 'anxiety',
          text: "对各种各样的事情担忧过多",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 4,
          type: 'anxiety',
          text: "很难放松下来",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 5,
          type: 'anxiety',
          text: "由于不安而无法静坐",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 6,
          type: 'anxiety',
          text: "变得容易烦恼或急躁",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        },
        {
          id: 7,
          type: 'anxiety',
          text: "害怕将有可怕的事发生",
          options: [
            { text: "完全不会", desc: "0分", score: 0 },
            { text: "几天", desc: "1分", score: 1 },
            { text: "一半以上的日子", desc: "2分", score: 2 },
            { text: "几乎每天", desc: "3分", score: 3 }
          ]
        }
      ],
      currentIndex: 0,
      selectedOption: null,
      showEncouragement: false,
      encouragement: {
        emoji: '',
        text: ''
      },
      encouragements: [
        { emoji: '/static/emojis/star.png', text: '你的回答很有价值！' },
        { emoji: '/static/emojis/heart.png', text: '感谢你的真诚回答' },
        { emoji: '/static/emojis/lightbulb.png', text: '自我觉察是成长的第一步' }
      ],
      showResult: false,
      resultData: {
        totalScore: 0,
        anxietyLevel: '',
        levelDescription: '',
        suggestion: ''
      }
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex]
    },
    progress() {
      return Math.round((this.currentIndex / this.questions.length) * 100)
    },
    isLastQuestion() {
      return this.currentIndex === this.questions.length - 1
    },
    typeTag() {
      const types = {
        mood: { text: '情绪评估', color: '#FF6B81', icon: '/static/icons/mood.png' },
        anxiety: { text: '焦虑评估', color: '#FFA500', icon: '/static/icons/anxiety.png' },
        // 更多类型...
      }
      return types[this.currentQuestion.type] || { text: '心理测评', color: this.themeColor, icon: '/static/icons/psychology.png' }
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    selectOption(index) {
      this.selectedOption = index
      // 记录当前题目的答案
      this.answers[this.currentIndex] = {
        questionId: this.currentQuestion.id,
        score: this.currentQuestion.options[index].score
      }
      console.log("当前答案:", this.answers)
      this.showRandomEncouragement()
      uni.vibrateShort() // 触觉反馈
    },
    showRandomEncouragement() {
      if (Math.random() > 0.7) {
        this.encouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)]
        this.showEncouragement = true
        setTimeout(() => {
          this.showEncouragement = false
        }, 1500)
      }
    },
    nextQuestion() {
      if (this.selectedOption === null) return
      
      if (this.isLastQuestion) {
        this.submitTest()
        return
      }
      
      this.currentIndex++
      // 检查下一题是否已有答案，需要找到对应的选项索引
      const nextAnswer = this.answers[this.currentIndex]
      if (nextAnswer) {
        // 根据分数找到对应的选项索引
        this.selectedOption = this.currentQuestion.options.findIndex(option => option.score === nextAnswer.score)
      } else {
        this.selectedOption = null
      }
      this.scrollToTop()
    },
    prevQuestion() {
      if (this.currentIndex <= 0) return
      
      this.currentIndex--
      // 检查上一题是否已有答案，需要找到对应的选项索引
      const prevAnswer = this.answers[this.currentIndex]
      if (prevAnswer) {
        // 根据分数找到对应的选项索引
        this.selectedOption = this.currentQuestion.options.findIndex(option => option.score === prevAnswer.score)
      } else {
        this.selectedOption = null
      }
      this.scrollToTop()
    },
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    submitTest() {
      // 计算总分
      const totalScore = this.answers.reduce((sum, a) => sum + (a ? a.score : 0), 0)
      
      // 根据GAD-7标准判断焦虑程度
      let anxietyLevel = ''
      let levelDescription = ''
      let suggestion = ''
      
      if (totalScore >= 0 && totalScore <= 4) {
        anxietyLevel = '无明显焦虑症状'
        levelDescription = '您的心理健康状况良好，没有明显的焦虑症状，属于正常范围。'
        suggestion = '继续保持良好的生活习惯，定期关注自己的心理健康。'
      } else if (totalScore >= 5 && totalScore <= 9) {
        anxietyLevel = '轻度焦虑'
        levelDescription = '您可能有一些轻微的焦虑症状，可能对日常生活有一定影响，但通常可以应对。'
        suggestion = '建议多参与放松活动，保持规律作息，学习一些放松技巧，如症状持续可考虑寻求专业帮助。'
      } else if (totalScore >= 10 && totalScore <= 14) {
        anxietyLevel = '中度焦虑'
        levelDescription = '您有明显的焦虑症状，对日常生活和社交活动有明显影响，可能需要进一步关注和干预。'
        suggestion = '建议尽快咨询心理医生或精神科医生，制定合适的治疗方案，学习焦虑管理技巧。'
      } else if (totalScore >= 15 && totalScore <= 21) {
        anxietyLevel = '重度焦虑'
        levelDescription = '您的焦虑症状非常严重，严重影响日常生活、工作和社交功能，建议寻求专业帮助。'
        suggestion = '请立即联系专业心理医生或精神科医生，制定综合治疗方案，必要时可考虑药物治疗。'
      }
      
      // 设置结果数据并显示弹窗
      this.resultData = {
        totalScore,
        anxietyLevel,
        levelDescription,
        suggestion
      }
      this.showResult = true
      
      // 保存测试结果到数据库
      this.saveTestResultToDatabase()
    },
    getOptionStyle(index) {
      if (this.selectedOption === index) {
        return {
          borderColor: this.typeTag.color,
          backgroundColor: this.hexToRgba(this.typeTag.color, 0.08)
        }
      }
      return {}
    },
hexToRgba(hex, opacity) {
  // 移除#号并解析RGB值
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
},
closeResult() {
  this.showResult = false
  uni.navigateBack({
    delta: 1
  })
},
restartTest() {
  this.showResult = false
  this.currentIndex = 0
  this.selectedOption = null
  this.answers = []
  this.scrollToTop()
},
getLevelClass(level) {
  if (level.includes('无明显焦虑')) return 'level-normal'
  if (level.includes('轻度焦虑')) return 'level-mild'
  if (level.includes('中度焦虑')) return 'level-moderate'
  if (level.includes('重度焦虑')) return 'level-critical'
  return 'level-normal'
},
// 保存测试结果到数据库
async saveTestResultToDatabase() {
  const requestData = {
    questionnaireName: 'GAD-7广泛性焦虑障碍量表',
    questionnaireType: 'mood',
    score: this.resultData.totalScore,
    depressionLevel: this.resultData.anxietyLevel,
    levelDescription: this.resultData.levelDescription,
    resultData: {
      answers: this.answers,
      suggestion: this.resultData.suggestion
    }
  }
  
  console.log('准备保存测试结果:', requestData)
  
  try {
    // 调用后端接口保存数据
    const result = await this.$api.questionnaire.saveResult(requestData)
    
    if (result.code === 200) {
      console.log('保存测试结果成功:', result)
      uni.showToast({
        title: '测试结果已保存',
        icon: 'success',
        duration: 2000
      })
    } else {
      // console.error('保存失败:', result.message)
      // uni.showToast({
      //   title: result.message || '保存失败，请重试',
      //   icon: 'error',
      //   duration: 2000
      // })
    }
  } catch (error) {
    console.error('保存测试结果失败:', error)
    uni.showToast({
      title: '网络错误，请检查网络连接',
      icon: 'error',
      duration: 2000
    })
  }
}
  }
}
</script>

<style lang="scss">
.test-page {
  min-height: 100vh;
  padding: 30rpx;
  padding-bottom: 180rpx;
  background-color: #F8FAFF;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx 20rpx;
  background: white;
  border-bottom: 1rpx solid #e2e8f0;
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .back-arrow {
    font-size: 40rpx;
    margin-right: 20rpx;
    color: #64748b;
  }
  
  .header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1e293b;
  }
}

/* 进度条样式 */
.progress-container {
  margin-bottom: 40rpx;
  
  .progress-text {
    display: block;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 15rpx;
  }
  
  .progress-bar {
    border-radius: 10rpx;
  }
}

/* 题目卡片样式 */
.question-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .question-type-tag {
    display: inline-flex;
    align-items: center;
    padding: 6rpx 20rpx;
    border-radius: 40rpx;
    
    text {
      font-size: 24rpx;
      color: white;
      margin-left: 10rpx;
    }
    
    .type-icon {
      width: 28rpx;
      height: 28rpx;
    }
  }
  
  .question-number {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--theme-color);
  }
  
  .question-content {
    max-height: 40vh;
    
    .question-text {
      font-size: 36rpx;
      font-weight: 500;
      line-height: 1.6;
      color: #333;
    }
    
    .question-tip {
      display: block;
      font-size: 26rpx;
      color: #999;
      margin-top: 20rpx;
    }
  }
}

/* 选项列表样式 */
.options-container {
  .option-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 20rpx;
    border: 2rpx solid #F1F3F6;
    transition: all 0.3s ease;
    
    &.selected {
      border-color: var(--theme-color);
      transform: translateY(-4rpx);
      box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .option-selector {
    margin-right: 20rpx;
    
    .selector-outer {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .selector-inner {
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      background: var(--theme-color);
    }
  }
  
  .option-content {
    flex: 1;
    
    .option-text {
      font-size: 30rpx;
      color: #333;
    }
    
    .option-desc {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
    }
  }
  
  .option-check {
    width: 36rpx;
    height: 36rpx;
    margin-left: 15rpx;
  }
}

/* 导航按钮样式 */
.navigation-buttons {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  display: flex;
  justify-content: space-between;
  
  .nav-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    border-radius: 45rpx;
    font-size: 30rpx;
    transition: all 0.3s;
	
    
    &.disabled {
      opacity: 0.5;
    }
    
    .button-icon {
      width: 30rpx;
      height: 30rpx;
    }
  }
  
  .prev-button {
    background: white;
    color: var(--theme-color);
    border: 1rpx solid var(--theme-color);
    margin-right: 20rpx;
    
    .button-icon {
      margin-right: 10rpx;
    }
  }
  
  .next-button {
    background: var(--theme-color);
    color: white;
    
    .button-icon {
      margin-left: 10rpx;
    }
  }
}

/* 鼓励反馈样式 */
.encouragement-feedback {
  position: fixed;
  bottom: 160rpx;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInUp 0.5s;
  
  .encouragement-emoji {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 15rpx;
  }
  
  .encouragement-text {
    background: white;
    padding: 12rpx 30rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: var(--theme-color);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 结果弹窗样式 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
  animation: fadeIn 0.3s ease;
}

.result-content {
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .result-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
  }
  
  .close-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #999;
    font-weight: 300;
  }
}

.result-body {
  padding: 40rpx;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: 0;
}

.score-section {
  text-align: center;
  margin-bottom: 40rpx;
  
  .score-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .score-value {
    font-size: 60rpx;
    font-weight: 700;
    color: var(--theme-color);
  }
}

.level-section {
  text-align: center;
  margin-bottom: 30rpx;
  
  .level-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .level-value {
    font-size: 32rpx;
    font-weight: 600;
    padding: 12rpx 24rpx;
    border-radius: 20rpx;
    display: inline-block;
    
    &.level-normal {
      background: #e8f5e8;
      color: #52c41a;
    }
    
    &.level-mild {
      background: #fff7e6;
      color: #fa8c16;
    }
    
    &.level-moderate {
      background: #fff2e8;
      color: #ff7a00;
    }
    
    &.level-severe {
      background: #fef2f2;
      color: #ff4d4f;
    }
    
    &.level-critical {
      background: #fef0f0;
      color: #cf1322;
    }
  }
}

.description-section {
  margin-bottom: 30rpx;
  
  .description-text {
    font-size: 28rpx;
    line-height: 1.8;
    color: #333;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    display: block;
  }
}

.suggestion-section {
  .suggestion-label {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .suggestion-text {
    font-size: 26rpx;
    line-height: 1.8;
    color: #333;
    background: #f8f9fa;
    padding: 24rpx;
    border-radius: 12rpx;
    border-left: 4rpx solid var(--theme-color);
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    min-height: 80rpx;
    display: block;
  }
}

.result-footer {
  display: flex;
  padding: 20rpx 40rpx 40rpx;
  gap: 20rpx;
  
  .result-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: 600;
    border: none;
    
    &.primary {
      background: var(--theme-color);
      color: white;
    }
    
    &.secondary {
      background: #f5f5f5;
      color: #666;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>