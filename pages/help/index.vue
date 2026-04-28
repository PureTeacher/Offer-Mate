<template>
    <view :class="['help-page', containerClasses]">
        <!-- 帮助内容 -->
        <view class="help-content">
            <!-- 快速导航 -->
            <view class="section">
                <text class="section-title">快速导航</text>
                <view class="quick-nav">
                    <view
                        class="nav-item"
                        @click="scrollToSection('getting-started')"
                    >
                        <text class="nav-icon">🚀</text>
                        <text class="nav-text">快速开始</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('features')">
                        <text class="nav-icon">✨</text>
                        <text class="nav-text">功能介绍</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('faq')">
                        <text class="nav-icon">❓</text>
                        <text class="nav-text">常见问题</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('contact')">
                        <text class="nav-icon">📞</text>
                        <text class="nav-text">联系我们</text>
                    </view>
                </view>
            </view>

            <!-- 快速开始 -->
            <view class="section" id="getting-started">
                <text class="section-title">🚀 快速开始</text>
                <view class="help-card">
                    <text class="card-title">第一步：注册账号</text>
                    <text class="card-text">
                        下载应用后点击"注册"，使用邮箱或手机号创建您的账号，设置安全的密码。
                    </text>
                </view>
                <view class="help-card">
                    <text class="card-title">第二步：完善个人信息</text>
                    <text class="card-text">
                        登录后进入个人中心，完善头像、性别、年龄等信息，帮助我们更好地为您服务。
                    </text>
                </view>
                <view class="help-card">
                    <text class="card-title">第三步：开始使用功能</text>
                    <text class="card-text">
                        浏览职业测评、预约导师、查看成长记录等丰富功能。
                    </text>
                </view>
            </view>

            <!-- 功能介绍 -->
            <view class="section" id="features">
                <text class="section-title">✨ 功能介绍</text>

                <view class="help-card">
                    <text class="card-title">职业规划测评</text>
                    <text class="card-text">
                        提供多种专业的职业评估工具，包括职业兴趣、职业决策、职场压力、沟通协作等多维测评，帮助您明确发展方向。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">导师咨询</text>
                    <text class="card-text">
                        与资深行业导师进行预约咨询，获得简历优化、面试辅导和职业发展建议。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">成长记录追踪</text>
                    <text class="card-text">
                        记录并追踪您的测评结果历史，了解职业能力与目标清晰度的变化趋势。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">消息通知</text>
                    <text class="card-text">
                        接收导师预约确认、建议推荐等重要信息，不会错过任何关键通知。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">隐私保护</text>
                    <text class="card-text">
                        所有您的个人信息和测评数据都经过加密存储，我们严格遵守数据隐私政策，保护您的隐私。
                    </text>
                </view>
            </view>

            <!-- 常见问题 -->
            <view class="section" id="faq">
                <text class="section-title">❓ 常见问题</text>

                <view class="help-card">
                    <text class="card-title">Q: 我的数据安全吗？</text>
                    <text class="card-text">
                        A:
                        是的，我们采用业界领先的加密技术保护您的所有数据。所有个人信息和测试结果都被加密存储在安全的服务器上。我们遵守最严格的数据隐私政策，绝不向第三方泄露您的信息。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 如何修改我的账号信息？</text>
                    <text class="card-text">
                        A: 进入个人中心 →
                        账号管理，您可以修改邮箱、手机号、头像等信息。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 忘记密码怎么办？</text>
                    <text class="card-text">
                        A:
                        在登录页面点击"忘记密码"，通过邮箱或手机号验证后可以重置密码。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 平台导师是否真实存在？</text>
                    <text class="card-text">
                        A: 我们的导师均经过认证，具备真实行业履历与辅导经验。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 如何取消或修改预约？</text>
                    <text class="card-text">
                        A:
                        进入我的预约，选择要修改的预约，点击"修改"或"取消"按钮。预约前24小时可以修改，建议提前沟通。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 测试结果是否可信？</text>
                    <text class="card-text">
                        A:
                        我们提供的测评工具仅用于职业规划参考，最终决策建议结合导师一对一咨询。
                    </text>
                </view>
            </view>

            <!-- 联系我们 -->
            <view class="section" id="contact">
                <text class="section-title">📞 联系我们</text>

                <view class="help-card">
                    <text class="card-title">遇到问题？</text>
                    <text class="card-text">
                        如果您遇到任何问题或有建议，欢迎通过以下方式联系我们：
                    </text>
                </view>

                <view class="contact-methods">
                    <view class="method" @click="goToFeedback">
                        <text class="method-icon">💬</text>
                        <view class="method-info">
                            <text class="method-name">在线反馈</text>
                            <text class="method-desc">提交反馈和建议</text>
                        </view>
                    </view>
                    <view class="method">
                        <text class="method-icon">✉️</text>
                        <view class="method-info">
                            <text class="method-name">电子邮箱</text>
                            <text class="method-desc"
                                >support@warmmate.com</text
                            >
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        goBack() {
            uni.navigateBack();
        },
        scrollToSection(sectionId) {
            // 简单实现，uni-app中可能需要使用scroll-into-view
            const query = uni.createSelectorQuery();
            query
                .select(`#${sectionId}`)
                .boundingClientRect((rect) => {
                    if (rect) {
                        uni.pageScrollTo({
                            duration: 300,
                        });
                    }
                })
                .exec();
        },
        goToFeedback() {
            uni.navigateTo({
                url: "/pages/feedback/index",
            });
        },
    },
    computed: {
        containerClasses() {
            if (this.$store) {
                return this.$store.state.theme.isDarkMode ? "dark-mode" : "";
            }
            return "";
        },
    },
};
</script>

