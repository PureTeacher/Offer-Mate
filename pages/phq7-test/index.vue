<template>
    <view
        :class="['test-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 角色引导区 -->
        <view class="guide-area">
            <text class="guide-emoji">☀️</text>
            <view class="guide-speech">
                <text>Hi~ 我是你的职业助手小晴！\n先做测评，再匹配导师哦~</text>
            </view>
        </view>

        <!-- 测评分类导航 -->
        <scroll-view class="category-nav" scroll-x>
            <view
                v-for="(item, index) in categories"
                :key="index"
                class="category-item"
                :class="{ active: currentCategory === index }"
                @click="switchCategory(index)"
            >
                <text class="category-emoji">{{ item.emoji }}</text>
                <text>{{ item.name }}</text>
            </view>
        </scroll-view>

        <!-- 测评卡片列表 -->
        <view class="test-list">
            <view
                v-for="test in filteredTests"
                :key="test.id"
                class="test-card"
                @click="startTest(test)"
            >
                <view class="card-badge" v-if="test.isNew">NEW</view>
                <view class="test-cover-emoji">{{ test.emoji }}</view>
                <view class="test-info">
                    <text class="test-title">{{ test.title }}</text>
                    <text class="test-desc">{{ test.description }}</text>
                    <view class="test-meta">
                        <text class="meta-item"
                            >{{ test.questionCount }}题 · 约{{
                                test.duration
                            }}分钟</text
                        >
                    </view>
                </view>
            </view>
        </view>

        <!-- 历史记录入口 -->
        <view class="history-entrance" @click="navToHistory">
            <text>查看历史测评记录</text>
            <text class="emoji">➡️</text>
        </view>

        <!-- 测评说明弹窗 -->
        <uni-popup ref="infoPopup" type="dialog">
            <view class="test-info-popup">
                <text class="popup-title">{{ currentTest.title }}测评说明</text>
                <scroll-view scroll-y class="popup-content">
                    <text>{{ currentTest.detailDescription }}</text>
                    <view class="warning-box">
                        <text class="emoji">⚠️</text
                        >本测评结果仅供参考，不能作为临床诊断依据
                    </view>
                </scroll-view>
                <button class="start-btn" @click="confirmStart">
                    开始测评
                </button>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            themeColor: "#5d9bff",
            currentCategory: 0,
            currentTest: {},
            categories: [
                {
                    name: "职业目标规划",
                    emoji: "🎯",
                    type: "planning",
                },
                {
                    name: "职业发展路径",
                    emoji: "🚀",
                    type: "development",
                },
                {
                    name: "职业技能评估",
                    emoji: "💡",
                    type: "skills",
                },
                {
                    name: "职业转型规划",
                    emoji: "🔄",
                    type: "transformation",
                },
            ],
            testList: [
                {
                    id: "phq7",
                    title: "职业定位自测",
                    description: "评估你的职业兴趣与适配度",
                    emoji: "🎯",
                    questionCount: 9,
                    duration: 3,
                    type: "planning",
                    path: "/pages/phq7-test/do-test",
                    isNew: false,
                    detailDescription:
                        "本测评帮助你深入了解自身的职业兴趣、职业价值观和职业能力，识别最匹配的发展方向。共9个问题。\n\n结果参考：\n0-10分：职业定位模糊\n11-20分：有初步定位\n21-27分：定位较清晰\n28-27分：定位非常清晰",
                },
                {
                    id: "gad7",
                    title: "职业目标可行性评估",
                    description: "评估你的职业目标执行能力",
                    emoji: "✅",
                    path: "/pages/phq7-test/gad7",
                    questionCount: 7,
                    duration: 3,
                    type: "planning",
                    isNew: true,
                    detailDescription:
                        "本测评评估你设定的职业目标是否具有可行性，帮你识别实现目标的关键障碍与资源。\n\n结果参考：\n0-8分：目标可行性较弱\n9-16分：基本可行\n17-24分：较为可行\n25+分：高度可行",
                },
                {
                    id: "cpss",
                    title: "职业竞争力评估",
                    description: "评估你在职业市场中的竞争优势",
                    emoji: "💪",
                    questionCount: 14,
                    duration: 5,
                    type: "development",
                    path: "/pages/phq7-test/cpss",
                    isNew: false,
                    detailDescription:
                        "本测评帮助你全面认识自己的职业竞争力，包括核心技能、专业素养、行业认知度等维度。\n\n结果参考：\n总分越高，职业竞争力越强",
                },
                {
                    id: "ucla",
                    title: "职业成长空间评估",
                    description: "评估你的职业发展潜力",
                    emoji: "🌱",
                    questionCount: 20,
                    duration: 5,
                    type: "development",
                    path: "/pages/phq7-test/ucla",
                    isNew: false,
                    detailDescription:
                        "本测评评估你在当前职业路径中的成长空间、进阶可能性和自我提升能力。",
                },
                {
                    id: "its",
                    title: "核心职业技能测评",
                    description: "评估你的关键职业能力",
                    emoji: "🔧",
                    questionCount: 12,
                    duration: 4,
                    type: "skills",
                    path: "/pages/phq7-test/its",
                    isNew: false,
                    detailDescription:
                        "本测评评估你在沟通、分析、领导力等核心职业技能方面的水平，帮助你发现优势与改进方向。",
                },
                {
                    id: "psqi",
                    title: "职业发展准备度测评",
                    description: "评估你是否做好职业发展准备",
                    emoji: "🚀",
                    questionCount: 7,
                    duration: 3,
                    type: "skills",
                    path: "/pages/phq7-test/psqi",
                    isNew: false,
                    detailDescription:
                        "本测评评估你的职业发展准备度，包括知识储备、心理准备、行动计划等方面。",
                },
                {
                    id: "sds",
                    title: "职业转型风险评估",
                    description: "评估转型的可行性与风险",
                    emoji: "⚖️",
                    questionCount: 10,
                    duration: 4,
                    type: "transformation",
                    path: "/pages/phq7-test/sds",
                    isNew: false,
                    detailDescription:
                        "本测评帮助你评估职业转型的风险与机遇，为转型决策提供科学依据。",
                },
            ],
        };
    },
    computed: {
        filteredTests() {
            const currentType = this.categories[this.currentCategory].type;
            return this.testList.filter((item) => item.type === currentType);
        },
    },
    methods: {
        goBack() {
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        switchCategory(index) {
            this.currentCategory = index;
        },
        startTest(test) {
            this.currentTest = test;
            this.$refs.infoPopup.open();
        },
        confirmStart() {
            this.$refs.infoPopup.close();
            uni.navigateTo({
                url: this.currentTest.path,
            });
        },
        navToHistory() {
            uni.navigateTo({
                url: "/pages/phq7-test/history",
            });
        },
    },
};
</script>

