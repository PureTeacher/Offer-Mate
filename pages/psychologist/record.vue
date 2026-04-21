<template>
  <view :class="['record-container', containerClasses]" :style="{'--theme-color': themeColor}">
    <!-- 顶部导航 -->
  <!--  <view class="header">
      <view class="header-left">
        <text class="back-arrow" @click="goBack">⬅️</text>
        <text class="header-title">预约记录</text>
      </view>
      <view class="header-stats">
        <text class="stats-text">共{{totalCount}}条记录</text>
      </view>
    </view> -->


    <!-- 记录列表 -->
    <view class="record-list" v-if="!loading">
      <view v-if="records.length === 0" class="empty-state">
        <text class="empty-emoji">📋</text>
        <text class="empty-text">暂无预约记录</text>
        <text class="empty-desc">您还没有预约过任何医生</text>
      </view>
      
      <view v-else style="margin-top: 10px;">
        <view 
          v-for="(record, index) in records" 
          :key="record.id"
          class="record-card"
          @click="viewRecordDetail(record)"
        >
          <view class="card-header">
            <view class="doctor-info">
              <text class="doctor-name">{{record.doctorName}}</text>
              <text class="appointment-time">{{formatDate(record.createTime)}}</text>
            </view>
            <!-- <view class="status-badge" :class="getStatusClass(record.status)">
              <text class="status-text">{{record.status}}</text>
            </view> -->
          </view>
          
          <view class="card-content">
            <view class="patient-info">
              <text class="patient-name">{{record.patientName}}</text>
              <text class="patient-details">{{record.patientAge}}岁 · {{record.patientGender}}</text>
            </view>
            
            <view class="consultation-content">
              <text class="content-label">咨询内容：</text>
              <text class="content-text">{{record.consultationContent}}</text>
            </view>
            
            <view class="appointment-details">
              <view class="detail-item">
                <text class="detail-label">紧急程度</text>
                <text class="detail-value urgency" :class="getUrgencyClass(record.urgency)">{{record.urgency}}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">时间偏好</text>
                <text class="detail-value">{{record.timePreference}}</text>
              </view>
            </view>
          </view>
          
          <view class="card-footer">
            <view class="contact-info">
              <text class="phone-label">联系电话</text>
              <text class="phone-number">{{record.patientPhone}}</text>
            </view>
            <view class="action-buttons">
              <button class="detail-btn" @click.stop="viewRecordDetail(record)">
                查看详情
              </button>
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
          <text class="detail-title">预约详情</text>
          <view class="close-btn" @click="closeDetail">×</view>
        </view>
        
        <view class="detail-body">
          <view class="detail-section">
            <text class="section-label">医生信息</text>
            <view class="info-row">
              <text class="info-label">医生姓名</text>
              <text class="info-value">{{selectedRecord.doctorName}}</text>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-label">患者信息</text>
            <view class="info-row">
              <text class="info-label">姓名</text>
              <text class="info-value">{{selectedRecord.patientName}}</text>
            </view>
            <view class="info-row">
              <text class="info-label">年龄</text>
              <text class="info-value">{{selectedRecord.patientAge}}岁</text>
            </view>
            <view class="info-row">
              <text class="info-label">性别</text>
              <text class="info-value">{{selectedRecord.patientGender}}</text>
            </view>
            <view class="info-row">
              <text class="info-label">手机号</text>
              <text class="info-value">{{selectedRecord.patientPhone}}</text>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-label">预约信息</text>
            <view class="info-row">
              <text class="info-label">预约时间</text>
              <text class="info-value">{{formatDate(selectedRecord.createTime)}}</text>
            </view>
            <view class="info-row">
              <text class="info-label">预约状态</text>
              <text class="info-value status-value" :class="getStatusClass(selectedRecord.status)">{{selectedRecord.status}}</text>
            </view>
            <view class="info-row">
              <text class="info-label">紧急程度</text>
              <text class="info-value urgency-value" :class="getUrgencyClass(selectedRecord.urgency)">{{selectedRecord.urgency}}</text>
            </view>
            <view class="info-row">
              <text class="info-label">时间偏好</text>
              <text class="info-value">{{selectedRecord.timePreference}}</text>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-label">咨询内容</text>
            <text class="consultation-detail">{{selectedRecord.consultationContent}}</text>
          </view>
          
          <view class="detail-section" v-if="selectedRecord.remark">
            <text class="section-label">备注信息</text>
            <text class="remark-detail">{{selectedRecord.remark}}</text>
          </view>
        </view>
        
        <view class="detail-footer">
          <button class="detail-close-btn" @click="closeDetail">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { getAppointmentList } from '@/api/questionnaire'

