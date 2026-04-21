<template>
  <view :class="['appointment-container', containerClasses]" :style="{'--theme-color': themeColor}">
    <!-- 顶部导航 -->
    <!-- <view class="header">
      <view class="header-left">
        <text class="back-arrow" @click="goBack">⬅️</text>
        <text class="header-title">预约咨询</text>
      </view>
    </view> -->

    <!-- 医生信息卡片 -->
    <view class="doctor-card">
      <view class="doctor-info">
        <image :src="doctorInfo.avatar" class="doctor-avatar" mode="aspectFill"/>
        <view class="doctor-details">
          <text class="doctor-name">{{doctorInfo.name}}</text>
          <text class="doctor-title">{{doctorInfo.title}}</text>
          <text class="doctor-specialties">{{doctorInfo.specialties.join('、')}}</text>
        </view>
      </view>
    </view>

    <!-- 预约表单 -->
    <view class="form-container">
      <view class="form-title">
        <text class="title-text">填写预约信息</text>
        <text class="title-desc">请填写您的个人信息，我们会尽快与您联系</text>
      </view>

      <view class="form-content">
        <!-- 姓名 -->
        <view class="form-item">
          <text class="form-label">姓名 <text class="required">*</text></text>
          <input 
            class="form-input" 
            v-model="formData.name"
            placeholder="请输入您的真实姓名"
            maxlength="20"
          />
        </view>

        <!-- 年龄 -->
        <view class="form-item">
          <text class="form-label">年龄 <text class="required">*</text></text>
          <input 
            class="form-input" 
            v-model="formData.age"
            placeholder="请输入您的年龄"
            type="number"
            maxlength="3"
          />
        </view>

        <!-- 性别 -->
        <view class="form-item">
          <text class="form-label">性别 <text class="required">*</text></text>
          <view class="gender-options">
            <view 
              class="gender-option" 
              :class="{selected: formData.gender === '男'}"
              @click="selectGender('男')"
            >
              <text class="gender-icon">👨</text>
              <text class="gender-text">男</text>
            </view>
            <view 
              class="gender-option" 
              :class="{selected: formData.gender === '女'}"
              @click="selectGender('女')"
            >
              <text class="gender-icon">👩</text>
              <text class="gender-text">女</text>
            </view>
          </view>
        </view>

        <!-- 手机号码 -->
        <view class="form-item">
          <text class="form-label">手机号码 <text class="required">*</text></text>
          <input 
            class="form-input" 
            v-model="formData.phone"
            placeholder="请输入您的手机号码"
            type="number"
            maxlength="11"
          />
        </view>

        <!-- 咨询内容 -->
        <view class="form-item">
          <text class="form-label">咨询内容 <text class="required">*</text></text>
          <textarea 
            class="form-textarea" 
            v-model="formData.content"
            placeholder="请详细描述您希望咨询的问题或困扰，这将帮助医生更好地了解您的情况"
            maxlength="500"
            :show-count="true"
          />
        </view>

        <!-- 紧急程度 -->
        <view class="form-item">
          <text class="form-label">紧急程度</text>
          <view class="urgency-options">
            <view 
              class="urgency-option" 
              :class="{selected: formData.urgency === '一般'}"
              @click="selectUrgency('一般')"
            >
              <text class="urgency-text">一般</text>
            </view>
            <view 
              class="urgency-option" 
              :class="{selected: formData.urgency === '较急'}"
              @click="selectUrgency('较急')"
            >
              <text class="urgency-text">较急</text>
            </view>
            <view 
              class="urgency-option" 
              :class="{selected: formData.urgency === '紧急'}"
              @click="selectUrgency('紧急')"
            >
              <text class="urgency-text">紧急</text>
            </view>
          </view>
        </view>

        <!-- 预约时间偏好 -->
        <view class="form-item">
          <text class="form-label">预约时间偏好</text>
          <view class="time-options">
            <view 
              class="time-option" 
              :class="{selected: formData.timePreference === '工作日'}"
              @click="selectTimePreference('工作日')"
            >
              <text class="time-text">工作日</text>
            </view>
            <view 
              class="time-option" 
              :class="{selected: formData.timePreference === '周末'}"
              @click="selectTimePreference('周末')"
            >
              <text class="time-text">周末</text>
            </view>
            <view 
              class="time-option" 
              :class="{selected: formData.timePreference === '随时'}"
              @click="selectTimePreference('随时')"
            >
              <text class="time-text">随时</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button 
          class="submit-btn" 
          :class="{disabled: !isFormValid}"
          @click="submitAppointment"
          :disabled="!isFormValid"
        >
          提交预约申请
        </button>
        <text class="submit-tip">提交后我们会在24小时内联系您</text>
      </view>
    </view>

    <!-- 成功提示弹窗 -->
    <view class="success-modal" v-if="showSuccess" @click="closeSuccess">
      <view class="success-content" @click.stop>
        <view class="success-icon">✅</view>
        <text class="success-title">预约申请已提交</text>
        <text class="success-message">
          我们已经收到您的预约信息，稍后会有工作人员联系您确认具体的咨询时间。感谢您的信任！
        </text>
        <button class="success-btn" @click="closeSuccess">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
// import { saveAppointment } from '@/api/questionnaire'