<style lang="scss">
.test-container {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    padding-bottom: 120rpx;
}

.test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #1e3a8a 100%);
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.25);
    border: none;

    .header-left {
        display: flex;
        align-items: center;
    }

    .back-arrow {
        font-size: 40rpx;
        margin-right: 20rpx;
        color: rgba(255, 255, 255, 0.8);
    }

    .header-title {
        font-size: 36rpx;
        font-weight: 700;
        color: #ffffff;
    }
}

.guide-area {
    display: flex;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.95);
    margin: 20rpx;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .guide-emoji {
        font-size: 80rpx;
        margin-right: 20rpx;
    }

    .guide-speech {
        flex: 1;
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05) 0%,
            rgba(96, 165, 250, 0.05) 100%
        );
        padding: 20rpx;
        border-radius: 16rpx;
        position: relative;
        border: 1rpx solid rgba(59, 130, 246, 0.1);

        &::before {
            content: "";
            position: absolute;
            left: -16rpx;
            top: 30rpx;
            border-width: 10rpx;
            border-style: solid;
            border-color: transparent rgba(59, 130, 246, 0.05) transparent
                transparent;
        }

        text {
            font-size: 28rpx;
            line-height: 1.6;
            color: #333;
        }
    }
}

.category-nav {
    white-space: nowrap;
    padding: 20rpx 0;
    margin: 0 30rpx;

    .category-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 0 30rpx;
        opacity: 0.6;
        transition: all 0.3s;

        &.active {
            opacity: 1;
            transform: scale(1.05);
            text {
                color: #60a5fa;
                font-weight: 700;
            }
        }

        .category-emoji {
            font-size: 50rpx;
            margin-bottom: 10rpx;
        }

        text {
            font-size: 26rpx;
            color: #666;
        }
    }
}

.test-list {
    padding: 0 30rpx;
}

.test-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    display: flex;
    height: 200rpx;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    .card-badge {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        background: #3b82f6;
        color: white;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        z-index: 2;
        font-weight: 700;
    }

    .test-cover-emoji {
        width: 220rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 80rpx;
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.08) 0%,
            rgba(59, 130, 246, 0.04) 100%
        );
    }

    .test-info {
        flex: 1;
        padding: 25rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .test-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }

        .test-desc {
            font-size: 26rpx;
            color: #666;
            margin: 10rpx 0;
        }

        .test-meta {
            display: flex;
            font-size: 24rpx;
            color: #999;

            .meta-item {
                margin-right: 10rpx;
            }
        }
    }
}

.history-entrance {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25rpx;
    background: rgba(255, 255, 255, 0.95);
    margin: 40rpx 30rpx 0;
    border-radius: 24rpx;
    color: #60a5fa;
    font-size: 28rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    transition: all 0.3s;
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-4rpx);
        color: #3b82f6;
    }

    .emoji {
        font-size: 30rpx;
        margin-left: 10rpx;
    }
}

/* 弹窗样式 */
.test-info-popup {
    width: 650rpx;
    padding: 40rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);

    .popup-title {
        display: block;
        text-align: center;
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 30rpx;
        color: #60a5fa;
    }

    .popup-content {
        max-height: 60vh;
        margin-bottom: 30rpx;
        font-size: 28rpx;
        line-height: 1.8;
        color: #555;

        .warning-box {
            display: flex;
            align-items: center;
            background: linear-gradient(
                135deg,
                rgba(59, 130, 246, 0.08) 0%,
                rgba(59, 130, 246, 0.04) 100%
            );
            padding: 20rpx;
            border-radius: 16rpx;
            margin-top: 30rpx;
            border: 1rpx solid rgba(59, 130, 246, 0.2);

            .emoji {
                font-size: 36rpx;
                margin-right: 15rpx;
            }

            text {
                flex: 1;
                font-size: 26rpx;
                color: #60a5fa;
                font-weight: 600;
            }
        }
    }

    .start-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
        color: white;
        border-radius: 24rpx;
        font-weight: 700;
        box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.25);
    }
}
</style>
