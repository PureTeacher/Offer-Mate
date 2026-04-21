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
                    name: "职业性格",
                    emoji: "😊",
                    type: "mood",
                },
                {
                    name: "职场压力",
                    emoji: "😫",
                    type: "stress",
                },
                {
                    name: "沟通协作",
                    emoji: "👥",
                    type: "social",
                },
                {
                    name: "求职状态",
                    emoji: "😴",
                    type: "sleep",
                },
            ],
            testList: [
                {
                    id: "phq7",
                    title: "职业兴趣探索",
                    description: "基于兴趣偏好的职业方向测评",
                    emoji: "😔",
                    questionCount: 9,
                    duration: 3,
                    type: "mood",
                    path: "/pages/phq7-test/do-test",
                    isNew: false,
                    detailDescription:
                        "本测评用于了解你的职业兴趣倾向，帮助识别更匹配的岗位方向。共7个问题，每题按符合程度评分。\n\n结果参考：\n0-4分：兴趣方向待探索\n5-9分：已形成初步偏好\n10-14分：方向较明确\n15-21分：方向非常清晰",
                },
                {
                    id: "gad7",
                    title: "职业决策清晰度",
                    description: "评估职业目标与决策稳定性",
                    emoji: "😰",
                    path: "/pages/phq7-test/gad7",
                    questionCount: 7,
                    duration: 3,
                    type: "mood",
                    isNew: true,
                    detailDescription:
                        "本测评用于评估你在职业选择中的犹豫程度与决策状态，帮助你识别关键卡点。\n\n结果参考：\n0-4分：目标尚不清晰\n5-9分：有基础方向\n10-14分：方向较稳定\n15-21分：决策清晰且可执行",
                },
                {
                    id: "cpss",
                    title: "职场压力评估",
                    description: "评估近期工作与求职压力水平",
                    emoji: "😫",
                    questionCount: 14,
                    duration: 5,
                    type: "stress",
                    path: "/pages/phq7-test/cpss",
                    isNew: false,
                    detailDescription:
                        "本测评用于识别你在工作、学习和求职阶段的压力水平，共14个条目，覆盖紧张感与掌控感两个维度。总分越高，表示压力感知越明显。",
                },
                {
                    id: "ucla",
                    title: "职业社交舒适度",
                    description: "评估团队协作与职场社交状态",
                    emoji: "😔",
                    questionCount: 20,
                    duration: 5,
                    type: "social",
                    path: "/pages/phq7-test/ucla",
                    isNew: false,
                    detailDescription:
                        "本测评用于评估你在团队协作、同事沟通和职业社交中的舒适度，帮助你发现沟通优势与改进点。",
                },
                {
                    id: "its",
                    title: "团队信任与协作",
                    description: "评估跨团队合作中的信任水平",
                    emoji: "🙂",
                    questionCount: 12,
                    duration: 4,
                    type: "social",
                    path: "/pages/phq7-test/its",
                    isNew: false,
                    detailDescription:
                        "本测评用于评估你在团队合作中的信任倾向和协作风格，帮助你优化沟通策略和协作方式。",
                },
                {
                    id: "psqi",
                    title: "面试状态准备度",
                    description: "评估面试阶段的节奏和状态管理",
                    emoji: "😴",
                    questionCount: 7,
                    duration: 3,
                    type: "sleep",
                    path: "/pages/phq7-test/psqi",
                    isNew: false,
                    detailDescription:
                        "本测评聚焦面试准备期的作息、精力与专注状态，帮助你建立更稳定的备战节奏。",
                },
                {
                    id: "sds",
                    title: "求职行动力评估",
                    description: "评估简历投递与复盘执行效率",
                    emoji: "😵",
                    questionCount: 10,
                    duration: 4,
                    type: "sleep",
                    path: "/pages/phq7-test/sds",
                    isNew: false,
                    detailDescription:
                        "本测评用于评估你在求职过程中的行动节奏与执行稳定性，帮助你建立可持续的投递与复盘习惯。",
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
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    padding-bottom: 120rpx;
}

.test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background: linear-gradient(135deg, #e07856 0%, #d4744e 50%, #c85a3a 100%);
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);
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
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    backdrop-filter: blur(20rpx);

    .guide-emoji {
        font-size: 80rpx;
        margin-right: 20rpx;
    }

    .guide-speech {
        flex: 1;
        background: linear-gradient(
            135deg,
            rgba(224, 120, 86, 0.05) 0%,
            rgba(212, 116, 78, 0.05) 100%
        );
        padding: 20rpx;
        border-radius: 16rpx;
        position: relative;
        border: 1rpx solid rgba(224, 120, 86, 0.1);

        &::before {
            content: "";
            position: absolute;
            left: -16rpx;
            top: 30rpx;
            border-width: 10rpx;
            border-style: solid;
            border-color: transparent rgba(224, 120, 86, 0.05) transparent
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
                color: #d4744e;
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
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    display: flex;
    height: 200rpx;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(224, 120, 86, 0.18);
    }

    .card-badge {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        background: #e07856;
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
            rgba(224, 120, 86, 0.08) 0%,
            rgba(224, 120, 86, 0.04) 100%
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
    color: #d4744e;
    font-size: 28rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    transition: all 0.3s;
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-4rpx);
        color: #e07856;
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
        color: #d4744e;
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
                rgba(224, 120, 86, 0.08) 0%,
                rgba(224, 120, 86, 0.04) 100%
            );
            padding: 20rpx;
            border-radius: 16rpx;
            margin-top: 30rpx;
            border: 1rpx solid rgba(224, 120, 86, 0.2);

            .emoji {
                font-size: 36rpx;
                margin-right: 15rpx;
            }

            text {
                flex: 1;
                font-size: 26rpx;
                color: #d4744e;
                font-weight: 600;
            }
        }
    }

    .start-btn {
        background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
        color: white;
        border-radius: 24rpx;
        font-weight: 700;
        box-shadow: 0 8rpx 20rpx rgba(224, 120, 86, 0.25);
    }
}
</style>
