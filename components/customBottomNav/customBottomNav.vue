<template>
    <view class="bottom-nav">
        <view
            class="nav-item"
            :class="{ active: currentPage === 'home' }"
            @click="navigateToHome"
        >
            <text class="nav-icon">🏠</text>
            <text class="nav-text">首页</text>
        </view>
        <view
            class="nav-item"
            :class="{ active: currentPage === 'user' }"
            @click="navigateToUser"
        >
            <text class="nav-icon">👤</text>
            <text class="nav-text">个人中心</text>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: String,
            default: "home",
        },
    },
    methods: {
        navigateToHome() {
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        navigateToUser() {
            uni.reLaunch({
                url: "/pages/user/index",
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #d4744e;
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* 强制清除阴影，绝对生效 */
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    z-index: 100;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s ease;

    &.active {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .nav-icon {
        font-size: 40rpx;
        margin-bottom: 4rpx;
        display: block;
    }

    .nav-text {
        font-size: 20rpx;
        display: block;
        font-weight: 500;
    }
}
</style>
