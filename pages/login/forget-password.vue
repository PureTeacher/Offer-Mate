<template>
    <view :class="['forget-password', containerClasses]">
        <view class="container">
            <!-- 返回按钮 -->
            <view class="header">
                <text class="back-arrow" @click="goBack">←</text>
                <text class="header-title">找回密码</text>
                <view style="width: 40px"></view>
            </view>

            <!-- 步骤指示器 -->
            <view class="steps">
                <view
                    class="step"
                    :class="{
                        active: currentStep >= 1,
                        completed: currentStep > 1,
                    }"
                >
                    <text class="step-number">1</text>
                    <text class="step-label">验证手机</text>
                </view>
                <view
                    class="step-line"
                    :class="{ active: currentStep > 1 }"
                ></view>
                <view
                    class="step"
                    :class="{
                        active: currentStep >= 2,
                        completed: currentStep > 2,
                    }"
                >
                    <text class="step-number">2</text>
                    <text class="step-label">输入验证码</text>
                </view>
                <view
                    class="step-line"
                    :class="{ active: currentStep > 2 }"
                ></view>
                <view
                    class="step"
                    :class="{
                        active: currentStep >= 3,
                        completed: currentStep > 3,
                    }"
                >
                    <text class="step-number">3</text>
                    <text class="step-label">设置密码</text>
                </view>
            </view>

            <!-- 第一步：输入手机号 -->
            <view class="form-section" v-if="currentStep === 1">
                <view class="section-title">请输入您的手机号</view>
                <view class="input-group">
                    <u--input
                        placeholder="请输入手机号"
                        v-model="phone"
                        type="text"
                        @input="handlePhoneInput"
                        maxlength="11"
                    />
                </view>
                <text class="error-message" v-if="phoneError">{{
                    phoneError
                }}</text>

                <u-button
                    type="primary"
                    text="发送验证码"
                    :loading="sendCodeLoading"
                    :disabled="!isPhoneValid || sendCodeLoading"
                    @click="sendVerificationCode"
                    customStyle="margin-top: 30px"
                />
            </view>

            <!-- 第二步：输入验证码 -->
            <view class="form-section" v-if="currentStep === 2">
                <view class="section-title">请输入验证码</view>
                <text class="tip-text">验证码已发送到 {{ phone }}</text>

                <view class="code-input-group">
                    <u--input
                        placeholder="请输入6位验证码"
                        v-model="verificationCode"
                        type="text"
                        maxlength="6"
                        @input="debounceValidateCode"
                    />
                </view>
                <text class="error-message" v-if="codeError">{{
                    codeError
                }}</text>

                <!-- 重新发送倒计时 -->
                <view class="resend-section" v-if="resendCountdown > 0">
                    <text class="resend-text"
                        >{{ resendCountdown }}秒后可重新发送</text
                    >
                </view>
                <view class="resend-section" v-else>
                    <text class="resend-link" @click="resendCode"
                        >重新发送验证码</text
                    >
                </view>

                <view class="button-group">
                    <u-button
                        type="default"
                        text="上一步"
                        @click="previousStep"
                        customStyle="flex: 1; margin-right: 10px"
                    />
                    <u-button
                        type="primary"
                        text="下一步"
                        :disabled="!isCodeValid"
                        @click="verifyCodeAndContinue"
                        customStyle="flex: 1"
                    />
                </view>
            </view>

            <!-- 第三步：设置新密码 -->
            <view class="form-section" v-if="currentStep === 3">
                <view class="section-title">设置新密码</view>

                <view class="input-group">
                    <u--input
                        placeholder="请输入新密码（6-16位）"
                        v-model="newPassword"
                        type="password"
                        password
                        @input="validatePassword"
                    />
                </view>
                <text class="error-message" v-if="passwordError">{{
                    passwordError
                }}</text>
                <text class="tip-text" v-if="!passwordError && newPassword">{{
                    passwordTip
                }}</text>

                <view class="input-group">
                    <u--input
                        placeholder="请确认密码"
                        v-model="confirmPassword"
                        type="password"
                        password
                        @input="validateConfirmPassword"
                    />
                </view>
                <text class="error-message" v-if="confirmPasswordError">{{
                    confirmPasswordError
                }}</text>

                <view class="button-group">
                    <u-button
                        type="default"
                        text="上一步"
                        @click="previousStep"
                        customStyle="flex: 1; margin-right: 10px"
                    />
                    <u-button
                        type="primary"
                        text="完成"
                        :loading="resetLoading"
                        :disabled="!isPasswordValid || resetLoading"
                        @click="resetPassword"
                        customStyle="flex: 1"
                    />
                </view>
            </view>

            <!-- 成功界面 -->
            <view class="success-section" v-if="currentStep === 4">
                <view class="success-icon">✅</view>
                <text class="success-title">密码重置成功！</text>
                <text class="success-desc">您可以使用新密码登录了</text>
                <u-button
                    type="primary"
                    text="返回登录"
                    @click="backToLogin"
                    customStyle="margin-top: 50px"
                />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentStep: 1,
            phone: "",
            phoneError: "",
            verificationCode: "",
            codeError: "",
            newPassword: "",
            passwordError: "",
            passwordTip: "",
            confirmPassword: "",
            confirmPasswordError: "",
            sendCodeLoading: false,
            resetLoading: false,
            resendCountdown: 0,
            codeDebounceTimer: null,
        };
    },
    computed: {
        isPhoneValid() {
            const phoneRegex = /^1[3-9]\d{9}$/;
            return phoneRegex.test(this.phone);
        },
        isCodeValid() {
            return (
                this.verificationCode &&
                this.verificationCode.length === 6 &&
                !this.codeError
            );
        },
        isPasswordValid() {
            return (
                this.newPassword &&
                this.confirmPassword &&
                this.newPassword === this.confirmPassword &&
                this.newPassword.length >= 6 &&
                this.newPassword.length <= 16 &&
                !this.passwordError &&
                !this.confirmPasswordError
            );
        },
    },
    methods: {
        handlePhoneInput() {
            this.phoneError = "";
            if (this.phone && !this.isPhoneValid) {
                this.phoneError = "请输入正确的手机号";
            }
        },

        async sendVerificationCode() {
            if (!this.isPhoneValid) {
                this.phoneError = "请输入正确的手机号";
                return;
            }

            this.sendCodeLoading = true;
            try {
                // 直接使用HTTP请求而不依赖API对象
                const baseUrl = "http://47.94.217.78:7001/alibaba-ai/v1";
                const url = `${baseUrl}/user/password/reset-code`;

                console.log("发送请求到:", url);
                console.log("请求参数:", { phone: this.phone });

                const response = await uni.$u.http.post(
                    url,
                    {
                        phone: this.phone,
                    },
                    {
                        custom: { auth: false, catch: true, toast: false },
                    },
                );

                console.log("API响应:", response);

                if (response && response.code === 200) {
                    uni.$u.toast("验证码已发送");
                    this.currentStep = 2;
                    this.startResendCountdown();
                    // 开发环境显示验证码
                    if (response.data && response.data.verificationCode) {
                        uni.$u.toast(
                            `验证码: ${response.data.verificationCode}`,
                            3000,
                        );
                    }
                } else {
                    let errorMsg = response?.message || "发送失败，请重试";

                    // 检查是否是频率限制错误
                    if (
                        errorMsg &&
                        (errorMsg.includes("frequency") ||
                            errorMsg.includes("频繁"))
                    ) {
                        errorMsg = "请求过于频繁，请稍候再试（建议60秒后重试）";
                        // 对频率限制错误也启动倒计时
                        this.startResendCountdown();
                    }

                    console.log("错误信息:", errorMsg);
                    uni.$u.toast(errorMsg, 3000);
                }
            } catch (error) {
                console.error("发送验证码错误详情:", error);

                let errorMsg = "网络错误或服务器无响应，请稍后重试";

                // 检查响应中的错误信息（适用于 catch: true 的情况）
                if (error && error.data) {
                    const msg = error.data.message || "";
                    if (
                        msg &&
                        (msg.includes("frequency") || msg.includes("频繁"))
                    ) {
                        errorMsg = "请求过于频繁，请稍候再试（建议60秒后重试）";
                        this.startResendCountdown();
                    } else {
                        errorMsg = msg || errorMsg;
                    }
                } else if (error && error.message) {
                    // 普通错误对象
                    if (error.message.includes("frequency")) {
                        errorMsg = "请求过于频繁，请稍候再试（建议60秒后重试）";
                        this.startResendCountdown();
                    } else {
                        errorMsg = error.message;
                    }
                }

                uni.$u.toast(errorMsg, 3000);
            } finally {
                this.sendCodeLoading = false;
            }
        },

        resendCode() {
            this.sendVerificationCode();
        },

        startResendCountdown() {
            this.resendCountdown = 60;
            const timer = setInterval(() => {
                this.resendCountdown--;
                if (this.resendCountdown <= 0) {
                    clearInterval(timer);
                }
            }, 1000);
        },

        debounceValidateCode() {
            this.codeError = "";
            clearTimeout(this.codeDebounceTimer);
            if (this.verificationCode.length === 6) {
                this.codeDebounceTimer = setTimeout(() => {
                    if (!/^\d{6}$/.test(this.verificationCode)) {
                        this.codeError = "验证码必须是6位数字";
                    }
                }, 300);
            }
        },

        async verifyCodeAndContinue() {
            if (!this.isCodeValid) {
                this.codeError = "请输入正确的验证码";
                return;
            }
            this.currentStep = 3;
        },

        validatePassword() {
            this.passwordError = "";
            this.passwordTip = "";

            if (!this.newPassword) {
                this.passwordTip = "";
                return;
            }

            if (this.newPassword.length < 6) {
                this.passwordTip = `密码长度：${this.newPassword.length}/6`;
                return;
            }

            if (this.newPassword.length > 16) {
                this.passwordError = "密码长度不能超过16位";
                return;
            }

            const hasValid =
                /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/.test(
                    this.newPassword,
                );
            if (!hasValid) {
                this.passwordError = "密码只能包含字母、数字或符号";
                return;
            }

            this.passwordTip = "密码强度：中等";
        },

        validateConfirmPassword() {
            this.confirmPasswordError = "";
            if (
                this.confirmPassword &&
                this.confirmPassword !== this.newPassword
            ) {
                this.confirmPasswordError = "两次输入的密码不一致";
            }
        },

        previousStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        },

        async resetPassword() {
            if (!this.isPasswordValid) {
                uni.$u.toast("请检查密码设置");
                return;
            }

            this.resetLoading = true;
            try {
                // 直接使用HTTP请求而不依赖API对象
                const baseUrl = "http://47.94.217.78:7001/alibaba-ai/v1";
                const url = `${baseUrl}/user/password/reset`;

                const response = await uni.$u.http.post(
                    url,
                    {
                        phone: this.phone,
                        code: this.verificationCode,
                        newPassword: this.newPassword,
                    },
                    {
                        custom: { auth: false, catch: true, toast: false },
                    },
                );

                console.log("重置密码响应:", response);

                if (response && response.code === 200) {
                    uni.$u.toast("密码重置成功");
                    this.currentStep = 4;
                } else {
                    uni.$u.toast(response?.message || "重置失败，请重试");
                }
            } catch (error) {
                console.error("重置密码错误:", error);
                uni.$u.toast("网络错误，请检查连接");
            } finally {
                this.resetLoading = false;
            }
        },

        backToLogin() {
            uni.$u.route("/pages/login/login");
        },

        goBack() {
            if (this.currentStep > 1) {
                this.previousStep();
            } else {
                uni.navigateBack();
            }
        },
    },
    onShow() {
        // 主题已由全局mixin处理，不需要在这里处理containerClasses
    },
};
</script>

