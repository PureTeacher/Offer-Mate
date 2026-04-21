<template>
    <view class="conversation-list">
        <!-- 顶部导航 -->
        <view class="header">
            <view class="header-left">
                <text class="back-arrow" @click="goBack">←</text>
                <text class="header-title">对话历史</text>
            </view>
        </view>

        <!-- 对话列表 -->
        <scroll-view
            scroll-y
            class="list-container"
            :style="{ height: scrollHeight }"
        >
            <view v-if="conversationList.length === 0" class="empty-state">
                <text class="empty-text">暂无对话历史</text>
            </view>

            <view
                v-for="conv in conversationList"
                :key="conv.id"
                class="conversation-item"
                @click="openConversation(conv)"
            >
                <view class="conv-header">
                    <text class="conv-title">{{ conv.title }}</text>
                    <text class="conv-time">{{
                        formatTime(conv.updatedAt)
                    }}</text>
                </view>
                <view class="conv-preview">{{
                    conv.lastMessage || "暂无消息"
                }}</view>
                <view class="conv-meta">
                    <text class="msg-count"
                        >{{ conv.messageCount }} 条消息</text
                    >
                    <text
                        class="delete-btn"
                        @click.stop="deleteConversation(conv.id)"
                        >删除</text
                    >
                </view>
            </view>

            <!-- 加载更多 -->
            <view
                v-if="!isEnd && conversationList.length > 0"
                class="load-more"
            >
                <text v-if="loading">加载中...</text>
                <text v-else @click="loadMore">加载更多</text>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            conversationList: [],
            pageNum: 1,
            pageSize: 20,
            isEnd: false,
            loading: false,
            userId: "",
            scrollHeight: "auto",
        };
    },
    onLoad() {
        this.init();
    },
    onReady() {
        // 获取可用窗口高度
        uni.getSystemInfo({
            success: (res) => {
                // 减去顶部导航栏高度（约80rpx=40px）
                this.scrollHeight = res.windowHeight - 40 + "px";
            },
        });
    },
    methods: {
        async init() {
            this.userId = uni.getStorageSync("userId");
            await this.loadConversations();
        },
        async loadConversations() {
            try {
                const params = {
                    current: this.pageNum,
                    size: this.pageSize,
                };
                const result = await this.$api.getConversationList(params);

                if (result.code !== 200) {
                    uni.$u.toast(result.message || "加载失败");
                    return;
                }

                const data = result.data;
                if (this.pageNum === 1) {
                    this.conversationList = data.records || [];
                } else {
                    this.conversationList = this.conversationList.concat(
                        data.records || [],
                    );
                }

                if (data.records.length < this.pageSize) {
                    this.isEnd = true;
                }
            } catch (error) {
                console.error("加载对话列表失败:", error);
                uni.$u.toast("加载失败");
            } finally {
                this.loading = false;
            }
        },
        loadMore() {
            if (this.isEnd || this.loading) return;
            this.loading = true;
            this.pageNum++;
            this.loadConversations();
        },
        openConversation(conv) {
            // 导航回聊天页面，传递对话ID和标题
            uni.navigateBack({
                delta: 1,
                success: () => {
                    // 延迟300ms确保页面已返回
                    setTimeout(() => {
                        uni.$emit("switchConversation", {
                            conversationId: conv.id,
                            title: conv.title,
                        });
                    }, 300);
                },
            });
        },
        deleteConversation(convId) {
            uni.showModal({
                title: "删除对话",
                content: "确定要删除这条对话吗？",
                confirmText: "删除",
                cancelText: "取消",
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            const result =
                                await this.$api.deleteConversation(convId);
                            if (result.code === 200) {
                                // 从列表中移除
                                this.conversationList =
                                    this.conversationList.filter(
                                        (c) => c.id !== convId,
                                    );
                                uni.$u.toast("已删除");
                            } else {
                                uni.$u.toast(result.message || "删除失败");
                            }
                        } catch (error) {
                            console.error("删除失败:", error);
                            uni.$u.toast("删除失败");
                        }
                    }
                },
            });
        },
        formatTime(dateStr) {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}`;
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

.conversation-list {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
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

/* 列表容器 */
.list-container {
    padding-top: 100rpx;
    padding-bottom: 20rpx;
}

/* 空状态 */
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #94a3b8;
}

/* 对话项 */
.conversation-item {
    background: linear-gradient(135deg, #ffffff 0%, #fff8f3 100%);
    margin: 10rpx 20rpx;
    padding: 20rpx;
    border-radius: 12rpx;
    border-left: 4rpx solid #e07856;
    box-shadow: 0 4rpx 12rpx rgba(224, 120, 86, 0.12);
    transition: all 0.3s ease;
}

.conversation-item:active {
    background-color: #fff5f0;
    box-shadow: 0 6rpx 16rpx rgba(224, 120, 86, 0.18);
    transform: translateY(-2rpx);
}

.conv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.conv-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #2d3748;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.conv-time {
    font-size: 24rpx;
    color: #94a3b8;
    margin-left: 10rpx;
}

.conv-preview {
    font-size: 26rpx;
    color: #64748b;
    margin-bottom: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 1.5em;
}

.conv-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24rpx;
    color: #94a3b8;
}

.msg-count {
    color: #94a3b8;
}

.delete-btn {
    color: #e07856;
    padding: 8rpx 16rpx;
    border-radius: 6rpx;
    transition: all 0.3s ease;
    font-weight: 500;
}

.delete-btn:active {
    background-color: rgba(224, 120, 86, 0.1);
    color: #c85a3a;
}

/* 加载更多 */
.load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx;
    color: #e07856;
    font-size: 28rpx;
    font-weight: 500;
}
</style>
