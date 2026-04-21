<template>
    <view :class="['feedback-page', containerClasses]">
        <!-- 选项卡 -->
        <view class="tab-container">
            <view
                class="tab-item"
                :class="{ active: activeTab === 'feedback' }"
                @click="activeTab = 'feedback'"
            >
                意见反馈
            </view>
            <view
                class="tab-item"
                :class="{ active: activeTab === 'help' }"
                @click="activeTab = 'help'"
            >
                常见问题
            </view>
        </view>

        <!-- 反馈表单内容 -->
        <view v-if="activeTab === 'feedback'" class="feedback-section">
            <view class="form-group">
                <text class="form-label">反馈类型</text>
                <view class="feedback-type-options">
                    <view
                        class="type-option"
                        :class="{ selected: feedbackForm.type === 'bug' }"
                        @click="feedbackForm.type = 'bug'"
                    >
                        🐛 Bug反馈
                    </view>
                    <view
                        class="type-option"
                        :class="{ selected: feedbackForm.type === 'feature' }"
                        @click="feedbackForm.type = 'feature'"
                    >
                        ✨ 功能建议
                    </view>
                    <view
                        class="type-option"
                        :class="{ selected: feedbackForm.type === 'other' }"
                        @click="feedbackForm.type = 'other'"
                    >
                        💬 其他反馈
                    </view>
                </view>
            </view>

            <view class="form-group">
                <text class="form-label">联系邮箱</text>
                <input
                    v-model="feedbackForm.email"
                    class="form-input"
                    placeholder="请输入您的邮箱（可选）"
                    type="email"
                />
            </view>

            <view class="form-group">
                <text class="form-label">反馈内容</text>
                <textarea
                    v-model="feedbackForm.content"
                    class="form-textarea"
                    placeholder="请详细描述您的反馈内容（最多500字）..."
                    maxlength="500"
                />
                <text class="char-count"
                    >{{ feedbackForm.content.length }}/500</text
                >
            </view>

            <button class="submit-btn" @click="submitFeedback">提交反馈</button>
            <text class="footer-tips">感谢您的反馈，让我们不断改进！</text>
        </view>

        <!-- 常见问题内容 -->
        <view v-if="activeTab === 'help'" class="help-section">
            <view
                v-for="(item, index) in faqList"
                :key="index"
                class="faq-item"
            >
                <view class="faq-title" @click="toggleFAQ(index)">
                    <text class="faq-question">{{ item.question }}</text>
                    <text class="faq-icon" :class="{ expanded: item.expanded }"
                        >▼</text
                    >
                </view>
                <view v-if="item.expanded" class="faq-answer">
                    {{ item.answer }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            activeTab: "feedback",
            feedbackForm: {
                type: "feedback",
                email: "",
                content: "",
            },
            faqList: [
                {
                    question: "如何修改个人信息？",
                    answer: '您可以进入"个人中心" > "账号管理"来修改个人信息，包括邮箱、手机号等。',
                    expanded: false,
                },
                {
                    question: "忘记密码怎么办？",
                    answer: '在登录页面点击"忘记密码"，按照提示通过邮箱或手机号进行身份验证后重置密码。',
                    expanded: false,
                },
                {
                    question: "如何导出心理测试报告？",
                    answer: '完成心理测试后，可以在结果页面点击"导出"按钮保存或分享测试报告。',
                    expanded: false,
                },
                {
                    question: "心理咨询师如何预约？",
                    answer: '在"心理咨询"模块选择咨询师后，选择合适的时间进行预约。咨询师会在确认后通过消息通知您。',
                    expanded: false,
                },
                {
                    question: "数据是否安全和隐私？",
                    answer: "我们采用最新的加密技术保护您的个人信息和测试数据，严格遵守隐私政策，绝不将您的数据用于其他目的。",
                    expanded: false,
                },
                {
                    question: "如何联系客服？",
                    answer: '您可以通过本页面的"反馈表单"提交问题，我们会尽快为您解答。',
                    expanded: false,
                },
            ],
        };
    },
    computed: {
        containerClasses() {
            if (this.$store) {
                return this.$store.state.theme.isDarkMode ? "dark-mode" : "";
            }
            return "";
        },
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        submitFeedback() {
            if (!this.feedbackForm.content.trim()) {
                uni.showToast({
                    title: "请输入反馈内容",
                    icon: "none",
                });
                return;
            }

            // 本地保存反馈（模拟）
            const feedbackData = {
                type: this.feedbackForm.type,
                email: this.feedbackForm.email || "未提供",
                content: this.feedbackForm.content,
                timestamp: new Date().toLocaleString(),
            };

            try {
                // 获取本地存储的反馈列表
                let feedbackHistory =
                    uni.getStorageSync("feedbackHistory") || [];
                feedbackHistory.push(feedbackData);

                // 保存到本地存储
                uni.setStorageSync("feedbackHistory", feedbackHistory);

                // 显示成功提示
                uni.showToast({
                    title: "感谢您的反馈！",
                    icon: "success",
                    duration: 2000,
                });

                // 清空表单
                setTimeout(() => {
                    this.feedbackForm = {
                        type: "feedback",
                        email: "",
                        content: "",
                    };
                }, 1500);
            } catch (error) {
                console.error("保存反馈失败:", error);
                uni.showToast({
                    title: "反馈提交失败，请重试",
                    icon: "none",
                });
            }
        },
        toggleFAQ(index) {
            this.faqList[index].expanded = !this.faqList[index].expanded;
        },
    },
};
</script>