<style lang="scss" scoped>
.forget-password {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    padding: 20px;
    display: flex;
    align-items: center;

    &.dark-mode {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
}

.container {
    width: 100%;
    max-width: 650px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: visible;

    .dark-mode & {
        background: #2d2d44;
        color: white;
    }
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    background: #d4744e;
    padding: 20px;
    border-radius: 15px;

    .back-arrow {
        font-size: 28px;
        cursor: pointer;
        color: white;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;

        &:active {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0.9);
        }
    }

    .header-title {
        font-size: 24px;
        font-weight: bold;
        color: white;
        flex: 1;
        text-align: center;

        .dark-mode & {
            color: white;
        }
    }
}

.steps {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 50px;
    position: relative;
    padding: 0 40px;
    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #999;
            font-size: 16px;

            .dark-mode & {
                background: #3d3d5c;
                color: #999;
            }
        }

        .step-label {
            font-size: 12px;
            color: #999;
        }

        &.active .step-number {
            background: #d4744e;
            color: white;
        }

        &.completed .step-number {
            background: #4caf50;
            color: white;
        }
    }

    .step-line {
        flex: 1;
        height: 2px;
        background: #e0e0e0;
        margin: 0 10px;
        margin-top: -20px;

        .dark-mode & {
            background: #3d3d5c;
        }

        &.active {
            background: #d4744e;
        }
    }
}

