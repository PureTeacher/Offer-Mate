<template>
    <view :class="['page-container', containerClasses]">
        <!-- 顶部导航栏 -->
        <view class="header">
            <view class="header-content">
                <view class="header-top">
                    <text class="sunshine-title">暖愈心伴</text>
                    <view class="deco-dot"></view>
                </view>
                <text class="header-subtitle">用心倾听每一个心声</text>
                <view class="header-decoration"></view>
            </view>
        </view>

        <!-- 卡片列表区域（禁止滚动） -->
        <view
            class="content"
            :style="{ minHeight: screenMinHeight + 'rpx', overflow: 'hidden' }"
        >
            <!-- 卡片容器：flex双列布局 -->
            <view class="content-wrapper">
                <view class="greeting-section">
                    <text class="greeting-text">选择你需要的服务</text>
                    <view class="greeting-line"></view>
                </view>
                <view class="card-container">
                    <!-- 循环生成卡片 -->
                    <view
                        v-for="(item, index) in cardList"
                        :key="item.id"
                        class="card"
                        :style="{ background: item.gradient }"
                        @click="navigateTo(item.path)"
                    >
                        <view class="card-shine"></view>
                        <view class="card-header">
                            <view class="emoji-container">
                                <image
                                    class="card-emoji"
                                    :src="item.iconPath"
                                    mode="aspectFit"
                                />
                            </view>
                            <view class="card-tag">{{ item.tag }}</view>
                        </view>
                        <view class="card-content">
                            <text class="card-title">{{ item.title }}</text>
                            <text class="card-desc">{{ item.desc }}</text>
                        </view>
                        <view class="card-footer">
                            <text class="card-arrow">→</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部导航栏 -->
        <custom-bottom-nav currentPage="home" />
    </view>
</template>

<script>
import customBottomNav from "@/components/customBottomNav/customBottomNav.vue";

export default {
    components: {
        customBottomNav,
    },
    data() {
        return {
            screenMinHeight: 1500, // 默认值（单位：rpx）
            // 卡片数据示例
            cardList: [
                {
                    id: 1,
                    title: "心理体检",
                    desc: "专业心理量表｜3分钟快速情绪体检",
                    iconPath: "/static/custom-icon-1.png",
                    path: "/pages/phq7-test/index",
                    bgColor: "#E8F5E9",
                    tag: "专业评估",
                    gradient:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
                {
                    id: 2,
                    title: "健康科普",
                    desc: "专业健康知识｜科学养生，健康生活",
                    iconPath: "/static/custom-icon-2.png",
                    path: "/pages/health/index",
                    bgColor: "#E3F2FD",
                    tag: "知识分享",
                    gradient:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                },
                {
                    id: 3,
                    title: "心理医生",
                    desc: "专业心理咨询师｜一对一专业指导",
                    iconPath: "/static/custom-icon-3.png",
                    path: "/pages/psychologist/index",
                    bgColor: "#FFF8E1",
                    tag: "专业咨询",
                    gradient:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                },
                {
                    id: 4,
                    title: "AI交流",
                    desc: "智能心理助手｜24小时在线陪伴",
                    iconPath: "/static/custom-icon-4.png",
                    path: "/pages/message/message",
                    bgColor: "#FCE4EC",
                    tag: "智能陪伴",
                    gradient:
                        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                },
            ],
        };
    },
    onLoad() {
        // 隐藏底部导航栏
        uni.hideTabBar();
        // uni.removeStorageSync("Access-Token");
        const accessToken = uni.getStorageSync("Access-Token");
        // console.log("accessToken")
        // console.log(accessToken)
        if (!accessToken) {
            uni.$u.route("/pages/login/login");
        }
    },
    mounted() {
        // 获取设备信息
        const systemInfo = uni.getSystemInfoSync();
        // 核心计算公式：将物理像素高度转换为 rpx
        this.screenMinHeight = Math.ceil(
            systemInfo.screenHeight * (750 / systemInfo.windowWidth),
        );
    },
    methods: {
        loadMore() {
            console.log("触发加载更多");
            // 这里可添加分页加载逻辑
        },
        navigateTo(path) {
            uni.navigateTo({
                url: path,
            });
        },
    },
};
</script>

<style lang="scss">
/* 页面容器 - 温暖背景渐变 */
.page-container {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    border-bottom: none !important;
}

.content {
    height: calc(100vh - 140rpx - 100rpx);
    overflow: hidden;
    border-bottom: none !important;
    box-shadow: none !important;
    background: transparent;
}

/* 全局去除下划线和边框 */
.page-container,
.page-container * {
    border: none !important;
    border-bottom: none !important;
    text-decoration: none !important;
    outline: none !important;
}

/* 卡片头部样式 */
.card-header {
    position: relative;
    height: 180rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx 16rpx 0 0;
    overflow: hidden;
}

.emoji-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10rpx);
}

