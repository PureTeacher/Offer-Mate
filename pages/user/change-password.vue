<template>
    <view :class="['password-container', containerClasses]">
        <!-- 页面头部 -->
        <view class="page-header">
            <text class="page-title">修改密码</text>
            <text class="page-desc">定期更新密码，保护账号安全</text>
        </view>

        <!-- 表单部分 -->
        <view class="form-section">
            <!-- 当前密码 -->
            <view class="form-group">
                <view class="form-label">
                    <text class="label-text">当前密码</text>
                    <text class="label-required">*</text>
                </view>
                <view class="password-input-wrapper">
                    <input
                        v-model="currentPassword"
                        :type="showCurrentPassword ? 'text' : 'password'"
                        placeholder="请输入当前密码"
                        class="password-input"
                        @blur="validateCurrentPassword"
                    />
                    <text
                        class="toggle-password-btn"
                        @click="showCurrentPassword = !showCurrentPassword"
                    >
                        {{ showCurrentPassword ? "隐藏" : "显示" }}
                    </text>
                </view>
                <text v-if="currentPasswordError" class="error-text">
                    {{ currentPasswordError }}
                </text>
            </view>

            <!-- 新密码 -->
            <view class="form-group">
                <view class="form-label">
                    <text class="label-text">新密码</text>
                    <text class="label-required">*</text>
                </view>
                <view class="password-input-wrapper">
                    <input
                        v-model="newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        placeholder="请输入新密码"
                        class="password-input"
                        @input="validateNewPassword"
                    />
                    <text
                        class="toggle-password-btn"
                        @click="showNewPassword = !showNewPassword"
                    >
                        {{ showNewPassword ? "隐藏" : "显示" }}
                    </text>
                </view>
                <text v-if="newPasswordError" class="error-text">
                    {{ newPasswordError }}
                </text>

                <!-- 密码强度指示器 -->
                <view class="strength-indicator">
                    <text class="strength-label">密码强度：</text>
                    <view class="strength-bar">
                        <view
                            class="strength-fill"
                            :class="'strength-' + passwordStrength"
                            :style="{ width: strengthWidth }"
                        ></view>
                    </view>
                    <text
                        class="strength-text"
                        :class="'strength-' + passwordStrength"
                    >
                        {{ strengthText }}
                    </text>
                </view>

                <!-- 密码要求检查表 -->
                <view class="requirements-checklist">
                    <text class="requirements-title">密码需满足以下条件：</text>

                    <view class="requirement-item">
                        <text :class="['requirement-icon', { met: lengthMet }]">
                            {{ lengthMet ? "✓" : "○" }}
                        </text>
                        <text class="requirement-text"> 6-16 个字符 </text>
                    </view>

                    <view class="requirement-item">
                        <text
                            :class="[
                                'requirement-icon',
                                {
                                    met:
                                        digitMet ||
                                        upperCaseMet ||
                                        lowerCaseMet,
                                },
                            ]"
                        >
                            {{
                                digitMet || upperCaseMet || lowerCaseMet
                                    ? "✓"
                                    : "○"
                            }}
                        </text>
                        <text class="requirement-text">
                            包含字母、数字或符号（至少一种）
                        </text>
                    </view>
                </view>
            </view>

            <!-- 确认密码 -->
            <view class="form-group">
                <view class="form-label">
                    <text class="label-text">确认密码</text>
                    <text class="label-required">*</text>
                </view>
                <view class="password-input-wrapper">
                    <input
                        v-model="confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="请再次输入新密码"
                        class="password-input"
                        @blur="validateConfirmPassword"
                    />
                    <text
                        class="toggle-password-btn"
                        @click="showConfirmPassword = !showConfirmPassword"
                    >
                        {{ showConfirmPassword ? "隐藏" : "显示" }}
                    </text>
                </view>
                <text v-if="confirmPasswordError" class="error-text">
                    {{ confirmPasswordError }}
                </text>
            </view>

            <!-- 安全提示 -->
            <view class="security-notice">
                <text class="notice-icon">ℹ️</text>
                <text class="notice-text">
                    密码修改后，请妥善保管，不要泄露给他人。为了账号安全，请定期更换密码。
                </text>
            </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-section">
            <button class="cancel-btn" @click="navigateBack">取消</button>
            <button
                class="submit-btn"
                :class="{ disabled: !canSubmit }"
                :disabled="!canSubmit"
                :loading="submitLoading"
                @click="submitPasswordChange"
            >
                确认修改
            </button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            showCurrentPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            currentPasswordError: "",
            newPasswordError: "",
            confirmPasswordError: "",
            submitLoading: false,
            containerClasses: "",
        };
    },
    computed: {
        lengthMet() {
            return (
                this.newPassword.length >= 6 && this.newPassword.length <= 16
            );
        },
        upperCaseMet() {
            return /[A-Z]/.test(this.newPassword);
        },
        lowerCaseMet() {
            return /[a-z]/.test(this.newPassword);
        },
        digitMet() {
            return /\d/.test(this.newPassword);
        },
        specialCharMet() {
            return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
                this.newPassword,
            );
        },
        passwordStrength() {
            // 简化的强度检查：只需要长度正确且包含允许的字符
            if (!this.newPassword) return "weak";
            if (!this.lengthMet) return "weak";

            // 检查是否只包含允许的字符
            const validCharsRegex =
                /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/;
            if (!validCharsRegex.test(this.newPassword)) return "weak";

            // 根据字符多样性判断强度
            const hasLetters = /[a-zA-Z]/.test(this.newPassword);
            const hasDigits = /\d/.test(this.newPassword);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
                this.newPassword,
            );

            const diversityCount = [hasLetters, hasDigits, hasSpecial].filter(
                Boolean,
            ).length;

            if (diversityCount <= 1) return "weak";
            if (diversityCount === 2) return "medium";
            return "strong";
        },
        strengthText() {
            switch (this.passwordStrength) {
                case "weak":
                    return "弱";
                case "medium":
                    return "中等";
                case "strong":
                    return "强";
                default:
                    return "未设置";
            }
        },
        strengthWidth() {
            if (!this.newPassword) return "0";
            switch (this.passwordStrength) {
                case "weak":
                    return "33.33%";
                case "medium":
                    return "66.66%";
                case "strong":
                    return "100%";
                default:
                    return "0";
            }
        },
        canSubmit() {
            return (
                this.currentPassword &&
                this.newPassword &&
                this.confirmPassword &&
                !this.currentPasswordError &&
                !this.newPasswordError &&
                !this.confirmPasswordError &&
                this.lengthMet
            );
        },
    },
    onLoad() {
        console.log("修改密码页面加载");
        this.applyTheme();
    },
    onShow() {
        this.applyTheme();
    },
    methods: {
        applyTheme() {
            const isDark = uni.getStorageSync("darkMode");
            const fontSize = this.$themeManager.getFontSize();
            const classes = [];

            if (isDark) {
                classes.push("dark-mode");
            }

            if (fontSize === "small") {
                classes.push("font-small");
            } else if (fontSize === "large") {
                classes.push("font-large");
            }

            this.containerClasses = classes.join(" ");
        },
        validateCurrentPassword() {
            this.currentPasswordError = "";
            if (!this.currentPassword) {
                this.currentPasswordError = "请输入当前密码";
                return false;
            }
            return true;
        },
        validateNewPassword() {
            this.newPasswordError = "";
            if (!this.newPassword) {
                return true;
            }
            if (this.newPassword.length < 6) {
                this.newPasswordError = "密码长度至少 6 个字符";
                return false;
            }
            if (this.newPassword.length > 16) {
                this.newPasswordError = "密码长度不能超过 16 个字符";
                return false;
            }
            if (this.newPassword === this.currentPassword) {
                this.newPasswordError = "新密码不能与当前密码相同";
                return false;
            }
            // 检查密码是否只包含字母、数字或符号
            const validCharsRegex =
                /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/;
            if (!validCharsRegex.test(this.newPassword)) {
                this.newPasswordError = "密码只能包含字母、数字或符号";
                return false;
            }
            return true;
        },
        validateConfirmPassword() {
            this.confirmPasswordError = "";
            if (!this.confirmPassword) {
                this.confirmPasswordError = "请再次输入新密码";
                return false;
            }
            if (this.confirmPassword !== this.newPassword) {
                this.confirmPasswordError = "两次输入的密码不一致";
                return false;
            }
            return true;
        },
        submitPasswordChange() {
            // 最终验证
            if (!this.validateCurrentPassword()) {
                return;
            }
            if (!this.validateNewPassword()) {
                return;
            }
            if (!this.validateConfirmPassword()) {
                return;
            }

            this.submitLoading = true;
            uni.showLoading({
                title: "修改中...",
            });

            // 调用修改密码 API
            this.$api.account
                .changePassword({
                    oldPassword: this.currentPassword,
                    newPassword: this.newPassword,
                })
                .then((res) => {
                    uni.hideLoading();
                    this.submitLoading = false;

                    if (res && res.code === 200) {
                        uni.showToast({
                            title: "密码修改成功",
                            icon: "success",
                            duration: 2000,
                        });

                        // 1.5秒后清除登录信息并跳转到登录页面
                        setTimeout(() => {
                            // 清除本地存储的登录信息
                            uni.removeStorageSync("Access-Token");
                            uni.removeStorageSync("userId");
                            uni.removeStorageSync("username");
                            uni.removeStorageSync("userInfo");
                            uni.removeStorageSync("uid");

                            // 跳转到登录页面
                            uni.reLaunch({
                                url: "/pages/login/login",
                            });
                        }, 1500);
                    } else {
                        uni.showToast({
                            title: res?.message || "修改失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    this.submitLoading = false;

                    // 改进错误提示
                    let errorMsg = "修改失败";
                    if (err && typeof err === "object") {
                        if (err.message) {
                            errorMsg = err.message;
                        } else if (err.statusText) {
                            errorMsg = err.statusText;
                        } else if (err.errMsg) {
                            errorMsg = err.errMsg;
                        }
                    } else if (typeof err === "string") {
                        errorMsg = err;
                    }

                    uni.showToast({
                        title: errorMsg,
                        icon: "none",
                    });
                });
        },
        navigateBack() {
            uni.navigateBack({
                delta: 1,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.password-container {
    padding: 20rpx 0;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    min-height: 100vh;
    font-size: 28rpx;

    &.dark-mode {
        background-color: #1a1a1a;
        color: #fff;
    }

    &.font-small {
        font-size: 24rpx;
    }

    &.font-large {
        font-size: 32rpx;
    }
}

.page-header {
    padding: 40rpx 30rpx 20rpx;
    text-align: center;

    .page-title {
        display: block;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
        color: #d4744e;

        .dark-mode & {
            color: #fff;
        }
    }

    .page-desc {
        display: block;
        font-size: 28rpx;
        color: #999;

        .dark-mode & {
            color: #ccc;
        }
    }
}

.form-section {
    margin: 20rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);

    .dark-mode & {
        background-color: #2a2a2a;
    }
}

.form-group {
    margin-bottom: 24rpx;

    &:last-child {
        margin-bottom: 0;
    }

    .form-label {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .label-text {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;

            .dark-mode & {
                color: #fff;
            }
        }

        .label-required {
            color: #f5576c;
            margin-left: 4rpx;
        }
    }

    .password-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .password-input {
            width: 100%;
            padding: 20rpx 40rpx 20rpx 20rpx;
            border: 1rpx solid #ddd;
            border-radius: 8rpx;
            font-size: 28rpx;
            color: #333;
            box-sizing: border-box;
            height: 80rpx;
            line-height: 40rpx;

            .dark-mode & {
                background-color: #333;
                border-color: #555;
                color: #fff;
            }
        }

        .toggle-password-btn {
            position: absolute;
            right: 16rpx;
            font-size: 22rpx;
            color: #e07856;
            padding: 8rpx 12rpx;
            cursor: pointer;

            .dark-mode & {
                color: #ff9d7a;
            }
        }
    }

    .error-text {
        display: block;
        margin-top: 8rpx;
        font-size: 22rpx;
        color: #f5576c;
    }

    .strength-indicator {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-top: 16rpx;
        padding: 12rpx;
        background-color: #f9f9f9;
        border-radius: 8rpx;

        .dark-mode & {
            background-color: #333;
        }

        .strength-label {
            font-size: 24rpx;
            color: #666;
            white-space: nowrap;

            .dark-mode & {
                color: #aaa;
            }
        }

        .strength-bar {
            flex: 1;
            height: 4rpx;
            background-color: #eee;
            border-radius: 2rpx;
            overflow: hidden;

            .dark-mode & {
                background-color: #555;
            }

            .strength-fill {
                height: 100%;
                border-radius: 2rpx;
                transition: width 0.3s ease;

                &.strength-weak {
                    background-color: #f5576c;
                }

                &.strength-medium {
                    background-color: #ff9f43;
                }

                &.strength-strong {
                    background-color: #00a65a;
                }
            }
        }

        .strength-text {
            font-size: 24rpx;
            min-width: 40rpx;

            &.strength-weak {
                color: #f5576c;
            }

            &.strength-medium {
                color: #ff9f43;
            }

            &.strength-strong {
                color: #00a65a;
            }
        }
    }

    .requirements-checklist {
        margin-top: 16rpx;
        padding: 16rpx;
        background-color: #f9f9f9;
        border-radius: 8rpx;
        border-left: 4rpx solid #e07856;

        .dark-mode & {
            background-color: #333;
            border-left-color: #ff9d7a;
        }

        .requirements-title {
            display: block;
            font-size: 24rpx;
            color: #666;
            margin-bottom: 12rpx;

            .dark-mode & {
                color: #aaa;
            }
        }

        .requirement-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8rpx;
            font-size: 22rpx;
            color: #999;

            .dark-mode & {
                color: #bbb;
            }

            &:last-child {
                margin-bottom: 0;
            }

            .requirement-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 24rpx;
                height: 24rpx;
                margin-right: 8rpx;
                font-size: 18rpx;
                color: #ddd;

                &.met {
                    color: #00a65a;
                }
            }

            .requirement-text {
                flex: 1;
            }
        }
    }
}

.security-notice {
    display: flex;
    gap: 12rpx;
    padding: 16rpx;
    background-color: #fef0f0;
    border-radius: 8rpx;
    margin-top: 24rpx;

    .dark-mode & {
        background-color: #3a1a1a;
    }

    .notice-icon {
        font-size: 28rpx;
        flex-shrink: 0;
    }

    .notice-text {
        font-size: 24rpx;
        color: #f5576c;
        line-height: 1.5;

        .dark-mode & {
            color: #ff8a9b;
        }
    }
}

.action-section {
    display: flex;
    gap: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;

    .cancel-btn,
    .submit-btn {
        flex: 1;
        padding: 16rpx;
        border-radius: 8rpx;
        font-size: 32rpx;
        font-weight: 600;
        border: none;
    }

    .cancel-btn {
        background-color: #f5f5f5;
        color: #333;

        .dark-mode & {
            background-color: #333;
            color: #fff;
        }

        &:active {
            opacity: 0.8;
        }
    }

    .submit-btn {
        background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
        color: #fff;

        &:active:not(.disabled) {
            opacity: 0.9;
        }

        &.disabled {
            background: #ccc;
            color: #999;
        }
    }
}
</style>
