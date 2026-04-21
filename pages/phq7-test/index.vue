<template>
    <view
        :class="['test-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 角色引导区 -->
        <view class="guide-area">
            <text class="guide-emoji">☀️</text>
            <view class="guide-speech">
                <text>Hi~ 我是你的心理助手小晴！\n请自行完成测评哦~</text>
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
            <text>查看历史测评报告</text>
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
                    name: "情绪状态",
                    emoji: "😊",
                    type: "mood",
                },
                {
                    name: "压力评估",
                    emoji: "😫",
                    type: "stress",
                },
                {
                    name: "人际关系",
                    emoji: "👥",
                    type: "social",
                },
                {
                    name: "睡眠质量",
                    emoji: "😴",
                    type: "sleep",
                },
            ],
            testList: [
                {
                    id: "phq7",
                    title: "抑郁症状筛查",
                    description: "PHQ-7专业抑郁症状评估量表",
                    emoji: "😔",
                    questionCount: 9,
                    duration: 3,
                    type: "mood",
                    path: "/pages/phq7-test/do-test",
                    isNew: false,
                    detailDescription:
                        "本量表基于PHQ-7(Patient Health Questionnaire-7)开发，用于评估过去两周内抑郁症状的出现频率。包含7个问题，每个问题0-3分，总分0-21分。\n\n评分参考：\n0-4分：无明显症状\n5-9分：轻度抑郁\n10-14分：中度抑郁\n15-21分：重度抑郁",
                },
                {
                    id: "gad7",
                    title: "焦虑症状筛查",
                    description: "GAD-7广泛性焦虑障碍量表",
                    emoji: "😰",
                    path: "/pages/phq7-test/gad7",
                    questionCount: 7,
                    duration: 3,
                    type: "mood",
                    isNew: true,
                    detailDescription:
                        "GAD-7量表用于评估广泛性焦虑症状，包含7个问题，评估过去两周的情况。每个问题0-3分，总分0-21分。\n\n评分参考：\n0-4分：无明显焦虑\n5-9分：轻度焦虑\n10-14分：中度焦虑\n15-21分：重度焦虑",
                },
                {
                    id: "cpss",
                    title: "感知压力量表",
                    description: "CPSS中文版知觉压力量表",
                    emoji: "😫",
                    questionCount: 14,
                    duration: 5,
                    type: "stress",
                    path: "/pages/phq7-test/cpss",
                    isNew: false,
                    detailDescription:
                        '感知压力量表（Perceived Stress Scale，PSS）由美国学者Cohen等编制，杨廷忠等2003年汉化，共14个条目，包含2维度，即紧张感和失控感。采用Likert5级计分法，"从不"至"总是"赋值为0～4分。总分0～56分，得分高低与个体感知压力水平呈正比。',
                },
                {
                    id: "ucla",
                    title: "UCLA孤独感量表",
                    description: "UCLA孤独感量表评估",
                    emoji: "😔",
                    questionCount: 20,
                    duration: 5,
                    type: "social",
                    path: "/pages/phq7-test/ucla",
                    isNew: false,
                    detailDescription:
                        "UCLA孤独感量表（UCLA Loneliness Scale）由Russell等开发，用于评估个体的孤独感程度。量表包含20个题目，采用4点计分法，总分20-80分。",
                },
                {
                    id: "its",
                    title: "人际信任量表",
                    description: "ITS人际信任量表评估",
                    emoji: "🙂",
                    questionCount: 12,
                    duration: 4,
                    type: "social",
                    path: "/pages/phq7-test/its",
                    isNew: false,
                    detailDescription:
                        "人际信任量表（Interpersonal Trust Scale，ITS）由Rotter开发，用于评估个体对他人的信任程度。量表包含12个题目，采用5点计分法，总分12-60分。",
                },
                {
                    id: "psqi",
                    title: "匹兹堡睡眠质量指数",
                    description: "PSQI睡眠质量评估",
                    emoji: "😴",
                    questionCount: 7,
                    duration: 3,
                    type: "sleep",
                    path: "/pages/phq7-test/psqi",
                    isNew: false,
                    detailDescription:
                        "匹兹堡睡眠质量指数（Pittsburgh Sleep Quality Index，PSQI）由Buysse等开发，用于评估睡眠质量。量表包含7个维度，采用0-3分计分法，总分0-21分。",
                },
                {
                    id: "sds",
                    title: "睡眠障碍量表",
                    description: "SDS睡眠障碍评估",
                    emoji: "😵",
                    questionCount: 10,
                    duration: 4,
                    type: "sleep",
                    path: "/pages/phq7-test/sds",
                    isNew: false,
                    detailDescription:
                        "睡眠障碍量表（Sleep Disorder Scale，SDS）用于评估各种睡眠障碍症状。量表包含10个题目，采用0-3分计分法，总分0-30分。",
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
