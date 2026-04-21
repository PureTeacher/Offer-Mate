<template>
    <view :class="['account-container', containerClasses]">
        <!-- 页面头部 -->
        <view class="page-header">
            <text class="page-title">账号管理</text>
            <text class="page-desc">管理你的账号信息和安全设置</text>
        </view>

        <!-- 基本信息部分 -->
        <view class="account-section">
            <view class="section-title">基本信息</view>

            <!-- 头像 -->
            <view class="account-item avatar-item">
                <view class="item-label">
                    <text class="label-text">头像</text>
                </view>
                <view class="item-content avatar-content">
                    <view
                        v-if="accountInfo.avatar_url"
                        class="avatar-image-wrapper"
                        style="
                            border-radius: 50%;
                            overflow: hidden;
                            width: 80rpx;
                            height: 80rpx;
                            border: 2rpx solid #ddd;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        <image
                            :src="accountInfo.avatar_url"
                            mode="aspectFill"
                            style="
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            "
                        />
                    </view>
                    <view v-else class="avatar-placeholder">
                        <text class="placeholder-text">无头像</text>
                    </view>
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="chooseAvatar">上传</button>
                </view>
            </view>

            <!-- 用户名 -->
            <view class="account-item">
                <view class="item-label">
                    <text class="label-text">用户名</text>
                </view>
                <view class="item-content">
                    <text class="username-text">{{
                        accountInfo.username
                    }}</text>
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="openUsernameModal">
                        修改
                    </button>
                </view>
            </view>

            <!-- 注册邮箱 -->
            <view class="account-item">
                <view class="item-label">
                    <text class="label-text">注册邮箱</text>
                </view>
                <view class="item-content">
                    <text class="email-text">{{
                        accountInfo.email || "未绑定"
                    }}</text>
                    <text v-if="accountInfo.email" class="status-badge verified"
                        >✓ 已验证</text
                    >
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="openEmailModal">
                        {{ accountInfo.email ? "修改" : "绑定" }}
                    </button>
                </view>
            </view>

            <!-- 绑定手机 -->
            <view class="account-item">
                <view class="item-label">
                    <text class="label-text">绑定手机</text>
                </view>
                <view class="item-content">
                    <text class="phone-text">{{ maskedPhone }}</text>
                    <text v-if="accountInfo.phone" class="status-badge verified"
                        >✓ 已验证</text
                    >
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="openPhoneModal">
                        {{ accountInfo.phone ? "修改" : "绑定" }}
                    </button>
                </view>
            </view>
        </view>

        <!-- 账号安全部分 -->
        <view class="account-section">
            <view class="section-title">账号安全</view>

            <view class="account-item">
                <view class="item-label">
                    <text class="label-text">修改密码</text>
                </view>
                <view class="item-content">
                    <text class="security-text">定期更新密码保护账号安全</text>
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="navigateToPassword">
                        修改
                    </button>
                </view>
            </view>

            <view class="account-item">
                <view class="item-label">
                    <text class="label-text">登录日志</text>
                </view>
                <view class="item-content">
                    <text class="security-text">查看账号的登录历史记录</text>
                </view>
                <view class="item-action">
                    <button class="edit-btn" @click="showLoginHistory">
                        查看
                    </button>
                </view>
            </view>
        </view>

        <!-- 修改用户名弹窗 -->
        <view
            v-if="showUsernameModal"
            class="modal-overlay"
            @click="showUsernameModal = false"
        >
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">修改用户名</text>
                    <view class="modal-close" @click="showUsernameModal = false"
                        >✕</view
                    >
                </view>
                <view class="modal-body">
                    <input
                        v-model="usernameInput"
                        type="text"
                        placeholder="请输入新用户名"
                        class="modal-input"
                    />
                </view>
                <view class="modal-footer">
                    <button
                        class="btn-cancel"
                        @click="showUsernameModal = false"
                    >
                        取消
                    </button>
                    <button class="btn-confirm" @click="updateUsername">
                        确认
                    </button>
                </view>
            </view>
        </view>

        <!-- 修改邮箱弹窗 -->
        <view
            v-if="showEmailModal"
            class="modal-overlay"
            @click="showEmailModal = false"
        >
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">修改邮箱</text>
                    <view class="modal-close" @click="showEmailModal = false"
                        >✕</view
                    >
                </view>
                <view class="modal-body">
                    <input
                        v-model="emailInput"
                        type="text"
                        placeholder="请输入新邮箱地址"
                        class="modal-input"
                    />
                </view>
                <view class="modal-footer">
                    <button class="btn-cancel" @click="showEmailModal = false">
                        取消
                    </button>
                    <button class="btn-confirm" @click="updateEmail">
                        确认
                    </button>
                </view>
            </view>
        </view>

        <!-- 修改手机弹窗 -->
        <view
            v-if="showPhoneModal"
            class="modal-overlay"
            @click="showPhoneModal = false"
        >
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">修改手机号</text>
                    <view class="modal-close" @click="showPhoneModal = false">
                        ✕
                    </view>
                </view>
                <view class="modal-body">
                    <input
                        v-model="phoneInput"
                        type="number"
                        placeholder="请输入新手机号"
                        class="modal-input"
                    />
                </view>
                <view class="modal-footer">
                    <button class="btn-cancel" @click="showPhoneModal = false">
                        取消
                    </button>
                    <button class="btn-confirm" @click="confirmPhoneUpdate">
                        确认
                    </button>
                </view>
            </view>
        </view>

        <!-- 登录历史弹窗 -->
        <view
            v-if="showHistoryModal"
            class="modal-overlay-bottom"
            @click="showHistoryModal = false"
        >
            <view class="history-modal" @click.stop>
                <view class="modal-header">
                    <text class="modal-title">登录日志</text>
                    <view class="modal-close" @click="showHistoryModal = false"
                        >✕</view
                    >
                </view>
                <view class="history-controls">
                    <button
                        class="btn-clear"
                        @click="clearAllLogs"
                        v-if="loginHistory.length > 0"
                    >
                        清空所有
                    </button>
                </view>
                <view class="history-list">
                    <view v-if="loginLoading" class="loading-tip">
                        <text>加载中...</text>
                    </view>
                    <view
                        v-else-if="loginHistory.length === 0"
                        class="empty-tip"
                    >
                        <text>暂无登录记录</text>
                    </view>
                    <view
                        v-for="log in loginHistory"
                        :key="log.id"
                        class="history-item"
                    >
                        <view class="history-info">
                            <view class="history-device">{{
                                log.device_info
                            }}</view>
                            <view class="history-time">
                                {{ formatTime(log.login_time) }}
                            </view>
                            <view v-if="log.ip_address" class="history-ip">
                                IP: {{ log.ip_address }}
                            </view>
                        </view>
                        <button
                            class="btn-delete"
                            @click="deleteLoginLog(log.id)"
                        >
                            删除
                        </button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 隐藏的 canvas，用于图片转换 -->
        <canvas
            id="temp-canvas"
            style="display: none; width: 200px; height: 200px"
        ></canvas>
    </view>