export default {
  data() {
    return {
      themeColor: '#4facfe',
      showSuccess: false,
      formData: {
        name: '',
        age: '',
        gender: '',
        phone: '',
        content: '',
        urgency: '一般',
        timePreference: '随时'
      },
      doctorInfo: {
        id: 1,
        name: '李心怡',
        title: '主任医师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1&backgroundColor=b6e3f4',
        specialties: ['焦虑症', '抑郁症', '情感咨询']
      }
    }
  },
  computed: {
    isFormValid() {
      return this.formData.name.trim() !== '' &&
             this.formData.age.trim() !== '' &&
             this.formData.gender !== '' &&
             this.formData.phone.trim() !== '' &&
             this.formData.content.trim() !== ''
    }
  },
  methods: {
    selectGender(gender) {
      this.formData.gender = gender
    },
    
    selectUrgency(urgency) {
      this.formData.urgency = urgency
    },
    
    selectTimePreference(time) {
      this.formData.timePreference = time
    },
    
    async submitAppointment() {
      if (!this.isFormValid) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号格式
      if (!this.validatePhone(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      
      // 验证年龄
      const age = parseInt(this.formData.age)
      if (age < 1 || age > 120) {
        uni.showToast({
          title: '请输入正确的年龄',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({
          title: '提交中...'
        })
        
        // 这里预留保存到后端的接口调用
        await this.saveAppointmentToBackend()
        
        uni.hideLoading()
        this.showSuccess = true
        
      } catch (error) {
        uni.hideLoading()
        console.error('提交预约失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'error'
        })
      }
    },
    
    // 保存预约申请到后端
    async saveAppointmentToBackend() {
      const appointmentData = {
        doctorId: this.doctorInfo.id,
        doctorName: this.doctorInfo.name,
        patientName: this.formData.name,
        patientAge: parseInt(this.formData.age),
        patientGender: this.formData.gender,
        patientPhone: this.formData.phone,
        consultationContent: this.formData.content,
        urgency: this.formData.urgency,
        timePreference: this.formData.timePreference
      }
      
      console.log('预约数据:', appointmentData)
      
      try {
        // 调用后端接口保存数据
        const result = await this.$api.appointment.saveAppointment(appointmentData)
        
        if (result.code === 200) {
          console.log('保存预约申请成功:', result)
          uni.showToast({
            title: '预约申请已提交',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.error('保存失败:', result.message)
          uni.showToast({
            title: result.message || '保存失败，请重试',
            icon: 'error',
            duration: 2000
          })
        }
      } catch (error) {
        console.error('保存预约申请失败:', error)
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'error',
          duration: 2000
        })
        throw error
      }
    },
    
    validatePhone(phone) {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(phone)
    },
    
    closeSuccess() {
      this.showSuccess = false
      // 可以选择返回上一页或跳转到其他页面
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    },
    
    goBack() {
      uni.navigateBack()
    }
  },
  
  onLoad(options) {
    // 从上一页传递医生信息
    if (options.doctorId) {
      this.doctorInfo = {
        id: options.doctorId,
        name: decodeURIComponent(options.doctorName || ''),
        title: decodeURIComponent(options.doctorTitle || ''),
        avatar: decodeURIComponent(options.doctorAvatar || ''),
        specialties: options.doctorSpecialties ? decodeURIComponent(options.doctorSpecialties).split(',') : []
      }
    }
  }
}
</script>

<style lang="scss">
.appointment-container {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 40rpx;
}

.header {
  display: flex;
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

.doctor-card {
  margin: 20rpx 30rpx;
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid #e2e8f0;
  
  .doctor-info {
    display: flex;
    align-items: center;
    
    .doctor-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      border: 3rpx solid #e2e8f0;
    }
    
    .doctor-details {
      flex: 1;
      
      .doctor-name {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8rpx;
      }
      
      .doctor-title {
        display: block;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .doctor-specialties {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.form-container {
  margin: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  
  .form-title {
    text-align: center;
    margin-bottom: 40rpx;
    
    .title-text {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .title-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .form-content {
    .form-item {
      margin-bottom: 30rpx;
      
      .form-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 15rpx;
        font-weight: 500;
        
        .required {
          color: #ff4d4f;
          margin-left: 5rpx;
        }
      }
      
      .form-input {
        width: 100%;
        height: 80rpx;
        background: #f8f9fa;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
        
        &:focus {
          border-color: var(--theme-color);
          background: white;
        }
      }
      
      .form-textarea {
        width: 100%;
        min-height: 120rpx;
        background: #f8f9fa;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        padding: 20rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
        resize: none;
        
        &:focus {
          border-color: var(--theme-color);
          background: white;
        }
      }
      
      .gender-options, .urgency-options, .time-options {
        display: flex;
        gap: 20rpx;
        
        .gender-option, .urgency-option, .time-option {
          flex: 1;
          height: 60rpx;
          background: #f8f9fa;
          border: 2rpx solid #e9ecef;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          
          &.selected {
            background: var(--theme-color);
            border-color: var(--theme-color);
            color: white;
          }
          
          .gender-icon {
            font-size: 24rpx;
            margin-right: 8rpx;
          }
          
          .gender-text, .urgency-text, .time-text {
            font-size: 26rpx;
          }
        }
      }
    }
  }
  
  .submit-section {
    margin-top: 40rpx;
    text-align: center;
    
    .submit-btn {
      width: 100%;
      height: 80rpx;
      background: var(--theme-color);
      color: white;
      border: none;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 15rpx;
      transition: all 0.3s;
      
      &.disabled {
        background: #ccc;
        color: #999;
      }
    }
    
    .submit-tip {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.success-modal {
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

.success-content {
  background: white;
  border-radius: 24rpx;
  width: 100%;
  max-width: 500rpx;
  padding: 60rpx 40rpx 40rpx;
  text-align: center;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  
  .success-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  
  .success-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .success-message {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 40rpx;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    display: block;
  }
  
  .success-btn {
    width: 200rpx;
    height: 60rpx;
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: 30rpx;
    font-size: 28rpx;
    font-weight: bold;
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
