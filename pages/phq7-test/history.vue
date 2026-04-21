<template>
  <view :class="['history-container', containerClasses]" :style="{'--theme-color': themeColor}">
    <!-- 顶部导航 -->
    <!-- <view class="history-header">
      <view class="header-left">
        <text class="back-arrow" @click="goBack">⬅️</text>
        <text class="header-title">历史测评记录</text>
      </view>
      <view class="header-stats">
        <text class="stats-text">共{{totalCount}}条记录</text>
      </view>
    </view> -->

    <!-- 筛选器 -->
    <view class="filter-section">
      <scroll-view class="filter-scroll" scroll-x>
        <view class="filter-item" 
              :class="{active: currentFilter === 'all'}"
              @click="filterByType('all')">
          <text>全部</text>
        </view>
        <view class="filter-item" 
              :class="{active: currentFilter === 'mood'}"
              @click="filterByType('mood')">
          <text>😊 情绪</text>
        </view>
        <view class="filter-item" 
              :class="{active: currentFilter === 'stress'}"
              @click="filterByType('stress')">
          <text>😫 压力</text>
        </view>
        <view class="filter-item" 
              :class="{active: currentFilter === 'social'}"
              @click="filterByType('social')">
          <text>👥 人际</text>
        </view>
        <view class="filter-item" 
              :class="{active: currentFilter === 'sleep'}"
              @click="filterByType('sleep')">
          <text>😴 睡眠</text>
        </view>
      </scroll-view>
    </view>

    <!-- 记录列表 -->
    <view class="history-list" v-if="!loading">
      <view v-if="filteredResults.length === 0" class="empty-state">
        <text class="empty-emoji">📊</text>
        <text class="empty-text">暂无测评记录</text>
        <text class="empty-desc">开始您的第一次心理测评吧</text>
      </view>
      
      <view v-else>
        <view 
          v-for="(item, index) in filteredResults" 
          :key="item.id"
          class="history-card"
          @click="viewDetail(item)"
        >
          <view class="card-header">
            <view class="test-info">
              <text class="test-emoji">{{getTestEmoji(item.questionnaireName)}}</text>
              <view class="test-details">
                <text class="test-name">{{getTestDisplayName(item.questionnaireName)}}</text>
                <text class="test-date">{{formatDate(item.createTime)}}</text>
              </view>
            </view>
            <view class="score-badge" :class="getScoreClass(item.depressionLevel)">
              <text class="score-text">{{getScoreText(item.depressionLevel)}}</text>
            </view>
          </view>
          
          <view class="card-content">
            <text class="result-desc">{{item.levelDescription}}</text>
          </view>
          
          <view class="card-footer">
            <view class="result-tag" :class="getResultTagClass(item.depressionLevel)">
              <text>{{item.depressionLevel}}</text>
            </view>
            <view class="view-detail">
              <text class="detail-text">查看详情</text>
              <text class="arrow">➡️</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 详情弹窗 -->
    <view class="detail-modal" v-if="showDetail" @click="closeDetail">
      <view class="detail-content" @click.stop>
        <view class="detail-header">
          <text class="detail-title">{{selectedItem.questionnaireName}}</text>
          <view class="close-btn" @click="closeDetail">×</view>
        </view>
        
        <view class="detail-body">
          <view class="detail-section">
            <text class="section-label">测评时间</text>
            <text class="section-value">{{formatDate(selectedItem.createTime)}}</text>
          </view>
          
          <view class="detail-section">
            <text class="section-label">测评结果</text>
            <text class="section-value result-value" :class="getScoreClass(selectedItem.depressionLevel)">
              {{selectedItem.depressionLevel}}
            </text>
          </view>
          
          <view class="detail-section">
            <text class="section-label">结果描述</text>
            <text class="section-value description">{{selectedItem.levelDescription}}</text>
          </view>
          
          <view class="detail-section" v-if="selectedItem.suggestion">
            <text class="section-label">专业建议</text>
            <text class="section-value suggestion">{{selectedItem.suggestion}}</text>
          </view>
        </view>
        
        <view class="detail-footer">
          <button class="detail-btn" @click="closeDetail">关闭</button>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
