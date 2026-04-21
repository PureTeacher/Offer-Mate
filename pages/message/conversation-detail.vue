<template>
    <view class="conversation-detail">
        <!-- 顶部导航 -->
        <view class="header">
            <view class="header-left">
                <text class="back-arrow" @click="goBack">←</text>
                <text class="header-title">{{ conversationTitle }}</text>
            </view>
        </view>

        <!-- 消息列表 -->
        <scroll-view
            scroll-y
            class="messages-container"
            :scroll-top="scrollTop"
        >
            <view v-if="messageList.length === 0" class="empty-state">
                <text class="empty-text">暂无消息</text>
            </view>

            <view
                v-for="item in messageList"
                :key="item.id"
                class="message-item"
            >
                <view
                    class="message-bubble"
                    :class="{
                        'message-right': item.fromUserId !== 0,
                        'message-left': item.fromUserId === 0,
                    }"
                >
                    <text class="message-text">{{ item.msgContent }}</text>
                    <text class="message-time">{{
                        formatTime(item.time)
                    }}</text>
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
                @confirm="sendMessage"
            />
            <button class="send-btn" @click="sendMessage">发送</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            conversationId: "",
            conversationTitle: "对话详情",
            messageList: [],
            pageNum: 1,
            pageSize: 20,
            isEnd: false,
            scrollTop: 0,
            userId: "",
            inputContent: "",
            isSending: false,
        };
    },
    onLoad(options) {
        this.conversationId = options.id;
        this.conversationTitle = decodeURIComponent(
            options.title || "对话详情",
        );
        this.userId = uni.getStorageSync("userId");
        this.loadMessages();
    },
    methods: {
        async loadMessages() {
            try {
                const result = await this.$api.getConversationDetail(
                    this.conversationId,
                    {
                        current: this.pageNum,
                        size: this.pageSize,
                    },
                );

                if (result.code !== 200) {
                    uni.$u.toast(result.message || "加载失败");
                    return;
                }

                const data = result.data.messages;
                if (this.pageNum === 1) {
                    this.messageList = data.records || [];
                } else {
                    this.messageList = (data.records || []).concat(
                        this.messageList,
                    );
                }

                if (data.records.length < this.pageSize) {
                    this.isEnd = true;
                }

                // 滚动到底部
                this.$nextTick(() => {
                    this.scrollTop = 99999;
                });
            } catch (error) {
                console.error("加载消息失败:", error);
                uni.$u.toast("加载失败");
            }
        },
        async sendMessage() {
            if (!this.inputContent.trim()) {
                uni.$u.toast("消息不能为空");
                return;
            }

            if (this.isSending) {
                return;
            }

            this.isSending = true;

            try {
                const result = await this.$api.message({
                    msgContent: this.inputContent,
                    msgType: "text",
                    conversationId: this.conversationId,
                });

                if (result.code === 200) {
                    const { userMessage, aiMessage } = result.data;

                    // 添加用户消息
                    this.messageList.push({
                        ...userMessage,
                        fromUserId: this.userId,
                    });

                    // 添加 AI 消息
                    this.messageList.push({
                        ...aiMessage,
                        fromUserId: 0,
                    });

                    // 清空输入框
                    this.inputContent = "";

                    // 滚动到底部
                    this.$nextTick(() => {
                        this.scrollTop = 99999;
                    });
                } else {
                    uni.$u.toast(result.message || "发送失败");
                }
            } catch (error) {
                console.error("发送失败:", error);
                uni.$u.toast("发送失败");
            } finally {
                this.isSending = false;
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
    },
};
</script>

<style lang="scss" scoped>
page {
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
}

.conversation-detail {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    display: flex;
    flex-direction: column;
}

/* 顶部导航栏 */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(to bottom, #fff8f3 0%, #ffe8d6 100%);
    border-bottom: 1rpx solid #e8d4c4;
    box-shadow: 0 2rpx 8rpx rgba(224, 120, 86, 0.08);
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    height: 80rpx;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2d3748;
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

/* 消息列表 */
.messages-container {
    flex: 1;
    padding-top: 100rpx;
    padding-bottom: 120rpx;
    display: flex;
    flex-direction: column;
}

.empty-state {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-text {
    font-size: 28rpx;
    color: #94a3b8;
}

.message-item {
    padding: 20rpx 30rpx;
    display: flex;
    justify-content: flex-start;
}

.message-bubble {
    max-width: 70%;
    padding: 15rpx 20rpx;
    border-radius: 12rpx;
    word-wrap: break-word;
    word-break: break-all;
}

.message-left {
    background: linear-gradient(135deg, #f5f5f5 0%, #fffafa 100%);
    color: #1e293b;
    border-radius: 12rpx 12rpx 12rpx 0;
    border-left: 3rpx solid #e07856;
}

.message-right {
    align-self: flex-end;
    background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
    color: white;
    border-radius: 12rpx 12rpx 0 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.2);
}

.message-text {
    font-size: 28rpx;
    line-height: 1.5;
    display: block;
}

.message-time {
    font-size: 20rpx;
    opacity: 0.7;
    display: block;
    margin-top: 8rpx;
}

/* 输入框 */
.input-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to bottom, #ffe8d6 0%, #fff5f0 100%);
    border-top: 1rpx solid #e8d4c4;
    padding: 15rpx 20rpx;
    display: flex;
    gap: 10rpx;
    align-items: center;
    box-shadow: 0 -2rpx 8rpx rgba(224, 120, 86, 0.08);
    z-index: 100;
}

.message-input {
    flex: 1;
    background: #f8fafc;
    border: 1rpx solid #e2e8f0;
    border-radius: 8rpx;
    padding: 15rpx 20rpx;
    font-size: 28rpx;
    color: #2d3748;
}

.message-input::placeholder {
    color: #cbd5e1;
}

.send-btn {
    background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 15rpx 30rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.25);
}

.send-btn:active {
    background: linear-gradient(135deg, #c85a3a 0%, #b94a32 100%);
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(224, 120, 86, 0.18);
}
</style>
