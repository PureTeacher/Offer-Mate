<template>
    <view :class="['about-page', containerClasses]">
        <view class="about-content">
            <view class="section">
                <text class="section-title">应用信息</text>
                <view class="item">
                    <text class="label">应用名称</text>
                    <text class="value">暖愈心伴</text>
                </view>
                <view class="item">
                    <text class="label">版本号</text>
                    <text class="value">1.3.0</text>
                </view>
                <view class="item">
                    <text class="label">描述</text>
                    <text class="value">
                        暖愈心伴是一款专业的心理健康管理应用，致力于为用户提供科学、便捷的心理健康服务。
                    </text>
                </view>
            </view>

            <view class="section">
                <text class="section-title">联系我们</text>
                <view class="item">
                    <text class="label">邮箱</text>
                    <text class="value">support@warmmate.com</text>
                </view>
                <view class="item">
                    <text class="label">电话</text>
                    <text class="value">400-123-4567</text>
                </view>
                <view class="item">
                    <text class="label">地址</text>
                    <text class="value">北京市朝阳区</text>
                </view>
            </view>

            <view class="section">
                <text class="section-title">法律声明</text>
                <text class="tips">
                    本应用所有内容仅供参考，不能替代专业医学建议。如有任何健康问题，请咨询专业医生。
                </text>
            </view>

            <view class="footer">
                <text class="footer-text"
                    >© 2026 Warm-Mate. All rights reserved.</text
                >
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        containerClasses() {
            if (this.$store) {
                return this.$store.state.theme.isDarkMode ? "dark-mode" : "";
            }
            return "";
        },
    },
    methods: {},
    onLoad() {
        uni.setNavigationBarTitle({
            title: "关于我们",
        });
    },
};
</script>

<style scoped lang="scss">
.about-page {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
}

.about-content {
    padding: 20rpx;
}

.section {
    margin-bottom: 25rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 25rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    backdrop-filter: blur(20rpx);
}

.section-title {
    display: block;
    font-size: 28rpx;
    font-weight: 700;
    color: #d4744e;
    margin-bottom: 20rpx;
}

.item {
    display: flex;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #eee;
    flex-direction: column;
}

.item:last-child {
    border-bottom: none;
}

.label {
    font-size: 22rpx;
    color: #e8825b;
    font-weight: 500;
    margin-bottom: 5rpx;
}

.value {
    font-size: 22rpx;
    color: #666;
    line-height: 1.5;
}

.tips {
    display: block;
    font-size: 22rpx;
    color: #666;
    line-height: 1.6;
}

.footer {
    display: flex;
    justify-content: center;
    padding: 50rpx 20rpx 30rpx;
}

.footer-text {
    font-size: 20rpx;
    color: #999;
}
</style>
