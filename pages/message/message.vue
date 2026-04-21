<template>
    <view :class="['message', containerClasses]">
        <!-- 顶部导航 -->
        <view class="header">
            <view class="header-left">
                <text class="header-title">{{ conversationTitle }}</text>
            </view>
            <view class="header-right">
                <text class="header-btn" @click="startNewConversation"
                    >新对话</text
                >
                <text class="header-divider">|</text>
                <text class="header-btn" @click="viewConversationHistory"
                    >历史</text
                >
            </view>
        </view>

        <!-- 消息列表 -->
        <scroll-view
            ref="scrollView"
            scroll-y
            class="messages-container"
            :scroll-top="scrollTop"
            enable-flex
        >
            <view v-if="msgList.length === 0" class="empty-state">
                <text class="empty-text">开始聊天</text>
            </view>

            <view
                v-for="(item, index) in msgList"
                :key="item.id"
                :class="[
                    'message-item',
                    item.fromUserId !== 0 ? 'message-right' : 'message-left',
                ]"
            >
                <view
                    :class="[
                        'message-bubble',
                        item.fromUserId !== 0 ? 'msg-right' : 'msg-left',
                    ]"
                >
                    <text
                        :class="[
                            'message-text',
                            item.isThinking ? 'thinking-animation' : '',
                        ]"
                        >{{ parseMarkdown(item.msgContent) }}</text
                    >
                </view>
            </view>
        </scroll-view>

        <!-- 输入框 -->
        <view class="input-container">
            <input
                v-model="inputContent"
                type="text"
                class="message-input"
                placeholder="输入消息..."
                @confirm="sendMsg"
            />
            <button class="send-btn" @click="sendMsg">发送</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 消息列表
            msgList: [],
            // 用户Id
            userId: "",
            // 对话ID
            conversationId: "",
            // 对话标题
            conversationTitle: "心理咨询",
            // 我的头像
            myAvatar: "/static/logo3.png",
            // 朋友头像
            friendAvatar: "/static/logo2.png",
            // 页码
            pageNum: 1,
            // 页长
            pageSize: 20,
            // 是否无消息
            isEnd: false,
            // 输入框内容
            inputContent: "",
            // scroll位置
            scrollTop: 0,
        };
    },
    onLoad(options) {
        // 从历史页面返回时会传入 conversationId
        if (options && options.conversationId) {
            this.conversationId = options.conversationId;
            this.conversationTitle = decodeURIComponent(
                options.title || "对话",
            );
        }
    },
    onShow() {
        // 页面显示时初始化
        if (!this.conversationId) {
            this.init();
        } else {
            // 加载已选中的对话
            this.loadExistingConversation();
        }

        // 监听来自历史页面的事件
        uni.$on("switchConversation", (data) => {
            // 立即清空消息列表，避免闪烁显示旧消息
            this.msgList = [];
            this.conversationId = data.conversationId;
            this.conversationTitle = data.title;
            this.scrollTop = 0;
            // 然后加载新对话的消息
            this.loadExistingConversation();
        });
    },
    onHide() {
        // 页面隐藏时移除监听
        uni.$off("switchConversation");
    },
    methods: {
        async init() {
            // 从本地存储获取用户ID
            this.userId = uni.getStorageSync("userId");
            this.scrollTop = 0; // 重置滚动位置

            // 创建新对话会话
            try {
                const createRes = await this.$api.createConversation({
                    title: "新对话",
                });
                if (createRes.code === 200) {
                    this.conversationId = createRes.data.id;
                    this.conversationTitle = createRes.data.title;
                } else {
                    uni.$u.toast(createRes.message || "创建对话失败");
                    return;
                }
            } catch (error) {
                console.error("创建对话失败:", error);
                uni.$u.toast("创建对话失败");
                return;
            }

            // 初始化消息
            this.loadMessages(true);
        },
        async loadExistingConversation() {
            // 加载已有对话的消息
            this.userId = uni.getStorageSync("userId");
            this.msgList = [];
            this.scrollTop = 0; // 重置滚动位置
            this.pageNum = 1;
            this.isEnd = false;
            this.loadMessages(true);
        },
        async loadMessages(isInit = false) {
            try {
                const params = {
                    userId: this.userId,
                    conversationId: this.conversationId,
                    current: 1,
                    size: 50,
                };
                const result = await this.$api.messagePage(params);
                if (result.code !== 200) {
                    uni.$u.toast(result.message || "加载失败");
                    return;
                }

                const data = result.data;
                this.msgList = (data.records || []).reverse();

                if (data.records.length < 50) {
                    this.isEnd = true;
                }

                // 滚动到底部
                if (isInit && this.msgList.length > 0) {
                    // 使用两次 nextTick 确保 DOM 完全渲染
                    this.$nextTick(() => {
                        this.$nextTick(() => {
                            this.scrollToBottom();
                        });
                    });
                }
            } catch (error) {
                console.error("加载消息失败:", error);
                uni.$u.toast("加载失败");
            }
        },
        async sendMsg() {
            if (!this.inputContent.trim()) {
                uni.$u.toast("消息不能为空");
                return;
            }

            // 立刻添加用户消息
            const userMsgContent = this.inputContent;
            this.msgList.push({
                id: Date.now() + Math.random(),
                msgContent: userMsgContent,
                fromUserId: this.userId,
                time: new Date().toISOString(),
                msgType: "text",
            });

            // 立刻清空输入框
            this.inputContent = "";

            // 立刻滚动到底部
            this.$nextTick(() => {
                this.scrollToBottom();
            });

            // 异步获取 AI 回复，不阻塞UI
            this.getAIResponse(userMsgContent);
        },
        async getAIResponse(userContent) {
            try {
                // 创建占位符 AI 消息 - 显示思考中的动画
                const aiMsgId = Date.now() + Math.random();
                this.msgList.push({
                    id: aiMsgId,
                    msgContent: "思考中", // 初始显示"思考中"
                    fromUserId: 0,
                    time: new Date().toISOString(),
                    msgType: "text",
                    isThinking: true, // 标记为思考中状态
                });

                // 找到 AI 消息在列表中的索引
                const aiMsgIndex = this.msgList.findIndex(
                    (m) => m.id === aiMsgId,
                );

                // 调用 API 获取 AI 回复（完整响应）
                const result = await this.$api.message({
                    msgContent: userContent,
                    msgType: "text",
                    conversationId: this.conversationId,
                });

                if (result && result.data && result.data.aiMessage) {
                    const aiMsg = result.data.aiMessage;
                    const fullContent = aiMsg.msgContent || "";

                    // 清除思考中标记
                    if (aiMsgIndex !== -1 && this.msgList[aiMsgIndex]) {
                        this.msgList[aiMsgIndex].isThinking = false;
                        this.msgList[aiMsgIndex].msgContent = "";
                    }

                    // 更新消息 ID 和时间
                    if (aiMsgIndex !== -1) {
                        this.msgList[aiMsgIndex].id = aiMsg.id;
                        this.msgList[aiMsgIndex].time = aiMsg.time;
                    }

                    // 启用自动滚动定时器（每30ms滚动一次）
                    let isScrolling = false;
                    const autoScrollTimer = setInterval(() => {
                        if (!isScrolling) {
                            isScrolling = true;
                            this.scrollToBottom();
                            setTimeout(() => {
                                isScrolling = false;
                            }, 50);
                        }
                    }, 30);

                    // 逐字显示内容（逐50ms显示一个字，模拟流式效果）
                    let displayContent = "";
                    for (let i = 0; i < fullContent.length; i++) {
                        displayContent += fullContent[i];

                        // 每50ms更新一次显示
                        await new Promise((resolve) => setTimeout(resolve, 50));

                        if (aiMsgIndex !== -1 && this.msgList[aiMsgIndex]) {
                            this.msgList[aiMsgIndex].msgContent =
                                displayContent;
                        }
                    }

                    // 停止自动滚动计时器
                    clearInterval(autoScrollTimer);

                    // 最后滚动一次确保到底部
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });

                    console.log("✓ AI 回复完成");

                    // 如果是第一条对话（只有2条消息：用户+AI），则生成标题
                    if (this.msgList.length === 2) {
                        this.generateConversationTitle();
                    }
                } else {
                    throw new Error("API 返回数据格式错误");
                }
            } catch (error) {
                console.error("❌ 获取AI回复失败:", error);

                // 如果消息为空则移除
                const aiMsgIndex = this.msgList.findIndex(
                    (m) => m.fromUserId === 0 && m.msgContent === "",
                );
                if (aiMsgIndex !== -1 && !this.msgList[aiMsgIndex].msgContent) {
                    this.msgList.splice(aiMsgIndex, 1);
                }

                uni.$u.toast("获取回复失败");
            }
        },
        formatTime(dateStr) {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            return date.toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        },
        goBack() {
            uni.navigateBack({
                delta: 1,
            });
        },
        startNewConversation() {
            // 检查是否已经是新对话
            if (
                this.conversationTitle === "新对话" &&
                this.msgList.length === 0
            ) {
                uni.$u.toast("已处于新对话");
                return;
            }

            uni.showModal({
                title: "开启新对话",
                content: "确定要开启新对话吗？",
                confirmText: "确定",
                cancelText: "取消",
                success: (res) => {
                    if (res.confirm) {
                        this.init();
                        uni.$u.toast("已开启新对话");
                    }
                },
            });
        },
        viewConversationHistory() {
            uni.navigateTo({
                url: "/pages/message/conversation-list",
            });
        },

        scrollToBottom() {
            // 使用 setTimeout 延迟设置滚动位置，确保 DOM 已更新
            setTimeout(() => {
                this.scrollTop++; // 先增加，再设置大值，触发重新渲染
                this.$nextTick(() => {
                    this.scrollTop = 99999;
                });
            }, 0);
        },

        parseMarkdown(text) {
            // 简化处理：只去掉 markdown 格式符号，保留原始换行
            if (!text) return text;

            // 分割线：--- 或 *** 或 ___ 转为一条线
            text = text.replace(
                /^(-{3,}|\*{3,}|_{3,})$/gm,
                "──────────────────────",
            );

            // 代码块：```...``` 转为普通文本（去掉三个反引号）
            text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
                return code.trim();
            });

            // 标题：去掉 # 前缀
            text = text.replace(/^(#{1,3})\s+/gm, "");

            // 列表：- 转为 🔸（粉红菱形）
            text = text.replace(/^-\s+/gm, "🔸 ");

            // 代码块：去掉反引号
            text = text.replace(/`([^`]+)`/g, "$1");

            // 加粗：**文本** 或 __文本__ 转为 文本
            text = text.replace(/\*\*(.+?)\*\*|__(.+?)__/g, "$1$2");

            // 斜体：*文本* 或 _文本_ 转为 文本
            text = text.replace(/\*(.+?)\*|_(.+?)_/g, "$1$2");

            // 链接：[文本](url) 转为 文本
            text = text.replace(/\[(.+?)\]\((.+?)\)/g, "$1");

            // 引用块：> 前缀去掉
            text = text.replace(/^>\s+/gm, "  ");

            return text;
        },

        async generateConversationTitle() {
            try {
                const result = await this.$api.generateConversationTitle(
                    this.conversationId,
                );
                if (result && result.code === 200) {
                    const newTitle = result.data.title || "新对话";
                    this.conversationTitle = newTitle;
                    console.log("✓ 对话标题已生成:", newTitle);
                } else {
                    console.warn(
                        "生成标题失败:",
                        result?.message || "未知错误",
                    );
                }
            } catch (error) {
                console.error("生成标题异常:", error);
                // 不影响用户体验，静默失败
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.message {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
}

/* 顶部导航栏 */
.header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: linear-gradient(to bottom, #fff8f3 0%, #ffe8d6 100%);
    border-bottom: 1rpx solid #e8d4c4;
    box-shadow: 0 2rpx 8rpx rgba(224, 120, 86, 0.08);
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80rpx;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 15rpx;
}

.back-arrow {
    font-size: 32rpx;
    color: #e07856;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10rpx;
}

.back-arrow:active {
    transform: scale(0.95);
    opacity: 0.9;
    color: #c85a3a;
}

.header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: 1rpx;
}

.header-btn {
    font-size: 28rpx;
    color: #e07856;
    padding: 10rpx 15rpx;
    border-radius: 6rpx;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-weight: 500;
}

.header-btn:active {
    background-color: #fff8f3;
    transform: scale(0.95);
}

.header-divider {
    color: #cbd5e1;
    font-size: 24rpx;
    opacity: 0.5;
}

/* 消息容器 */
.messages-container {
    flex: 1;
    overflow-y: auto;
    background: transparent;
    padding: 20rpx 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94a3b8;
    font-size: 28rpx;
}

.empty-state-text {
    color: #94a3b8;
    font-size: 28rpx;
}

/* 消息项目 */
.message-item {
    display: flex;
    width: 100%;
    margin-bottom: 20rpx;
    animation: slideIn 0.3s ease;
    box-sizing: border-box;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* AI消息 - 左侧 */
.message-item.message-left {
    justify-content: flex-start;
    padding-left: 30rpx;
    padding-right: 80rpx;
}

/* 用户消息 - 右侧 */
.message-item.message-right {
    justify-content: flex-end;
    padding-right: 20rpx;
    padding-left: 80rpx;
}

/* 消息气泡 */
.message-bubble {
    word-wrap: break-word;
    word-break: break-all;
    line-height: 1.6;
}

/* AI消息气泡 - 无背景 */
.message-bubble.msg-left {
    background: transparent;
    color: #1e293b;
    padding: 8rpx 0;
    box-shadow: none;
    max-width: 100%;
}

/* 用户消息气泡 - 温暖棕色 */
.message-bubble.msg-right {
    background: linear-gradient(135deg, #ef9b7f 0%, #e8986f 100%);
    color: #ffffff;
    padding: 16rpx 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.2);
    max-width: 100%;
}

/* 消息文本 */
.message-text {
    font-size: 28rpx;
    display: block;
    margin-bottom: 8rpx;
}

/* AI思考中动画 */
.message-text.thinking-animation {
    animation: breathing 1.5s ease-in-out infinite;
    color: #94a3b8;
    font-weight: 500;
}

@keyframes breathing {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
}

/* 消息时间 */
.message-time {
    font-size: 20rpx;
    opacity: 0.6;
    margin-top: 8rpx;
    color: #64748b;
}

/* 输入框容器 */
.input-container {
    position: sticky;
    bottom: 0;
    background: linear-gradient(to bottom, #ffe8d6 0%, #fff5f0 100%);
    border-top: 1rpx solid #e8d4c4;
    padding: 16rpx 20rpx;
    display: flex;
    gap: 12rpx;
    align-items: flex-end;
    box-shadow: 0 -2rpx 8rpx rgba(224, 120, 86, 0.08);
    z-index: 100;
}

.message-input {
    flex: 1;
    padding: 12rpx 16rpx;
    border: 1rpx solid #e2e8f0;
    border-radius: 20rpx;
    font-size: 28rpx;
    color: #1e293b;
    background: #f8fafc;
    max-height: 150rpx;
    min-height: 44rpx;
    line-height: 1.5;
    transition: all 0.3s ease;
}

.message-input:focus {
    border-color: #e07856;
    background: white;
    box-shadow: 0 0 0 3rpx rgba(224, 120, 86, 0.15);
}

.message-input::placeholder {
    color: #cbd5e1;
}

.send-btn {
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
    color: white;
    border: none;
    border-radius: 20rpx;
    font-size: 26rpx;
    font-weight: 600;
    transition: all 0.3s ease;
    min-width: 80rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.25);
}

.send-btn:active {
    background: linear-gradient(135deg, #c85a3a 0%, #b94a32 100%);
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(224, 120, 86, 0.18);
}

.send-btn:disabled {
    background: #cbd5e1;
    opacity: 0.6;
    transform: none;
}

/* 滚动条美化 */
::-webkit-scrollbar {
    width: 8rpx;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4rpx;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* 响应式优化 */
@media screen and (max-width: 750rpx) {
    .message-item.message-left {
        padding-left: 20rpx;
        padding-right: 60rpx;
    }

    .message-item.message-right {
        padding-right: 16rpx;
        padding-left: 60rpx;
    }

    .message-input {
        font-size: 26rpx;
        padding: 10rpx 14rpx;
    }

    .send-btn {
        padding: 10rpx 20rpx;
        font-size: 24rpx;
        min-width: 70rpx;
    }

    .header {
        padding: 16rpx 20rpx;
    }

    .header-title {
        font-size: 28rpx;
    }
}
</style>