<style lang="scss" scoped>
.feedback-page {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
    padding-bottom: 30rpx;

    &.dark-mode {
        background: #1a1a1a;
    }
}

/* 导航栏 */
.nav-header {
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx 20rpx;
    padding-top: max(15rpx, env(safe-area-inset-top));
    border-bottom: 1rpx solid #f0f0f0;
    position: sticky;
    top: 0;
    z-index: 100;

    .dark-mode & {
        background: #2a2a2a;
        border-bottom: 1rpx solid #444;
    }

    .nav-back {
        font-size: 36rpx;
        color: #333;
        padding: 10rpx;
        width: 50rpx;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .dark-mode & {
            color: #fff;
        }
    }

    .nav-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        flex: 1;
        text-align: center;

        .dark-mode & {
            color: #fff;
        }
    }

    .nav-placeholder {
        width: 50rpx;
    }
}

/* 选项卡 */
.tab-container {
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    border-bottom: none;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.1);

    .dark-mode & {
        background: #2a2a2a;
        border-bottom: 1rpx solid #444;
    }
}

.tab-item {
    flex: 1;
    padding: 20rpx;
    text-align: center;
    font-size: 28rpx;
    color: #999;
    border-bottom: 4rpx solid transparent;
    transition: all 0.3s ease;
    font-weight: 600;

    .dark-mode & {
        color: #999;
    }

    &.active {
        color: #e07856;
        border-bottom-color: #e07856;
        font-weight: 700;

        .dark-mode & {
            color: #e07856;
        }
    }
}

/* 反馈表单 */
.feedback-section {
    padding: 20rpx;
}

.form-group {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 25rpx 20rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }
}

.form-label {
    display: block;
    font-size: 26rpx;
    color: #333;
    font-weight: 700;
    margin-bottom: 15rpx;

    .dark-mode & {
        color: #fff;
    }
}

.feedback-type-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10rpx;
}

.type-option {
    padding: 15rpx;
    background: rgba(224, 120, 86, 0.05);
    border: 2rpx solid rgba(224, 120, 86, 0.2);
    border-radius: 16rpx;
    text-align: center;
    font-size: 24rpx;
    cursor: pointer;
    transition: all 0.3s ease;

    .dark-mode & {
        background: #333;
    }

    &.selected {
        background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
        color: white;
        border-color: #d4744e;
        font-weight: 700;
        box-shadow: 0 6rpx 16rpx rgba(224, 120, 86, 0.25);
    }

    &:active {
        opacity: 0.8;
    }
}

.form-input {
    width: 100%;
    height: 80rpx;
    padding: 15rpx;
    border: 1rpx solid rgba(224, 120, 86, 0.2);
    border-radius: 16rpx;
    font-size: 26rpx;
    box-sizing: border-box;
    background: rgba(224, 120, 86, 0.03);
    color: #333;

    .dark-mode & {
        background: #333;
        color: #fff;
        border-color: #444;
    }
}

.form-input::placeholder {
    color: #999;
}

.form-textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 15rpx;
    border: 1rpx solid rgba(224, 120, 86, 0.2);
    border-radius: 16rpx;
    font-size: 26rpx;
    box-sizing: border-box;
    background: rgba(224, 120, 86, 0.03);
    resize: vertical;

    .dark-mode & {
        background: #333;
        color: #fff;
        border-color: #444;
    }
}

.form-textarea::placeholder {
    color: #999;
}

.char-count {
    display: block;
    text-align: right;
    font-size: 20rpx;
    color: #999;
    margin-top: 8rpx;
}

.submit-btn {
    width: 100%;
    padding: 18rpx;
    background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
    color: white;
    border: none;
    border-radius: 24rpx;
    font-size: 28rpx;
    font-weight: 700;
    margin: 20rpx 0;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);

    &:active {
        transform: scale(0.98);
        opacity: 0.9;
    }
}

.footer-tips {
    display: block;
    text-align: center;
    color: #d4744e;
    font-size: 22rpx;
    font-weight: 600;
}

/* 常见问题 */
.help-section {
    padding: 20rpx;
}

.faq-item {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    margin-bottom: 15rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }
}

.faq-title {
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
        background: rgba(224, 120, 86, 0.05);

        .dark-mode & {
            background: #333;
        }
    }
}

.faq-question {
    flex: 1;
    font-size: 26rpx;
    color: #333;
    font-weight: 600;

    .dark-mode & {
        color: #fff;
    }
}

.faq-icon {
    font-size: 20rpx;
    color: #e07856;
    transition: transform 0.3s ease;
    margin-left: 10rpx;
    font-weight: 700;

    &.expanded {
        transform: rotate(180deg);
    }
}

.faq-answer {
    padding: 15rpx 20rpx 20rpx;
    border-top: 1rpx solid #f0f0f0;
    background: #fafafa;
    font-size: 24rpx;
    color: #666;
    line-height: 1.6;
    animation: slideDown 0.3s ease;

    .dark-mode & {
        background: #333;
        color: #ccc;
        border-top-color: #444;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