// import { getQuestionnaireResultsList } from '@/api/questionnaire'

	export default {
		data() {
			return {
      themeColor: '#5d9bff',
      loading: true,
      totalCount: 0,
      currentFilter: 'all',
      results: [],
      showDetail: false,
      selectedItem: {}
    }
  },
  computed: {
    filteredResults() {
      if (this.currentFilter === 'all') {
        return this.results
      }
      return this.results.filter(item => {
        const testName = item.questionnaireName.toLowerCase()
        if (this.currentFilter === 'mood') {
          return testName.includes('抑郁') || testName.includes('焦虑') || testName.includes('phq') || testName.includes('gad')
        } else if (this.currentFilter === 'stress') {
          return testName.includes('压力') || testName.includes('cpss') || testName.includes('pss')
        } else if (this.currentFilter === 'social') {
          return testName.includes('孤独') || testName.includes('信任') || testName.includes('ucla') || testName.includes('its')
        } else if (this.currentFilter === 'sleep') {
          return testName.includes('睡眠') || testName.includes('psqi') || testName.includes('sds')
        }
        return true
      })
			}
		},
		methods: {
     async loadHistoryData() {
       try {
         this.loading = true
        const userId = uni.getStorageSync('userId')
        
        if (!userId) {
          uni.showToast({
            title: '用户信息丢失，请重新登录',
            icon: 'error'
          })
          return
        }
        
        const result = await this.$api.questionnaire.getUserResults(userId)
        
        console.log('获取历史记录结果:', result)
        
        if (result.code === 200 && result.data) {
          this.results = result.data
          this.totalCount = result.data.length
          console.log('历史记录加载成功:', this.results)
        } else {
          uni.showToast({
            title: result.message || '加载失败，请重试',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('加载历史记录失败:', error)
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    
    filterByType(type) {
      this.currentFilter = type
    },
    
    getTestName(testName) {
      const nameMap = {
        'PHQ-9抑郁筛查量表': '抑郁评估',
        'GAD-7焦虑筛查量表': '焦虑评估',
        'CPSS创伤后应激量表': '创伤评估',
        'UCLA孤独感量表': '孤独感评估',
        'ITS人际信任量表': '人际信任量表',
        'PSQI匹兹堡睡眠质量指数': '匹兹堡睡眠质量指数',
        'SDS睡眠障碍量表': '睡眠障碍量表'
      }
      return nameMap[testName] || testName
    },
    
    getTestDisplayName(testName) {
      return this.getTestName(testName)
    },
    
    getTestEmoji(testName) {
      const name = testName.toLowerCase()
      if (name.includes('抑郁') || name.includes('phq')) return '😔'
      if (name.includes('焦虑') || name.includes('gad')) return '😰'
      if (name.includes('创伤') || name.includes('cpss')) return '😨'
      if (name.includes('孤独') || name.includes('ucla')) return '😔'
      if (name.includes('人际') || name.includes('its')) return '🤝'
      if (name.includes('睡眠') || name.includes('psqi') || name.includes('sds')) return '😴'
      return '📊'
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return '今天'
      } else if (days === 1) {
        return '昨天'
      } else if (days < 7) {
        return `${days}天前`
      } else {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    },
    
    getScoreClass(level) {
      if (!level) return 'score-normal'
      if (level.includes('良好') || level.includes('正常') || level.includes('无')) return 'score-good'
      if (level.includes('轻度') || level.includes('一般') || level.includes('中等')) return 'score-mild'
      if (level.includes('中度') || level.includes('较差') || level.includes('较高')) return 'score-moderate'
      if (level.includes('重度') || level.includes('很差') || level.includes('高')) return 'score-severe'
      return 'score-normal'
    },
    
    getScoreText(level) {
      if (!level) return '正常'
      if (level.includes('良好') || level.includes('正常') || level.includes('无')) return '良好'
      if (level.includes('轻度') || level.includes('一般') || level.includes('中等')) return '一般'
      if (level.includes('中度') || level.includes('较差') || level.includes('较高')) return '较差'
      if (level.includes('重度') || level.includes('很差') || level.includes('高')) return '严重'
      return '正常'
    },
				
    getResultTagClass(level) {
      return this.getScoreClass(level)
    },
				
    viewDetail(item) {
      this.selectedItem = item
      this.showDetail = true
    },
    
    closeDetail() {
      this.showDetail = false
      this.selectedItem = {}
    },
    
    goBack() {
      uni.navigateBack()
    }
  },
  
  onShow() {
    this.loadHistoryData()
  }
}
</script>

<style lang="scss">
.history-container {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 40rpx;
}

.history-header {
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
  
  .header-stats {
    .stats-text {
      font-size: 24rpx;
      color: #64748b;
    }
  }
}

.filter-section {
  padding: 20rpx 30rpx;
  background: white;
  
  .filter-scroll {
    white-space: nowrap;
  }
  
  .filter-item {
    display: inline-block;
    padding: 12rpx 24rpx;
    margin-right: 20rpx;
    background: #f1f5f9;
    border-radius: 20rpx;
    font-size: 26rpx;
    color: #64748b;
    transition: all 0.3s;
    border: 1rpx solid transparent;
    
    &.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
  }
}

.history-list {
  padding: 0 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
  
  .empty-emoji {
    font-size: 120rpx;
    margin-bottom: 30rpx;
    opacity: 0.6;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 15rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    color: #94a3b8;
  }
}

.history-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid #e2e8f0;
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .test-info {
      display: flex;
      align-items: center;
      flex: 1;
      
      .test-emoji {
        font-size: 48rpx;
        margin-right: 20rpx;
        opacity: 0.8;
      }
      
      .test-details {
        flex: 1;
        
        .test-name {
          display: block;
          font-size: 30rpx;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8rpx;
        }
        
        .test-date {
          font-size: 24rpx;
          color: #94a3b8;
        }
      }
    }
    
    .score-badge {
      padding: 8rpx 16rpx;
      border-radius: 12rpx;
      font-size: 22rpx;
      font-weight: 500;
      
      &.score-good {
        background: #dcfce7;
        color: #16a34a;
        border: 1rpx solid #bbf7d0;
      }
      
      &.score-mild {
        background: #fef3c7;
        color: #d97706;
        border: 1rpx solid #fde68a;
      }
      
      &.score-moderate {
        background: #fed7aa;
        color: #ea580c;
        border: 1rpx solid #fdba74;
      }
      
      &.score-severe {
        background: #fee2e2;
        color: #dc2626;
        border: 1rpx solid #fecaca;
      }
      
      &.score-normal {
        background: #f1f5f9;
        color: #64748b;
        border: 1rpx solid #e2e8f0;
      }
    }
  }
  
  .card-content {
    margin-bottom: 24rpx;
    
    .result-desc {
      font-size: 26rpx;
      color: #64748b;
      line-height: 1.6;
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .result-tag {
      padding: 6rpx 16rpx;
      border-radius: 12rpx;
      font-size: 22rpx;
      font-weight: 500;
      
      &.score-good {
        background: #dcfce7;
        color: #16a34a;
        border: 1rpx solid #bbf7d0;
      }
      
      &.score-mild {
        background: #fef3c7;
        color: #d97706;
        border: 1rpx solid #fde68a;
      }
      
      &.score-moderate {
        background: #fed7aa;
        color: #ea580c;
        border: 1rpx solid #fdba74;
      }
      
      &.score-severe {
        background: #fee2e2;
        color: #dc2626;
        border: 1rpx solid #fecaca;
      }
      
      &.score-normal {
        background: #f1f5f9;
        color: #64748b;
        border: 1rpx solid #e2e8f0;
      }
    }
    
    .view-detail {
      display: flex;
      align-items: center;
      
      .detail-text {
        font-size: 24rpx;
        color: #3b82f6;
        margin-right: 8rpx;
      }
      
      .arrow {
        font-size: 20rpx;
        color: #3b82f6;
      }
    }
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e2e8f0;
    border-top: 4rpx solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #64748b;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
  animation: fadeIn 0.3s ease;
}

.detail-content {
  background: white;
  border-radius: 20rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1rpx solid #e2e8f0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #e2e8f0;
  
  .detail-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1e293b;
  }
  
  .close-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #64748b;
    font-weight: 300;
    border: 1rpx solid #e2e8f0;
  }
}

.detail-body {
  padding: 40rpx;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: 0;
}

.detail-section {
  margin-bottom: 30rpx;
  
  .section-label {
    display: block;
    font-size: 26rpx;
    color: #64748b;
    margin-bottom: 10rpx;
    font-weight: 600;
  }
  
  .section-value {
    font-size: 28rpx;
    color: #1e293b;
    line-height: 1.6;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    
    &.result-value {
      padding: 8rpx 16rpx;
      border-radius: 12rpx;
      display: inline-block;
      font-weight: 600;
      
      &.score-good {
        background: #dcfce7;
        color: #16a34a;
        border: 1rpx solid #bbf7d0;
      }
      
      &.score-mild {
        background: #fef3c7;
        color: #d97706;
        border: 1rpx solid #fde68a;
      }
      
      &.score-moderate {
        background: #fed7aa;
        color: #ea580c;
        border: 1rpx solid #fdba74;
      }
      
      &.score-severe {
        background: #fee2e2;
        color: #dc2626;
        border: 1rpx solid #fecaca;
      }
    }
    
    &.description, &.suggestion {
      background: #f8fafc;
      padding: 20rpx;
      border-radius: 12rpx;
      border-left: 4rpx solid #3b82f6;
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
      display: block;
      min-height: 60rpx;
      border: 1rpx solid #e2e8f0;
    }
  }
}

.detail-footer {
  padding: 20rpx 40rpx 40rpx;
  
  .detail-btn {
    width: 100%;
    height: 80rpx;
    background: #3b82f6;
    color: white;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: 600;
    border: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
