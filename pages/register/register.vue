<template>
    <view :class="['register', containerClasses]">
        <!-- 背景装饰元素 -->
        <view class="bg-decoration bg-decoration-1"></view>
        <view class="bg-decoration bg-decoration-2"></view>
        <view class="container">
            <!-- logo -->
            <view class="logo">
                <image
                    src="/static/logo4.png"
                    class="logo-image"
                    mode="aspectFit"
                ></image>
            </view>
            <!-- title -->
            <view class="title">
                <image
                    src="/static/title.png"
                    mode="widthFix"
                    style="width: 85%; max-width: 450px"
                ></image>
            </view>
            <!-- 用户名密码表单 -->
            <view class="form">
                <u--form
                    labelPosition="left"
                    :model="model"
                    :rules="rules"
                    ref="registerForm"
                    labelWidth="80"
                >
                    <u-form-item
                        label="手机号"
                        prop="user.phone"
                        borderBottom
                        customStyle="margin-bottom: 10px"
                    >
                        <u--input
                            placeholder="请输入手机号"
                            v-model="model.user.phone"
                            border="none"
                        ></u--input>
                    </u-form-item>
                    <u-form-item
                        label="用户名"
                        prop="user.username"
                        borderBottom
                        customStyle="margin-bottom: 10px"
                    >
                        <u--input
                            placeholder="请输入用户名"
                            v-model="model.user.username"
                            border="none"
                        ></u--input>
                    </u-form-item>
                    <u-form-item
                        label="密码"
                        prop="user.password"
                        borderBottom
                        customStyle="margin: 10px 0"
                    >
                        <u--input
                            placeholder="请输入密码"
                            v-model="model.user.password"
                            border="none"
                            password
                            clearable
                        >
                        </u--input>
                    </u-form-item>
                    <u-form-item
                        label="确认密码"
                        prop="user.passwordVerify"
                        borderBottom
                        customStyle="margin: 10px 0"
                    >
                        <u--input
                            placeholder="请确认密码"
                            v-model="model.user.passwordVerify"
                            border="none"
                            password
                            clearable
                        >
                        </u--input>
                    </u-form-item>
                </u--form>
                <u-button
                    text="注册"
                    customStyle="margin-top: 50px; background: #e07856; color: white; font-weight: 700;"
                    shape="circle"
                    @click="submit"
                >
                </u-button>
            </view>
            <!-- 脚注功能 -->
            <view class="footer">
                <text class="footer-text" @click="hasAccount">已有账号</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        let _this = this;
        return {
            title: "暖愈心伴",
            model: {
                user: {
                    username: "",
                    password: "",
                    phone: "",
                    email: "",
                },
            },
            rules: {
                "user.phone": [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: ["change", "blur"],
                    },
                    {
                        validator: (rule, value, callback) => {
                            return uni.$u.test.mobile(value);
                        },
                        message: "手机号码不正确",
                        trigger: ["blur"],
                    },
                ],
                "user.username": [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: ["change", "blur"],
                    },
                ],
                "user.password": [
                    {
                        type: "string",
                        min: 6,
                        max: 16,
                        required: true,
                        message: "请输入6-16位密码",
                        trigger: ["blur"],
                    },
                ],
                "user.passwordVerify": [
                    {
                        type: "string",
                        min: 6,
                        max: 16,
                        required: true,
                        message: "请输入6-16位确认密码",
                        trigger: ["blur"],
                    },
                    {
                        validator: (rule, value, callback) => {
                            return value === _this.model.user.password;
                        },
                        message: "两次密码不一致",
                        trigger: ["blur"],
                    },
                ],
            },
        };
    },
    onLoad() {},
    methods: {
        // 注册提交
        submit() {
            let validateRes;
            try {
                validateRes = this.$refs.registerForm.validate();
            } catch (validateErr) {
                console.error("表单验证异常：", validateErr);
                uni.$u.toast("请填写完整的表单信息");
                return;
            }

            validateRes
                .then((res) => {
                    if (!res) {
                        uni.$u.toast("请填写完整的表单信息");
                        return;
                    }

                    let param = {
                        username: this.model.user.username,
                        password: this.model.user.password,
                        phone: this.model.user.phone,
                        email: this.model.user.email || undefined,
                    };
                    this.$api
                        .register(param)
                        .then((res) => {
                            // 检查后端返回的code是否为200
                            if (res.code === 200) {
                                uni.$u.toast("注册成功");
                                setTimeout(() => {
                                    uni.$u.route("/pages/login/login");
                                }, 1000);
                            } else {
                                // 根据不同的错误码显示相应的错误信息
                                let errMsg = "注册失败";
                                if (res.code === 409) {
                                    errMsg = "用户名已存在，请更换用户名";
                                } else if (res.code === 400) {
                                    errMsg =
                                        res.message ||
                                        "填写信息不完整或格式错误";
                                } else {
                                    errMsg = res.message || "注册失败，请重试";
                                }
                                uni.$u.toast(errMsg);
                            }
                        })
                        .catch((err) => {
                            const errCode = err?.code || err?.statusCode;
                            const errMsg =
                                err?.message ||
                                err?.msg ||
                                err?.data?.message ||
                                err?.data?.msg ||
                                (errCode === 409
                                    ? "用户名已存在，请更换用户名"
                                    : "网络错误，请检查连接后重试");
                            uni.$u.toast(errMsg);
                        });
                })
                .catch((err) => {
                    // 表单验证失败
                    console.error("表单验证失败：", err);
                    uni.$u.toast("请填写完整的表单信息");
                });
        },
        // 已有账号
        hasAccount() {
            uni.$u.route("/pages/login/login");
        },
    },
};
</script>