export default {
  data() {
    return {
      themeColor: '#4facfe',
      loading: true,
      totalCount: 0,
      records: [],
      showDetail: false,
      selectedRecord: {}
    }
  },
  methods: {
    async loadAppointmentRecords() {
      try {
        this.loading = true
        const result = await this.$api.appointment.getAppointmentList({
          current: 1,
          size: 100
        })
        
        if (result.code === 200) {
          this.records = result.data || []
          this.totalCount = this.records.length || 0
        } else {
          uni.showToast({
            title: result.message || '加载失败，请重试',
            icon: 'error'
          })
        }
      } catch (error) {
        console.error('加载预约记录失败:', error)
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    
    getStatusClass(status) {
      const statusMap = {
        '待处理': 'status-pending',
        '已确认': 'status-confirmed',
        '已完成': 'status-completed',
        '已取消': 'status-cancelled'
      }
      return statusMap[status] || 'status-pending'
    },
    
    getUrgencyClass(urgency) {
      const urgencyMap = {
        '一般': 'urgency-normal',
        '较急': 'urgency-urgent',
        '紧急': 'urgency-emergency'
      }
      return urgencyMap[urgency] || 'urgency-normal'
    },
    
    viewRecordDetail(record) {
      this.selectedRecord = record
      this.showDetail = true
    },
    
    closeDetail() {
      this.showDetail = false
      this.selectedRecord = {}
    },
    
    goBack() {
      uni.navigateBack()
    }
  },
  
  onShow() {
    this.loadAppointmentRecords()
  }
}
</script>

<style lang="scss">
.record-container {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 40rpx;
}

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
  
  .header-stats {
    .stats-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}


.record-list {
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
  }
  
  .empty-text {
    font-size: 32rpx;
    color: white;
    font-weight: bold;
    margin-bottom: 15rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

.record-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .doctor-info {
      .doctor-name {
        display: block;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .appointment-time {
        font-size: 22rpx;
        color: #999;
      }
    }
    
    .status-badge {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      font-weight: bold;
      
      &.status-pending {
        background: #fff7e6;
        color: #fa8c16;
      }
      
      &.status-confirmed {
        background: #e6f7ff;
        color: #1890ff;
      }
      
      &.status-completed {
        background: #e8f5e8;
        color: #52c41a;
      }
      
      &.status-cancelled {
        background: #fef2f2;
        color: #ff4d4f;
      }
    }
  }
  
  .card-content {
    margin-bottom: 20rpx;
    
    .patient-info {
      display: flex;
      align-items: center;
      margin-bottom: 15rpx;
      
      .patient-name {
        font-size: 26rpx;
        font-weight: bold;
        color: #333;
        margin-right: 15rpx;
      }
      
      .patient-details {
        font-size: 22rpx;
        color: #666;
      }
    }
    
    .consultation-content {
      margin-bottom: 15rpx;
      
      .content-label {
        font-size: 22rpx;
        color: #666;
        margin-right: 10rpx;
      }
      
      .content-text {
        font-size: 24rpx;
        color: #333;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    
    .appointment-details {
      display: flex;
      gap: 30rpx;
      
      .detail-item {
        .detail-label {
          display: block;
          font-size: 20rpx;
          color: #999;
          margin-bottom: 5rpx;
        }
        
        .detail-value {
          font-size: 22rpx;
          color: #333;
          
          &.urgency {
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            
            &.urgency-normal {
              background: #f0f0f0;
              color: #666;
            }
            
            &.urgency-urgent {
              background: #fff7e6;
              color: #fa8c16;
            }
            
            &.urgency-emergency {
              background: #fef2f2;
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .contact-info {
      .phone-label {
        display: block;
        font-size: 20rpx;
        color: #999;
        margin-bottom: 5rpx;
      }
      
      .phone-number {
        font-size: 24rpx;
        color: #333;
        font-weight: bold;
      }
    }
    
    .action-buttons {
      .detail-btn {
        background: var(--theme-color);
        color: white;
        border: none;
        border-radius: 20rpx;
        padding: 8rpx 20rpx;
        font-size: 22rpx;
        font-weight: bold;
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
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    border-top: 4rpx solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  .loading-text {
    font-size: 28rpx;
    color: white;
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
  animation: fadeIn 0.3s ease;
}

.detail-content {
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

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .detail-title {
    font-size: 32rpx;
    font-weight: bold;
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
    color: #666;
    margin-bottom: 15rpx;
    font-weight: bold;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
    
    .info-label {
      font-size: 24rpx;
      color: #999;
    }
    
    .info-value {
      font-size: 24rpx;
      color: #333;
      
      &.status-value {
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        font-size: 20rpx;
        
        &.status-pending {
          background: #fff7e6;
          color: #fa8c16;
        }
        
        &.status-confirmed {
          background: #e6f7ff;
          color: #1890ff;
        }
        
        &.status-completed {
          background: #e8f5e8;
          color: #52c41a;
        }
        
        &.status-cancelled {
          background: #fef2f2;
          color: #ff4d4f;
        }
      }
      
      &.urgency-value {
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        font-size: 20rpx;
        
        &.urgency-normal {
          background: #f0f0f0;
          color: #666;
        }
        
        &.urgency-urgent {
          background: #fff7e6;
          color: #fa8c16;
        }
        
        &.urgency-emergency {
          background: #fef2f2;
          color: #ff4d4f;
        }
      }
    }
  }
  
  .consultation-detail, .remark-detail {
    font-size: 24rpx;
    color: #333;
    line-height: 1.6;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    display: block;
    background: #f8f9fa;
    padding: 20rpx;
    border-radius: 12rpx;
    border-left: 4rpx solid var(--theme-color);
  }
}

.detail-footer {
  padding: 20rpx 40rpx 40rpx;
  
  .detail-close-btn {
    width: 100%;
    height: 80rpx;
    background: var(--theme-color);
    color: white;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
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
