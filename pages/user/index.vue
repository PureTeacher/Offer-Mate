<template>
    <view :class="['user-center', containerClasses]">
        <!-- 用户信息卡片 -->
        <view class="user-info-card">
            <view class="avatar-container">
                <image
                    :src="userInfo.avatar_url || '/static/default-avatar.png'"
                    class="avatar"
                    mode="aspectFill"
                />
            </view>
            <view class="user-details">
                <text class="user-name">{{ userInfo.username || "用户" }}</text>
                <text class="user-id"
                    >UID: {{ userInfo.uid || userInfo.id || "暂未获取" }}</text
                >
            </view>
        </view>

        <!-- 功能菜单列表 -->
        <view class="menu-container">
            <view class="menu-item" @click="navigateTo('account')">
                <view class="menu-left">
                    <text class="menu-icon">👤</text>
                    <view class="menu-text">
                        <text class="menu-title">账号管理</text>
                        <text class="menu-desc">修改绑定的手机和邮箱</text>
                    </view>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>

            <view class="menu-item" @click="navigateTo('password')">
                <view class="menu-left">
                    <text class="menu-icon">🔐</text>
                    <view class="menu-text">
                        <text class="menu-title">修改密码</text>
                        <text class="menu-desc">更新你的登录密码</text>
                    </view>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>

            <view class="menu-item" @click="navigateTo('settings')">
                <view class="menu-left">
                    <text class="menu-icon">⚙️</text>
                    <view class="menu-text">
                        <text class="menu-title">设置</text>
                        <text class="menu-desc">隐私、通知、显示设置</text>
                    </view>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>

            <view class="menu-item" @click="navigateTo('feedback')">
                <view class="menu-left">
                    <text class="menu-icon">💬</text>
                    <view class="menu-text">
                        <text class="menu-title">帮助与反馈</text>
                        <text class="menu-desc">向我们提出建议和问题</text>
                    </view>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>

            <view class="menu-item" @click="navigateTo('about')">
                <view class="menu-left">
                    <text class="menu-icon">ℹ️</text>
                    <view class="menu-text">
                        <text class="menu-title">关于我们</text>
                        <text class="menu-desc">了解"暖愈心伴"信息</text>
                    </view>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
        </view>

        <!-- 退出登录按钮 -->
        <view class="logout-section">
            <button class="logout-btn" @click="confirmLogout">退出登录</button>
        </view>

        <!-- 底部导航栏 -->
        <custom-bottom-nav currentPage="user" />
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
            userInfo: {
                username: "",
                id: "",
                uid: "",
                avatar_url: "",
                phone: "",
                email: "",
            },
        };
    },
    onLoad() {
        console.log("[user/index] onLoad 被调用");
        // 隐藏底部导航栏
        uni.hideTabBar();
        this.loadUserInfo();
    },
    onShow() {
        console.log("[user/index] onShow 被调用");
        // 每次进入页面刷新用户信息，确保退出后状态正确
        this.loadUserInfo();
    },
    methods: {
        loadUserInfo() {
            try {
                const userInfo = uni.getStorageSync("userInfo");
                if (userInfo) {
                    this.userInfo = {
                        username: userInfo.username || "用户",
                        id: userInfo.id || userInfo.userId || "暂未获取",
                        uid:
                            userInfo.uid ||
                            (userInfo.id
                                ? 100000000 + parseInt(userInfo.id)
                                : "暂未获取"),
                        avatar_url: userInfo.avatar_url || "",
                        phone: userInfo.phone || "未绑定手机",
                        email: userInfo.email || "",
                    };
                    this.fetchUserInfoFromServer();
                } else {
                    this.userInfo = {
                        username: "",
                        id: "",
                        uid: "",
                        avatar_url: "",
                        phone: "",
                        email: "",
                    };
                    this.fetchUserInfoFromServer();
                }
            } catch (e) {
                console.error("获取用户信息失败", e);
            }
        },

        async fetchUserInfoFromServer() {
            try {
                const response = await this.$api.user.getInfo();
                if (response && response.code === 200 && response.data) {
                    const data = response.data;
                    this.userInfo = {
                        username: data.username || "用户",
                        id: data.id || "暂未获取",
                        uid: data.uid || 100000000 + data.id || "暂未获取",
                        avatar_url: data.avatar_url || "",
                        phone: data.phone || "未绑定手机",
                        email: data.email || "",
                    };
                    uni.setStorageSync("userInfo", this.userInfo);
                }
            } catch (error) {
                console.error("获取用户信息出错", error);
            }
        },
        navigateTo(page) {
            console.log("点击导航:", page);
            const pageRoutes = {
                account: "/pages/user/account",
                password: "/pages/user/change-password",
                settings: "/pages/user/settings",
                feedback: "/pages/feedback/index",
                about: "/pages/about/index",
            };

            const route = pageRoutes[page];
            console.log("导航目标:", route);
            if (route) {
                uni.navigateTo({
                    url: route,
                    success: () => {
                        console.log("导航成功");
                    },
                    fail: (err) => {
                        console.error("导航失败:", err);
                        uni.showToast({
                            title: "页面加载失败",
                            icon: "none",
                        });
                    },
                });
            } else {
                uni.showToast({
                    title: `${page} 功能开发中`,
                    icon: "none",
                });
            }
        },
        // 核心退出登录逻辑，原生确认弹框
        confirmLogout() {
            console.log("点击了退出登录按钮");
            // 原生确认弹框，完全不用第三方组件
            uni.showModal({
                title: "退出登录",
                content: "确定要退出登录吗？",
                confirmColor: "#f5576c",
                success: (res) => {
                    console.log("弹框操作结果：", res);
                    // 点击了确定
                    if (res.confirm) {
                        this.handleLogout();
                    }
                },
            });
        },
        // 执行退出逻辑
        handleLogout() {
            try {
                console.log("开始执行退出逻辑");
                // 1. 清除登录态（这里必须和你登录时存的key完全一致！！）
                uni.removeStorageSync("Access-Token");
                uni.removeStorageSync("userInfo");
                console.log("清除存储完成");

                // 2. 提示成功
                uni.showToast({
                    title: "已退出登录",
                    icon: "success",
                    duration: 800,
                });

                // 3. 延迟跳转，确保提示显示完成
                setTimeout(() => {
                    console.log("开始跳转登录页");
                    uni.reLaunch({
                        // ！！！这里必须和你pages.json里的登录页路径完全一致！！！
                        url: "/pages/login/login",
                        success: () => {
                            console.log("跳转登录页成功");
                        },
                        fail: (err) => {
                            console.error("跳转登录页失败", err);
                            uni.showToast({
                                title: "跳转失败，请检查登录页路径",
                                icon: "none",
                                duration: 2000,
                            });
                        },
                    });
                }, 800);
            } catch (e) {
                console.error("退出登录异常", e);
                uni.showToast({
                    title: "退出失败，请重试",
                    icon: "none",
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.user-center {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
    padding-bottom: 220rpx;
}

/* 用户信息卡片 */
.user-info-card {
    background: linear-gradient(135deg, #e07856 0%, #d4744e 50%, #c85a3a 100%);
    padding: 40rpx 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);

    .avatar-container {
        margin-right: 30rpx;
        position: relative;
        z-index: 10;

        .avatar {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            border: 4rpx solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.2);
            object-fit: cover;
        }
    }

    .user-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .user-name {
            font-size: 32rpx;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8rpx;
            display: block;
        }

        .user-id {
            font-size: 22rpx;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 6rpx;
            display: block;
        }

        .user-phone {
            font-size: 20rpx;
            color: rgba(255, 255, 255, 0.7);
            display: block;
        }
    }
}

/* 功能菜单列表 */
.menu-container {
    background: rgba(255, 255, 255, 0.95);
    margin: 24rpx 20rpx;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    overflow: hidden;
    backdrop-filter: blur(20rpx);
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background: #f9f9f9;
    }

    .menu-left {
        display: flex;
        align-items: center;
        flex: 1;

        .menu-icon {
            font-size: 40rpx;
            margin-right: 20rpx;
            width: 50rpx;
            text-align: center;
        }

        .menu-text {
            flex: 1;
            display: flex;
            flex-direction: column;

            .menu-title {
                font-size: 28rpx;
                font-weight: 600;
                color: #333;
                margin-bottom: 6rpx;
                display: block;
            }

            .menu-desc {
                font-size: 20rpx;
                color: #999;
                display: block;
            }
        }
    }

    .menu-arrow {
        font-size: 24rpx;
        color: #d4744e;
        margin-left: 10rpx;
        opacity: 0.6;
        transition: all 0.3s ease;
    }

    &:hover .menu-arrow {
        opacity: 1;
    }
}

/* 退出登录按钮 */
.logout-section {
    padding: 40rpx 30rpx;

    .logout-btn {
        width: 100%;
        height: 80rpx;
        background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
        color: white;
        font-size: 28rpx;
        font-weight: 700;
        border: none;
        border-radius: 24rpx;
        box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);
        transition: all 0.3s ease;

        &:active {
            transform: translateY(-2rpx);
            box-shadow: 0 6rpx 20rpx rgba(245, 87, 108, 0.4);
        }
    }
}
</style>