.form-section {
    margin-top: 30px;
    padding: 0 40px;

    .section-title {
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;

        .dark-mode & {
            color: white;
        }
    }

    .input-group {
        margin-bottom: 20px;
    }

    .error-message {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }

    .tip-text {
        color: #999;
        font-size: 12px;
        margin-bottom: 15px;
        display: block;

        .dark-mode & {
            color: #aaa;
        }
    }

    .code-input-group {
        margin: 20px 0;
    }

    .resend-section {
        text-align: center;
        margin: 20px 0;

        .resend-text {
            color: #999;
            font-size: 12px;
        }

        .resend-link {
            color: #d4744e;
            font-size: 12px;
            cursor: pointer;
        }
    }

    .button-group {
        display: flex;
        gap: 10px;
        margin-top: 30px;
    }
}

/* 覆盖主按钮颜色 */
::v-deep .u-button--primary {
    background-color: #d4744e !important;
    border-color: #d4744e !important;
}

::v-deep .u-button--primary:not(:disabled):not(.is-loading):active {
    background-color: #c55a38 !important;
    border-color: #c55a38 !important;
}

.success-section {
    text-align: center;
    padding: 40px 0;

    .success-icon {
        font-size: 80px;
        margin-bottom: 20px;
    }

    .success-title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
        display: block;

        .dark-mode & {
            color: white;
        }
    }

    .success-desc {
        color: #999;
        font-size: 14px;
        display: block;
    }
}
</style>