.card-emoji {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    object-fit: contain;
    filter: drop-shadow(0 2rpx 6rpx rgba(0, 0, 0, 0.08));
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0rpx);
    }
    50% {
        transform: translateY(-8rpx);
    }
}

.card-tag {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    background: rgba(255, 255, 255, 0.95);
    color: #d4854f;
    font-size: 20rpx;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-weight: 600;
    backdrop-filter: blur(10rpx);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* Header 样式 - 更温馨的渐变 */
.header {
    height: 140rpx;
    padding-top: var(--status-bar-height);
    background: linear-gradient(135deg, #e07856 0%, #d4744e 50%, #c85a3a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10rpx);
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -1rpx;
        left: 0;
        right: 0;
        height: 1rpx;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
    }
}

.header-content {
    position: relative;
    z-index: 2;
    text-align: center;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
}

.deco-dot {
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.6;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

.header-subtitle {
    display: block;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 8rpx;
    font-weight: 500;
    letter-spacing: 0.5rpx;
}

.header-decoration {
    width: 60rpx;
    height: 2rpx;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
    );
    margin-top: 8rpx;
}

/* 问候语部分 */
.greeting-section {
    padding: 32rpx 24rpx 20rpx;
    position: relative;
}

.greeting-text {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #d4744e;
    margin-bottom: 12rpx;
    letter-spacing: 0.5rpx;
}

.greeting-line {
    width: 60rpx;
    height: 3rpx;
    background: linear-gradient(90deg, #e07856, #d4744e);
    border-radius: 2rpx;
}

/* 卡片容器样式 */
.card-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 8rpx 24rpx 40rpx;
    gap: 20rpx;
}

.card {
    width: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow:
        0 8rpx 24rpx rgba(224, 120, 86, 0.12),
        0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    min-height: 310rpx;
    position: relative;
    display: flex;
    flex-direction: column;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 24rpx;
        z-index: 1;
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-8rpx);
        box-shadow:
            0 16rpx 32rpx rgba(224, 120, 86, 0.18),
            0 4rpx 12rpx rgba(0, 0, 0, 0.12);
    }

    &:active {
        transform: translateY(-4rpx) scale(0.99);
        box-shadow: 0 12rpx 28rpx rgba(224, 120, 86, 0.15);
    }
}

.card-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1rpx;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    z-index: 2;
}

.card-content {
    padding: 24rpx;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20rpx);
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    display: block;
    font-size: 30rpx;
    font-weight: 700;
    color: #2c2c2c;
    margin-bottom: 10rpx;
}

.card-desc {
    display: block;
    font-size: 22rpx;
    color: #666;
    line-height: 1.6;
    opacity: 0.85;
    margin-bottom: 0;
}

.card-footer {
    padding: 0 24rpx 20rpx;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20rpx);
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
}

.card-arrow {
    font-size: 28rpx;
    color: #d4744e;
    font-weight: 600;
    opacity: 0.7;
    transition: all 0.3s ease;
}

.card:hover .card-arrow {
    opacity: 1;
    transform: translateX(4rpx);
}

.content {
    flex: 1;
    background: transparent;
    padding: 0;
    min-height: auto;
    position: relative;
    overflow-y: auto;
}

.content-wrapper {
    min-height: auto;
    max-width: 750rpx;
    background: transparent;
    margin: 0 auto;
    padding: 0;
    position: relative;
    z-index: 1;
}

.sunshine-title {
    font-weight: 800;
    color: #ffffff;
    text-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.25);
    font-size: 40rpx;
    position: relative;
    display: inline-block;
    z-index: 2;
    letter-spacing: 2rpx;
}

.sunshine-title::before {
    position: absolute;
    left: -50rpx;
    top: -8rpx;
    font-size: 40rpx;
    filter: drop-shadow(0 2rpx 6rpx rgba(0, 0, 0, 0.2));
}
</style>
