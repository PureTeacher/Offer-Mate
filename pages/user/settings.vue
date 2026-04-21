<template>
    <view :class="['settings-container', containerClasses]">
        <!-- 隐私设置 -->
        <view class="settings-section">
            <view class="section-title">隐私设置</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">显示我的心理数据</text>
                    <text class="item-desc"
                        >允许其他用户查看你的心理测试结果概览</text
                    >
                </view>
                <switch
                    :checked="settings.showPsychData"
                    @change="toggleSetting('showPsychData')"
                    color="#e07856"
                />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">允许位置分享</text>
                    <text class="item-desc">用于推荐周边心理咨询服务</text>
                </view>
                <switch
                    :checked="settings.allowLocation"
                    @change="toggleSetting('allowLocation')"
                    color="#e07856"
                />
            </view>
        </view>

        <!-- 通知设置 -->
        <view class="settings-section">
            <view class="section-title">通知设置</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">接收测试提醒</text>
                    <text class="item-desc">定期提醒你进行心理测试</text>
                </view>
                <switch
                    :checked="settings.testReminder"
                    @change="toggleSetting('testReminder')"
                    color="#e07856"
                />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">接收预约提醒</text>
                    <text class="item-desc">预约前24小时提前通知</text>
                </view>
                <switch
                    :checked="settings.appointmentReminder"
                    @change="toggleSetting('appointmentReminder')"
                    color="#e07856"
                />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">接收消息提醒</text>
                    <text class="item-desc">来自医生或平台的消息通知</text>
                </view>
                <switch
                    :checked="settings.messageReminder"
                    @change="toggleSetting('messageReminder')"
                    color="#e07856"
                />
            </view>
        </view>

        <!-- 显示设置 -->
        <view class="settings-section">
            <view class="section-title">显示设置</view>
            <view class="settings-item" @click="fontModalVisible = true">
                <view class="item-left">
                    <text class="item-label">字体大小</text>
                    <text class="item-desc">{{ fontSizeLabel }}</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
        </view>

        <!-- 数据与隐私 -->
        <view class="settings-section">
            <view class="section-title">数据与隐私</view>
            <view class="settings-item" @click="showPrivacy">
                <view class="item-left">
                    <text class="item-label">隐私政策</text>
                    <text class="item-desc">了解我们如何处理你的数据</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
            <view class="settings-item" @click="showTerms">
                <view class="item-left">
                    <text class="item-label">用户协议</text>
                    <text class="item-desc">查看服务条款</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
            <view class="settings-item" @click="confirmClearCache">
                <view class="item-left">
                    <text class="item-label">清空缓存</text>
                    <text class="item-desc">删除本地存储的临时数据</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
        </view>

        <!-- 关于 -->
        <view class="settings-section">
            <view class="section-title">关于</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">应用版本</text>
                    <text class="item-desc">v1.3.0</text>
                </view>
            </view>
        </view>

        <!-- 字体大小选择弹窗 -->
        <uni-popup ref="fontPopup" type="bottom" :maskClick="true">
            <view class="popup-container">
                <view class="popup-header">
                    <text class="popup-title">选择字体大小</text>
                    <view class="close-btn" @click="fontModalVisible = false"
                        >✕</view
                    >
                </view>
                <view class="popup-content font-options">
                    <view
                        class="font-option"
                        :class="{ selected: settings.fontSize === 'small' }"
                        @click="changeFontSize('small')"
                    >
                        <text class="font-preview small">Aa</text>
                        <text class="font-name">小</text>
                        <text
                            class="font-check"
                            v-if="settings.fontSize === 'small'"
                            >✓</text
                        >
                    </view>
                    <view
                        class="font-option"
                        :class="{ selected: settings.fontSize === 'medium' }"
                        @click="changeFontSize('medium')"
                    >
                        <text class="font-preview medium">Aa</text>
                        <text class="font-name">中（默认）</text>
                        <text
                            class="font-check"
                            v-if="settings.fontSize === 'medium'"
                            >✓</text
                        >
                    </view>
                    <view
                        class="font-option"
                        :class="{ selected: settings.fontSize === 'large' }"
                        @click="changeFontSize('large')"
                    >
                        <text class="font-preview large">Aa</text>
                        <text class="font-name">大</text>
                        <text
                            class="font-check"
                            v-if="settings.fontSize === 'large'"
                            >✓</text
                        >
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            settings: {
                showPsychData: true,
                allowLocation: false,
                testReminder: true,
                appointmentReminder: true,
                messageReminder: true,
                fontSize: this.$themeManager.getFontSize(),
            },
            fontModalVisible: false,
        };
    },
    computed: {
        fontSizeLabel() {
            const fontMap = {
                small: "小",
                medium: "中",
                large: "大",
            };
            return fontMap[this.settings.fontSize] || "中";
        },
    },
    watch: {
        fontModalVisible(newVal) {
            if (newVal) {
                this.$refs.fontPopup?.open();
            } else {
                this.$refs.fontPopup?.close();
            }
        },
    },
    onLoad() {
        this.loadSettings();
    },
    onShow() {
        // 每次进入页面更新设置
        this.settings.fontSize = this.$themeManager.getFontSize();
    },
    methods: {
        loadSettings() {
            try {
                const savedSettings = uni.getStorageSync("userSettings");
                if (savedSettings) {
                    this.settings = Object.assign(this.settings, savedSettings);
                }
            } catch (e) {
                console.error("加载设置出错", e);
            }
        },
        toggleSetting(key) {
            this.settings[key] = !this.settings[key];
            this.saveSettings();
        },
        changeFontSize(size) {
            this.settings.fontSize = size;
            this.$themeManager.setFontSize(size);
            this.fontModalVisible = false;
            uni.showToast({
                title: "字体大小已更改",
                icon: "success",
                duration: 800,
            });
        },
        saveSettings() {
            try {
                uni.setStorageSync("userSettings", this.settings);
                uni.showToast({
                    title: "设置已保存",
                    icon: "success",
                    duration: 1000,
                });
            } catch (e) {
                console.error("保存设置出错", e);
                uni.showToast({
                    title: "保存失败",
                    icon: "none",
                });
            }
        },
        showPrivacy() {
            uni.showModal({
                title: "隐私政策",
                content:
                    "我们尊重并保护您的个人隐私。本应用采用行业标准的安全措施来保护您的数据安全。详细内容请访问我们的官方网站。",
                showCancel: false,
                confirmText: "知道了",
            });
        },
        showTerms() {
            uni.showModal({
                title: "用户协议",
                content:
                    "使用本应用即表示您同意遵守用户协议。详细条款请访问我们的官方网站。",
                showCancel: false,
                confirmText: "知道了",
            });
        },
        confirmClearCache() {
            uni.showModal({
                title: "清空缓存",
                content: "确定要清空所有本地缓存吗？此操作无法撤销。",
                confirmColor: "#f5576c",
                success: (res) => {
                    if (res.confirm) {
                        this.clearCache();
                    }
                },
            });
        },
        clearCache() {
            try {
                uni.clearStorageSync();
                uni.showToast({
                    title: "缓存已清空",
                    icon: "success",
                    duration: 1000,
                });
            } catch (e) {
                console.error("清空缓存出错", e);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.settings-container {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
    padding-bottom: 20upx;

    &.theme-dark {
        background-color: #1a1a1a;

        .settings-section {
            background-color: #2d2d2d;
        }

        .section-title {
            color: #ffffff;
            border-bottom-color: #444444;
        }

        .settings-item {
            border-bottom-color: #444444;

            .item-label {
                color: #ffffff;
            }

            .item-desc {
                color: #aaaaaa;
            }

            .menu-arrow {
                color: #666666;
            }
        }

        .popup-container {
            background-color: #2d2d2d;

            .popup-header {
                border-bottom-color: #444444;

                .popup-title {
                    color: #ffffff;
                }

                .close-btn {
                    color: #aaaaaa;
                }
            }
        }

        .theme-option {
            background-color: #333333;
            border-color: #444444;

            .theme-name {
                color: #ffffff;
            }

            &.selected {
                background-color: #1a2d4d;
            }

            .theme-check {
                background-color: #444444;
            }
        }

        .font-option {
            background-color: #333333;
            border-color: #444444;

            .font-preview {
                color: #ffffff;
            }

            .font-name {
                color: #cccccc;
            }

            &.selected {
                background-color: #1a2d4d;
                border-color: #e07856;
            }

            .font-check {
                background-color: #444444;
                color: #e07856;
            }
        }
    }

    &.font-small {
        font-size: 24upx;
    }

    &.font-large {
        font-size: 32upx;
    }
}

.settings-section {
    background: rgba(255, 255, 255, 0.95);
    margin: 20upx 30upx;
    border-radius: 24upx;
    overflow: hidden;
    box-shadow: 0 8upx 24upx rgba(224, 120, 86, 0.12);
    backdrop-filter: blur(20upx);

    .section-title {
        padding: 20upx 30upx;
        font-size: 28upx;
        font-weight: bold;
        color: #d4744e;
        border-bottom: 1upx solid #f0f0f0;
    }
}

.settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24upx 30upx;
    border-bottom: 1upx solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    .item-left {
        flex: 1;
        display: flex;
        flex-direction: column;

        .item-label {
            font-size: 30upx;
            color: #333333;
            margin-bottom: 8upx;
        }

        .item-desc {
            font-size: 24upx;
            color: #999999;
        }
    }

    .menu-arrow {
        color: #cccccc;
        font-size: 32upx;
        margin-left: 20upx;
    }
}

// 弹窗样式
.popup-container {
    background-color: white;
    border-radius: 16upx 16upx 0 0;
    padding: 30upx 0;
    max-height: 600upx;

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30upx 20upx 30upx;
        border-bottom: 1upx solid #f0f0f0;

        .popup-title {
            font-size: 32upx;
            font-weight: bold;
            color: #333333;
        }

        .close-btn {
            font-size: 36upx;
            color: #999999;
            padding: 10upx;
            margin-right: -10upx;
        }
    }

    .popup-content {
        padding: 20upx 30upx;
        display: flex;
        flex-direction: column;
        gap: 16upx;
    }
}

// 字体大小选项样式
.font-options {
    display: flex;
    gap: 12upx;
    padding: 20upx 20upx !important;
    max-height: 400upx;
}

.font-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20upx 16upx;
    border: 2upx solid #f0f0f0;
    border-radius: 12upx;
    background-color: #fafafa;
    position: relative;
    transition: all 0.3s;

    &.selected {
        border-color: #e07856;
        background-color: #fff0e8;
    }

    .font-preview {
        font-weight: bold;
        margin-bottom: 12upx;
        color: #333333;

        &.small {
            font-size: 32upx;
        }

        &.medium {
            font-size: 40upx;
        }

        &.large {
            font-size: 48upx;
        }
    }

    .font-name {
        font-size: 22upx;
        color: #666666;
        text-align: center;
    }

    .font-check {
        position: absolute;
        top: 8upx;
        right: 8upx;
        font-size: 20upx;
        color: #e07856;
        background-color: white;
        border-radius: 50%;
        width: 28upx;
        height: 28upx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
}
</style>