<style lang="scss" scoped>
.help-page {
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    min-height: 100vh;
    padding-bottom: 30rpx;

    &.dark-mode {
        background: #1a1a1a;
    }
}

/* 帮助内容 */
.help-content {
    padding: 20rpx;
}

.section {
    margin-bottom: 30rpx;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 15rpx;
    padding-bottom: 10rpx;
    border-bottom: 3rpx solid #60a5fa;

    .dark-mode & {
        color: #fff;
    }
}

.quick-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15rpx;
    margin-bottom: 20rpx;
}

.nav-item {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    &:hover {
        transform: translateY(-4rpx);
        box-shadow: 0 12rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    &:active {
        opacity: 0.8;
        transform: scale(0.98);
    }

    .nav-icon {
        font-size: 40rpx;
        margin-bottom: 10rpx;
    }

    .nav-text {
        font-size: 24rpx;
        color: #60a5fa;
        font-weight: 700;

        .dark-mode & {
            color: #fff;
        }
    }
}

.help-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    margin-bottom: 15rpx;
    border-left: 4rpx solid #3b82f6;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    .card-title {
        display: block;
        font-size: 26rpx;
        font-weight: 700;
        color: #60a5fa;
        margin-bottom: 10rpx;

        .dark-mode & {
            color: #fff;
        }
    }

    .card-text {
        display: block;
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;

        .dark-mode & {
            color: #ccc;
        }
    }
}

.contact-methods {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
}

.method {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    display: flex;
    align-items: center;
    gap: 15rpx;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    &:hover {
        transform: translateY(-4rpx);
    }

    &:active {
        opacity: 0.8;
    }

    .method-icon {
        font-size: 40rpx;
    }

    .method-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .method-name {
            display: block;
            font-size: 26rpx;
            font-weight: 700;
            color: #60a5fa;
            margin-bottom: 5rpx;

            .dark-mode & {
                color: #fff;
            }
        }

        .method-desc {
            display: block;
            font-size: 22rpx;
            color: #999;

            .dark-mode & {
                color: #999;
            }
        }
    }
}
</style>