</template>

<script>
export default {
    data() {
        return {
            accountInfo: {
                username: "",
                email: "",
                phone: "",
                avatar_url: "",
            },
            emailInput: "",
            phoneInput: "",
            usernameInput: "",
            phoneCode: "",
            codeCountdown: 0,
            phoneLoading: false,
            loginHistory: [],
            showEmailModal: false,
            showPhoneModal: false,
            showUsernameModal: false,
            showHistoryModal: false,
            loginLoading: false,
        };
    },
    computed: {
        containerClasses() {
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

            return classes.join(" ");
        },
        maskedPhone() {
            const phone = this.accountInfo.phone;
            if (!phone) return "未绑定";
            return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        },
    },
    onLoad() {
        console.log("账号管理页面加载");
        this.loadAccountInfo();
    },
    onShow() {
        // 刷新主题
    },
    methods: {
        loadAccountInfo() {
            // 先从缓存加载，然后从服务器同步最新数据
            try {
                const userInfo = uni.getStorageSync("userInfo");
                if (userInfo) {
                    this.accountInfo = {
                        username: userInfo.username || "",
                        email: userInfo.email || "",
                        phone: userInfo.phone || "",
                        avatar_url: userInfo.avatar_url || "",
                    };
                }
            } catch (e) {
                console.error("加载账号信息失败", e);
            }

            // 从服务器同步最新的用户信息
            this.syncUserInfoFromServer();
        },
        syncUserInfoFromServer() {
            // 从服务器获取最新的用户信息
            this.$api.account
                .getAccountInfo()
                .then((res) => {
                    if (res && res.code === 200 && res.data) {
                        // 更新本地信息
                        this.accountInfo = {
                            username: res.data.username || "",
                            email: res.data.email || "",
                            phone: res.data.phone || "",
                            avatar_url: res.data.avatar_url || "",
                        };

                        // 更新缓存
                        const userInfo = uni.getStorageSync("userInfo");
                        if (userInfo) {
                            userInfo.username = res.data.username;
                            userInfo.email = res.data.email;
                            userInfo.phone = res.data.phone;
                            userInfo.avatar_url = res.data.avatar_url;
                            uni.setStorageSync("userInfo", userInfo);
                        }

                        console.log("用户信息已从服务器同步");
                    }
                })
                .catch((err) => {
                    console.error("同步用户信息失败", err);
                    // 不显示错误提示，只在控制台记录
                });
        },
        validateUsername() {
            if (!this.accountInfo.username.trim()) {
                uni.showToast({
                    title: "用户名不能为空",
                    icon: "none",
                });
                return false;
            }
            if (
                this.accountInfo.username.length < 2 ||
                this.accountInfo.username.length > 20
            ) {
                uni.showToast({
                    title: "用户名长度为2-20个字符",
                    icon: "none",
                });
                return false;
            }
            return true;
        },
        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.emailInput)) {
                uni.showToast({
                    title: "请输入有效的邮箱地址",
                    icon: "none",
                });
                return false;
            }
            return true;
        },
        validatePhone() {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(this.phoneInput)) {
                uni.showToast({
                    title: "请输入有效的手机号码",
                    icon: "none",
                });
                return false;
            }
            return true;
        },
        openUsernameModal() {
            this.usernameInput = this.accountInfo.username || "";
            this.showUsernameModal = true;
        },
        openEmailModal() {
            this.emailInput = this.accountInfo.email || "";
            this.showEmailModal = true;
        },
        openPhoneModal() {
            this.phoneInput = this.accountInfo.phone || "";
            this.showPhoneModal = true;
        },
        updateUsername() {
            if (!this.validateUsername()) {
                return;
            }

            uni.showLoading({
                title: "更新中...",
            });

            this.$api.account
                .updateAccountInfo({
                    username: this.usernameInput,
                })
                .then((res) => {
                    uni.hideLoading();
                    if (res && res.code === 200) {
                        this.accountInfo.username = this.usernameInput;
                        uni.showToast({
                            title: "用户名修改成功",
                            icon: "success",
                        });
                        this.showUsernameModal = false;
                    } else {
                        uni.showToast({
                            title: res?.message || "修改失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: this.getErrorMessage(err),
                        icon: "none",
                    });
                });
        },
        updateEmail() {
            if (!this.validateEmail()) {
                return;
            }

            uni.showLoading({
                title: "更新中...",
            });

            this.$api.account
                .updateAccountInfo({
                    email: this.emailInput,
                })
                .then((res) => {
                    uni.hideLoading();
                    if (res && res.code === 200) {
                        this.accountInfo.email = this.emailInput;
                        uni.showToast({
                            title: "邮箱修改成功",
                            icon: "success",
                        });
                        this.showEmailModal = false;
                    } else {
                        uni.showToast({
                            title: res?.message || "修改失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: this.getErrorMessage(err),
                        icon: "none",
                    });
                });
        },
        sendPhoneCode() {
            // 暂未实现，直接进行验证
            this.confirmPhoneUpdate();
        },
        confirmPhoneUpdate() {
            if (!this.validatePhone()) {
                return;
            }

            uni.showLoading({
                title: "更新中...",
            });

            this.$api.account
                .updateAccountInfo({
                    phone: this.phoneInput,
                })
                .then((res) => {
                    uni.hideLoading();
                    if (res && res.code === 200) {
                        this.accountInfo.phone = this.phoneInput;
                        uni.showToast({
                            title: "手机号修改成功",
                            icon: "success",
                        });
                        this.showPhoneModal = false;
                    } else {
                        uni.showToast({
                            title: res?.message || "修改失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: this.getErrorMessage(err),
                        icon: "none",
                    });
                });
        },
        navigateToPassword() {
            uni.navigateTo({
                url: "/pages/user/change-password",
            });
        },
        showLoginHistory() {
            this.loginLoading = true;
            this.showHistoryModal = true;
            this.loadLoginHistory();
        },
        loadLoginHistory() {
            this.loginLoading = true;
            this.$api.account
                .getLatestLoginLogs({ limit: 20 })
                .then((res) => {
                    this.loginLoading = false;
                    if (res && res.code === 200) {
                        this.loginHistory = res.data || [];
                    } else {
                        uni.showToast({
                            title: res?.message || "加载失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    this.loginLoading = false;
                    uni.showToast({
                        title: this.getErrorMessage(err),
                        icon: "none",
                    });
                });
        },
        deleteLoginLog(logId) {
            uni.showModal({
                title: "删除登录日志",
                content: "确定要删除这条登录记录吗？",
                confirmText: "删除",
                cancelText: "取消",
                success: (res) => {
                    if (res.confirm) {
                        this.$api.account
                            .deleteLoginLog(logId)
                            .then((response) => {
                                if (response && response.code === 200) {
                                    uni.showToast({
                                        title: "删除成功",
                                        icon: "success",
                                    });
                                    this.loadLoginHistory();
                                } else {
                                    uni.showToast({
                                        title: response?.message || "删除失败",
                                        icon: "none",
                                    });
                                }
                            })
                            .catch((err) => {
                                uni.showToast({
                                    title: this.getErrorMessage(err),
                                    icon: "none",
                                });
                            });
                    }
                },
            });
        },
        clearAllLogs() {
            uni.showModal({
                title: "清空登录日志",
                content: "确定要清空所有登录记录吗？此操作不可撤销。",
                confirmText: "清空",
                cancelText: "取消",
                confirmColor: "#f5576c",
                success: (res) => {
                    if (res.confirm) {
                        this.$api.account
                            .clearLoginLogs()
                            .then((response) => {
                                if (response && response.code === 200) {
                                    uni.showToast({
                                        title: "清空成功",
                                        icon: "success",
                                    });
                                    this.loginHistory = [];
                                } else {
                                    uni.showToast({
                                        title: response?.message || "清空失败",
                                        icon: "none",
                                    });
                                }
                            })
                            .catch((err) => {
                                uni.showToast({
                                    title: this.getErrorMessage(err),
                                    icon: "none",
                                });
                            });
                    }
                },
            });
        },
        formatTime(timestamp) {
            // 处理 MySQL 返回的时间戳格式 (YYYY-MM-DD HH:MM:SS)
            let date;
            if (typeof timestamp === "string") {
                date = new Date(timestamp.replace(" ", "T"));
            } else {
                date = new Date(timestamp);
            }
            const now = new Date();
            const diff = now - date;

            if (diff < 1000 * 60) {
                return "刚刚";
            } else if (diff < 1000 * 60 * 60) {
                const minutes = Math.floor(diff / (1000 * 60));
                return `${minutes}分钟前`;
            } else if (diff < 1000 * 60 * 60 * 24) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                return `${hours}小时前`;
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                if (days < 30) {
                    return `${days}天前`;
                } else {
                    // 返回具体时间
                    return date.toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }
            }
        },
        getErrorMessage(err) {
            // 统一处理错误信息
            if (!err) return "操作失败";
            if (typeof err === "string") return err;
            if (err.message) return err.message;
            if (err.statusText) return err.statusText;
            if (err.errMsg) return err.errMsg;
            return "操作失败";
        },
        chooseAvatar() {
            console.log("chooseAvatar - 检测环境");

            // 检测是否是浏览器环境（H5）
            const isH5 =
                process.env.VUE_APP_PLATFORM === "h5" ||
                (typeof window !== "undefined" &&
                    typeof document !== "undefined" &&
                    !uni.getSystemInfoSync().platform);

            console.log("isH5:", isH5);

            if (isH5) {
                console.log("使用 H5 file input");
                this.chooseAvatarWeb();
            } else {
                console.log("使用 uni.chooseImage");
                this.chooseAvatarNative();
            }
        },
        chooseAvatarWeb() {
            // 浏览器环境：使用 HTML5 file input
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.convertImageToBase64Web(file);
                }
            };
            input.click();
        },
        chooseAvatarNative() {
            // 原生 App 环境 + 小程序
            uni.chooseImage({
                count: 1,
                sizeType: ["compressed"],
                sourceType: ["album", "camera"],
                success: (res) => {
                    const tempFilePath = res.tempFilePaths[0];
                    console.log("选择图片成功:", tempFilePath);
                    // 直接上传文件，不转换为 Base64
                    this.uploadAvatarAsFile(tempFilePath);
                },
                fail: (err) => {
                    console.error("选择图片失败", err);
                },
            });
        },
        uploadAvatarAsFile(filePath) {
            // 直接上传文件到服务器
            uni.showLoading({
                title: "上传中...",
            });

            console.log("开始上传文件:", filePath);

            // 获取 token
            const token = uni.getStorageSync("Access-Token");

            // 获取完整的服务器 URL
            const env = require("@/common/config/env.js").default;
            const uploadUrl = env.baseUrl + "/user/avatar/file";

            console.log("上传地址:", uploadUrl);

            uni.uploadFile({
                url: uploadUrl,
                filePath: filePath,
                name: "avatar",
                header: {
                    "Access-Token": token,
                },
                success: (res) => {
                    uni.hideLoading();
                    console.log("上传响应状态码:", res.statusCode);
                    console.log("上传响应数据:", res.data);

                    if (res.statusCode === 200) {
                        const data = JSON.parse(res.data);
                        if (data && data.code === 200) {
                            // 显示返回的图片 URL（如果后端支持的话）
                            // 或者直接显示本地文件
                            this.accountInfo.avatar_url =
                                data.data?.avatar_url || filePath;

                            // 更新缓存
                            const userInfo = uni.getStorageSync("userInfo");
                            if (userInfo) {
                                userInfo.avatar_url =
                                    data.data?.avatar_url || filePath;
                                uni.setStorageSync("userInfo", userInfo);
                            }

                            uni.showToast({
                                title: "头像上传成功",
                                icon: "success",
                            });
                        } else {
                            uni.showToast({
                                title: data?.message || "上传失败",
                                icon: "none",
                            });
                        }
                    } else {
                        console.error("HTTP 错误:", res.statusCode);
                        uni.showToast({
                            title: "上传失败，请重试",
                            icon: "none",
                        });
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    console.error("上传失败详情:", err);
                    uni.showToast({
                        title: "网络错误，请检查连接",
                        icon: "none",
                    });
                },
            });
        },
        convertImageToBase64Web(file) {
            // 浏览器环境：使用 FileReader
            uni.showLoading({
                title: "处理中...",
            });

            console.log("准备读取文件:", file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("读取成功");
                uni.hideLoading();
                const avatarDataUrl = e.target.result;
                console.log("base64 URL已生成，长度:", avatarDataUrl.length);
                this.uploadAvatarToServer(avatarDataUrl);
            };
            reader.onerror = (err) => {
                console.error("读取文件失败:", err);
                uni.hideLoading();
                uni.showToast({
                    title: "读取文件失败",
                    icon: "none",
                });
            };
            reader.readAsDataURL(file);
        },
        convertImageToBase64Native(filePath) {
            // 原生 App 环境
            uni.showLoading({
                title: "处理中...",
            });

            console.log("准备读取文件:", filePath);

            try {
                const fileSystemManager = uni.getFileSystemManager();
                console.log("获取文件系统管理器成功");

                fileSystemManager.readFile({
                    filePath: filePath,
                    encoding: "base64",
                    success: (res) => {
                        console.log(
                            "readFile success, data length:",
                            res.data.length,
                        );
                        uni.hideLoading();
                        const base64Data = res.data;
                        // 获取文件类型
                        const ext = filePath.split(".").pop().toLowerCase();
                        let mimeType = "image/jpeg";
                        if (ext === "png") {
                            mimeType = "image/png";
                        } else if (ext === "gif") {
                            mimeType = "image/gif";
                        } else if (ext === "webp") {
                            mimeType = "image/webp";
                        }

                        const avatarDataUrl = `data:${mimeType};base64,${base64Data}`;
                        console.log(
                            "base64 URL已生成，长度:",
                            avatarDataUrl.length,
                        );
                        this.uploadAvatarToServer(avatarDataUrl);
                    },
                    fail: (err) => {
                        console.error("readFile fail:", err);
                        uni.hideLoading();
                        uni.showToast({
                            title: "读取文件失败",
                            icon: "none",
                        });
                    },
                });
            } catch (e) {
                console.error("获取文件系统管理器失败:", e);
                uni.hideLoading();
                uni.showToast({
                    title: "系统不支持",
                    icon: "none",
                });
            }
        },
        uploadAvatarToServer(avatarDataUrl) {
            uni.showLoading({
                title: "上传中...",
            });

            this.$api.account
                .uploadAvatar(avatarDataUrl)
                .then((res) => {
                    uni.hideLoading();
                    if (res && res.code === 200) {
                        // 更新本地显示
                        this.accountInfo.avatar_url = avatarDataUrl;
                        // 更新缓存中的用户信息
                        const userInfo = uni.getStorageSync("userInfo");
                        if (userInfo) {
                            userInfo.avatar_url =
                                res.data?.avatar_url || avatarDataUrl;
                            uni.setStorageSync("userInfo", userInfo);
                        }
                        uni.showToast({
                            title: "头像上传成功",
                            icon: "success",
                        });
                    } else {
                        uni.showToast({
                            title: res?.message || "上传失败",
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: this.getErrorMessage(err),
                        icon: "none",
                    });
                    console.error("上传头像失败", err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.account-container {
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
        font-weight: 700;
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

.account-section {
    margin: 20rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);

    .dark-mode & {
        background-color: #2a2a2a;
    }

    .section-title {
        font-size: 28rpx;
        font-weight: 600;
        margin-bottom: 20rpx;
        color: #d4744e;

        .dark-mode & {
            color: #fff;
        }
    }
}

.account-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;

    .dark-mode & {
        border-bottom-color: #444;
    }

    &:last-child {
        border-bottom: none;
    }

    .item-label {
        display: flex;
        align-items: center;
        min-width: 120rpx;
        color: #666;

        .dark-mode & {
            color: #aaa;
        }

        .label-text {
            font-size: 28rpx;
        }

        .label-required {
            color: #f5576c;
            margin-left: 4rpx;
        }
    }

    .item-content {
        flex: 1;
        margin-left: 20rpx;
        display: flex;
        align-items: center;

        .account-input {
            width: 100%;
            padding: 12rpx;
            border: 1rpx solid #ddd;
            border-radius: 6rpx;
            font-size: 28rpx;
            color: #333;
            background-color: #fff;
            box-sizing: border-box;
            height: 80rpx;

            .dark-mode & {
                background-color: #333;
                border-color: #555;
                color: #fff;
            }
        }

        .email-text,
        .phone-text {
            font-size: 28rpx;
            color: #333;

            .dark-mode & {
                color: #fff;
            }
        }
    }

    .item-action {
        margin-left: auto;
    }

    .edit-btn {
        padding: 8rpx 20rpx;
        background-color: #e07856;
        color: #fff;
        border-radius: 6rpx;
        font-size: 24rpx;
        border: none;

        &:active {
            background-color: #d4744e;
        }
    }

    &.security-item {
        flex-direction: column;
        align-items: flex-start;

        .item-left {
            flex: 1;
            display: flex;
            flex-direction: column;

            .item-label {
                min-width: auto;
                margin-bottom: 8rpx;
                color: #333;

                .dark-mode & {
                    color: #fff;
                }
            }

            .item-desc {
                font-size: 24rpx;
                color: #999;

                .dark-mode & {
                    color: #aaa;
                }
            }
        }

        .edit-btn {
            margin-top: 16rpx;
            align-self: flex-end;
        }

        &.avatar-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 20rpx 0;

            .item-label {
                margin-bottom: 12rpx;
            }

            .avatar-content {
                width: auto;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 16rpx;

                .avatar-image-wrapper {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    border: 2rpx solid #ddd;
                    overflow: hidden;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .dark-mode & {
                        border-color: #666;
                    }

                    .avatar-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                .avatar-placeholder {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    border: 2rpx solid #ddd;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;

                    .dark-mode & {
                        background-color: #333;
                        border-color: #666;
                    }

                    .placeholder-text {
                        font-size: 20rpx;
                        color: #999;

                        .dark-mode & {
                            color: #aaa;
                        }
                    }
                }
            }
        }
    }

    .security-text {
        font-size: 24rpx;
        color: #999;

        .dark-mode & {
            color: #aaa;
        }
    }
}

.status-badge {
    font-size: 22rpx;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
    margin-left: 10rpx;

    &.verified {
        background-color: #eef6f5;
        color: #00a65a;

        .dark-mode & {
            background-color: #1a3a36;
        }
    }

    &.unbound {
        background-color: #fef0f0;
        color: #f5576c;

        .dark-mode & {
            background-color: #3a1a1a;
        }
    }
}

// 弹窗覆盖层样式
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .modal-content {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 0;
        max-width: 95%;
        width: 500rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);

        .dark-mode & {
            background-color: #2a2a2a;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20rpx;
            border-bottom: 1rpx solid #eee;

            .dark-mode & {
                border-bottom-color: #444;
            }

            .modal-title {
                font-size: 32rpx;
                font-weight: 600;
                color: #333;

                .dark-mode & {
                    color: #fff;
                }
            }

            .modal-close {
                font-size: 32rpx;
                color: #999;
                cursor: pointer;
            }
        }

        .modal-body {
            padding: 20rpx;

            .modal-input {
                width: 100%;
                padding: 12rpx;
                border: 1rpx solid #ddd;
                border-radius: 6rpx;
                font-size: 28rpx;
                color: #333;
                background-color: #fff;
                box-sizing: border-box;
                height: 80rpx;

                .dark-mode & {
                    background-color: #333;
                    border-color: #555;
                    color: #fff;
                }
            }

            .form-group {
                margin-bottom: 16rpx;

                .form-label {
                    display: block;
                    font-size: 24rpx;
                    color: #666;
                    margin-bottom: 8rpx;

                    .dark-mode & {
                        color: #aaa;
                    }
                }

                .form-input {
                    width: 100%;
                    padding: 12rpx;
                    border: 1rpx solid #ddd;
                    border-radius: 6rpx;
                    font-size: 28rpx;
                    color: #333;
                    background-color: #fff;
                    box-sizing: border-box;
                    height: 80rpx;

                    .dark-mode & {
                        background-color: #333;
                        border-color: #555;
                        color: #fff;
                    }
                }

                .verify-section {
                    display: flex;
                    gap: 10rpx;

                    .verify-input {
                        flex: 1;
                    }

                    .send-code-btn {
                        padding: 12rpx 16rpx;
                        background-color: #667eea;
                        color: #fff;
                        border-radius: 6rpx;
                        font-size: 22rpx;
                        border: none;
                        white-space: nowrap;

                        &:disabled {
                            background-color: #ccc;
                        }

                        &:active:not(:disabled) {
                            background-color: #5568d3;
                        }
                    }
                }
            }
        }

        .modal-footer {
            display: flex;
            gap: 10rpx;
            padding: 20rpx;
            border-top: 1rpx solid #eee;

            .dark-mode & {
                border-top-color: #444;
            }

            .btn-cancel,
            .btn-confirm {
                flex: 1;
                padding: 12rpx;
                border-radius: 6rpx;
                font-size: 28rpx;
                border: none;
            }

            .btn-cancel {
                background-color: #f5f5f5;
                color: #333;

                .dark-mode & {
                    background-color: #333;
                    color: #fff;
                }
            }

            .btn-confirm {
                background-color: #667eea;
                color: #fff;

                &:active {
                    background-color: #5568d3;
                }
            }
        }
    }
}

.modal-overlay-bottom {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 999;

    .device-modal,
    .history-modal {
        background-color: #fff;
        border-radius: 12rpx 12rpx 0 0;
        max-height: 500rpx;
        display: flex;
        flex-direction: column;

        .dark-mode & {
            background-color: #2a2a2a;
        }
    }

    .modal-header {
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #eee;

        .dark-mode & {
            border-bottom-color: #444;
        }

        .modal-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #333;

            .dark-mode & {
                color: #fff;
            }
        }
    }

    .device-list,
    .history-list {
        flex: 1;
        overflow-y: auto;
        padding: 20rpx 0;
    }
}

// Phone modal特殊样式
.phone-modal-content {
    max-width: 95%;
    width: 500rpx;
    max-height: 80vh;
    border-radius: 12rpx;
    position: relative;
}

.device-item,
.history-item {
    display: flex;
    align-items: center;
    padding: 16rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .dark-mode & {
        border-bottom-color: #333;
    }

    .device-info,
    .history-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .device-name,
        .history-device {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 6rpx;

            .dark-mode & {
                color: #fff;
            }
        }

        .device-time,
        .history-time {
            font-size: 24rpx;
            color: #999;

            .dark-mode & {
                color: #aaa;
            }
        }

        .history-location {
            font-size: 22rpx;
            color: #bbb;
            margin-top: 4rpx;

            .dark-mode & {
                color: #888;
            }
        }
    }

    .logout-device-btn {
        padding: 8rpx 20rpx;
        background-color: #f5576c;
        color: #fff;
        border-radius: 6rpx;
        font-size: 24rpx;
        border: none;

        &:active {
            opacity: 0.8;
        }
    }
}

// 登录日志样式
.history-controls {
    padding: 16rpx 30rpx;
    border-bottom: 1rpx solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10rpx;

    .btn-clear {
        padding: 8rpx 16rpx;
        background-color: #f5576c;
        color: #fff;
        border-radius: 6rpx;
        font-size: 24rpx;
        border: none;

        &:active {
            opacity: 0.8;
        }
    }
}

.loading-tip,
.empty-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 20rpx;
    color: #999;
    font-size: 28rpx;

    .dark-mode & {
        color: #aaa;
    }
}

.history-item {
    .history-info {
        .history-device {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 8rpx;
            font-weight: 500;

            .dark-mode & {
                color: #fff;
            }
        }

        .history-time {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 4rpx;

            .dark-mode & {
                color: #aaa;
            }
        }

        .history-ip {
            font-size: 22rpx;
            color: #bbb;

            .dark-mode & {
                color: #888;
            }
        }
    }

    .btn-delete {
        padding: 8rpx 16rpx;
        background-color: #f0f0f0;
        color: #999;
        border-radius: 6rpx;
        font-size: 22rpx;
        border: none;
        margin-left: 10rpx;

        .dark-mode & {
            background-color: #333;
            color: #aaa;
        }

        &:active {
            opacity: 0.7;
        }
    }
}
</style>