<style lang="scss">
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0px) rotateZ(0deg);
    }
    50% {
        transform: translateY(-12px) rotateZ(2deg);
    }
}

@keyframes rotateBg {
    from {
        transform: rotate(0deg) translateX(150px) rotate(0deg);
    }
    to {
        transform: rotate(360deg) translateX(150px) rotate(-360deg);
    }
}

@keyframes rotateBgReverse {
    from {
        transform: rotate(0deg) translateX(-150px) rotate(0deg);
    }
    to {
        transform: rotate(-360deg) translateX(-150px) rotate(360deg);
    }
}

@keyframes fadeInSpin {
    from {
        opacity: 0;
        transform: scale(0.5) rotate(-45deg);
    }
    to {
        opacity: 0.1;
        transform: scale(1) rotate(0deg);
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

.register {
    .bg-decoration {
        position: fixed;
        border-radius: 50%;
        opacity: 0.1;
        pointer-events: none;

        &-1 {
            width: 400px;
            height: 400px;
            top: -100px;
            right: -100px;
            background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
            animation:
                fadeInSpin 1.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                rotateBg 20s infinite linear 1.2s;
        }

        &-2 {
            width: 300px;
            height: 300px;
            bottom: -80px;
            left: -80px;
            background: linear-gradient(135deg, #d4744e 0%, #e07856 100%);
            animation:
                fadeInSpin 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s,
                rotateBgReverse 15s infinite linear 1.4s;
        }
    }

    .container {
        background: linear-gradient(
            to bottom,
            #fff8f3 0%,
            #ffe8d6 50%,
            #fff5f0 100%
        );
        width: 100vw;
        padding-top: 10vh;
        position: relative;
        z-index: 1;
        animation: fadeInDown 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        // #ifndef H5
        height: 90vh;
        // endif
        .logo {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            width: 100vw;
            filter: drop-shadow(0 4rpx 12rpx rgba(224, 120, 86, 0.15));
            animation: slideInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s
                backwards;

            .logo-image {
                width: 100px;
                height: 100px;
                animation: float 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
            }
        }

        .title {
            text-align: center;
            margin-top: 20px;
            animation: slideInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s
                backwards;

            image {
                width: 85%;
                max-width: 450px;
                height: auto;
                display: block;
                margin: 0 auto;
            }
        }

        .form {
            padding: 0 60px;
            margin-top: 40px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            animation: slideInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s
                backwards;

            ::v-deep .u-form-item {
                margin-bottom: 24px;

                .u--input__input-box {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;

                    &:hover {
                        transform: translateY(-2px);
                    }
                }
            }

            ::v-deep .u--input {
                font-size: 16px;

                input {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

                    &:focus {
                        transform: scale(1.02);
                    }
                }
            }

            ::v-deep .u-btn {
                background: #e07856;
                color: white;
                font-weight: 700;
                font-size: 18px;
                border-radius: 24px;
                box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);
                border: none;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;

                &::before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition:
                        width 0.6s,
                        height 0.6s;
                }

                &:active {
                    transform: scale(0.95);
                    box-shadow: 0 12rpx 32rpx rgba(224, 120, 86, 0.35);
                }

                &:hover {
                    animation: bounce 0.6s ease-in-out;
                    box-shadow: 0 12rpx 28rpx rgba(224, 120, 86, 0.3);
                }
            }
        }

        .footer {
            flex-direction: row;
            justify-content: center;
            text-align: center;
            align-items: center;
            margin-top: 40px;
            animation: slideInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s
                backwards;

            .footer-text {
                font-size: 14px;
                color: #d4744e;
                padding: 15px;
                font-weight: 600;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;

                &:hover {
                    transform: scale(1.1);
                    opacity: 0.8;
                }

                &:active {
                    opacity: 0.6;
                    transform: scale(0.95);
                }
            }
        }
    }
}
</style>
