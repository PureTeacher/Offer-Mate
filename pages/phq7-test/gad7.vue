<template>
    <view
        :class="['test-page', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->

        <!-- 顶部进度条 -->
        <view class="progress-container">
            <text class="progress-text"
                >第 {{ currentIndex + 1 }}/{{ questions.length }} 题</text
            >
            <progress
                :percent="progress"
                activeColor="var(--theme-color)"
                backgroundColor="#EBEDF0"
                stroke-width="12"
                class="progress-bar"
            />
        </view>

        <!-- 题目卡片 -->
        <view class="question-card">
            <view class="card-header">
                <view
                    class="question-type-tag"
                    :style="{ background: typeTag.color }"
                >
                    <image :src="typeTag.icon" class="type-icon" />
                    <text>{{ typeTag.text }}</text>
                </view>
                <view class="question-number">Q{{ currentIndex + 1 }}</view>
            </view>

            <scroll-view scroll-y class="question-content">
                <text class="question-text">{{ currentQuestion.text }}</text>
                <text class="question-tip">请根据最近两周的情况选择</text>
            </scroll-view>
        </view>

        <!-- 选项列表 -->
        <view class="options-container">
            <view
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="option-card"
                :class="{ selected: selectedOption === index }"
                @click="selectOption(index)"
                :style="getOptionStyle(index)"
            >
                <view class="option-selector">
                    <view class="selector-outer">
                        <view
                            class="selector-inner"
                            v-if="selectedOption === index"
                        />
                    </view>
                </view>
                <view class="option-content">
                    <text class="option-text">{{ option.text }}</text>
                    <text class="option-desc" v-if="option.desc">{{
                        option.desc
                    }}</text>
                </view>
                <image
                    src="/static/icons/check-circle.png"
                    class="option-check"
                    v-if="selectedOption === index"
                />
            </view>
        </view>

        <!-- 导航按钮 -->
        <view class="navigation-buttons">
            <button
                class="nav-button prev-button"
                :class="{ disabled: currentIndex === 0 }"
                @click="prevQuestion"
            >
                <!-- <image src="/static/icons/arrow-left.png" class="button-icon"/> -->
                <!-- <uni-icons type="arrow-left" size="30" style="margin-right: 20rpx;"></uni-icons> -->
                上一题
            </button>
            <button
                class="nav-button next-button"
                :class="{ disabled: selectedOption === null }"
                @click="nextQuestion"
            >
                {{ isLastQuestion ? "查看结果" : "下一题" }}
                <!-- 		<uni-icons type="arrow-right" size="30" style="margin-left: 20rpx;"></uni-icons> -->

                <!-- <image src="/static/icons/arrow-right.png" class="button-icon"/> -->
            </button>
        </view>

        <!-- 鼓励反馈 -->
        <view class="encouragement-feedback" v-if="showEncouragement">
            <image :src="encouragement.emoji" class="encouragement-emoji" />
            <text class="encouragement-text">{{ encouragement.text }}</text>
        </view>

        <!-- 结果弹窗 -->
        <view class="result-modal" v-if="showResult" @click="closeResult">
            <view class="result-content" @click.stop>
                <view class="result-header">
                    <text class="result-title">测试结果</text>
                    <view class="close-btn" @click="closeResult">×</view>
                </view>

                <view class="result-body">
                    <view class="score-section">
                        <text class="score-label">总分</text>
                        <text class="score-value"
                            >{{ resultData.totalScore }}分</text
                        >
                    </view>

                    <view class="level-section">
                        <text class="level-label">职业目标清晰度</text>
                        <text
                            class="level-value"
                            :class="getLevelClass(resultData.careerLevel)"
                            >{{ resultData.careerLevel }}</text
                        >
                    </view>

                    <view class="description-section">
                        <text class="description-text">{{
                            resultData.levelDescription
                        }}</text>
                    </view>

                    <view class="suggestion-section">
                        <text class="suggestion-label">建议</text>
                        <text class="suggestion-text">{{
                            resultData.suggestion
                        }}</text>
                    </view>
                </view>

                <view class="result-footer">
                    <button class="result-btn primary" @click="restartTest">
                        重新测试
                    </button>
                    <button class="result-btn secondary" @click="closeResult">
                        关闭
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// import { savePhq9Result } from '@/api/questionnaire'

export default {
    data() {
        return {
            themeColor: "#FFA500", // 主色调 - 橙色代表压力管理
            answers: [], // 初始化空数组
            questions: [
                {
                    id: 1,
                    type: "planning",
                    text: "你对自己的职业目标是否有明确的定位",
                    options: [
                        { text: "完全没有", desc: "0分", score: 0 },
                        { text: "有初步想法", desc: "3分", score: 3 },
                        { text: "较为明确", desc: "6分", score: 6 },
                        { text: "非常清晰", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 2,
                    type: "planning",
                    text: "你的职业目标是否具有可执行性和可达成性",
                    options: [
                        { text: "完全不可行", desc: "0分", score: 0 },
                        { text: "有一定难度", desc: "3分", score: 3 },
                        { text: "基本可行", desc: "6分", score: 6 },
                        { text: "完全可行", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 3,
                    type: "planning",
                    text: "你是否清楚实现目标需要的关键资源和条件",
                    options: [
                        { text: "完全不清楚", desc: "0分", score: 0 },
                        { text: "了解一部分", desc: "3分", score: 3 },
                        { text: "较为清楚", desc: "6分", score: 6 },
                        { text: "非常明确", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 4,
                    type: "planning",
                    text: "你是否制定了具体的行动计划来实现目标",
                    options: [
                        { text: "没有计划", desc: "0分", score: 0 },
                        { text: "有模糊想法", desc: "3分", score: 3 },
                        { text: "有详细计划", desc: "6分", score: 6 },
                        { text: "计划明确且执行", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 5,
                    type: "planning",
                    text: "你是否定期评估和调整职业目标",
                    options: [
                        { text: "从不评估", desc: "0分", score: 0 },
                        { text: "偶尔评估", desc: "3分", score: 3 },
                        { text: "定期评估", desc: "6分", score: 6 },
                        { text: "经常调整优化", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 6,
                    type: "planning",
                    text: "你是否有足够的信心和决心追求目标",
                    options: [
                        { text: "信心不足", desc: "0分", score: 0 },
                        { text: "信心一般", desc: "3分", score: 3 },
                        { text: "相当有信心", desc: "6分", score: 6 },
                        { text: "决心坚定", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 7,
                    type: "planning",
                    text: "你是否寻求过导师或专家的目标评估建议",
                    options: [
                        { text: "从未寻求", desc: "0分", score: 0 },
                        { text: "偶尔咨询", desc: "3分", score: 3 },
                        { text: "经常咨询", desc: "6分", score: 6 },
                        { text: "定期指导", desc: "10分", score: 10 },
                    ],
                },
            ],
            currentIndex: 0,
            selectedOption: null,
            showEncouragement: false,
            encouragement: {
                emoji: "",
                text: "",
            },
            encouragements: [
                {
                    emoji: "/static/emojis/star.png",
                    text: "你的回答很有价值！",
                },
                { emoji: "/static/emojis/heart.png", text: "感谢你的真诚回答" },
                {
                    emoji: "/static/emojis/lightbulb.png",
                    text: "自我觉察是成长的第一步",
                },
            ],
            showResult: false,
            resultData: {
                totalScore: 0,
                careerLevel: "",
                levelDescription: "",
                suggestion: "",
            },
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentIndex];
        },
        progress() {
            return Math.round(
                (this.currentIndex / this.questions.length) * 100,
            );
        },
        isLastQuestion() {
            return this.currentIndex === this.questions.length - 1;
        },
        typeTag() {
            const types = {
                mood: {
                    text: "工作热情评估",
                    color: "#FF6B81",
                    icon: "/static/icons/mood.png",
                },
                anxiety: {
                    text: "压力管理",
                    color: "#FFA500",
                    icon: "/static/icons/anxiety.png",
                },
                // 更多类型...
            };
            return (
                types[this.currentQuestion.type] || {
                    text: "职场测评",
                    color: this.themeColor,
                    icon: "/static/icons/psychology.png",
                }
            );
        },
    },
    methods: {
        // 返回上一页
        goBack() {
            uni.navigateBack({
                delta: 1,
            });
        },
        selectOption(index) {
            this.selectedOption = index;
            // 记录当前题目的答案
            this.answers[this.currentIndex] = {
                questionId: this.currentQuestion.id,
                score: this.currentQuestion.options[index].score,
            };
            console.log("当前答案:", this.answers);
            this.showRandomEncouragement();
            uni.vibrateShort(); // 触觉反馈
        },
        showRandomEncouragement() {
            if (Math.random() > 0.7) {
                this.encouragement =
                    this.encouragements[
                        Math.floor(Math.random() * this.encouragements.length)
                    ];
                this.showEncouragement = true;
                setTimeout(() => {
                    this.showEncouragement = false;
                }, 1500);
            }
        },
        nextQuestion() {
            if (this.selectedOption === null) return;

            if (this.isLastQuestion) {
                this.submitTest();
                return;
            }

            this.currentIndex++;
            // 检查下一题是否已有答案，需要找到对应的选项索引
            const nextAnswer = this.answers[this.currentIndex];
            if (nextAnswer) {
                // 根据分数找到对应的选项索引
                this.selectedOption = this.currentQuestion.options.findIndex(
                    (option) => option.score === nextAnswer.score,
                );
            } else {
                this.selectedOption = null;
            }
            this.scrollToTop();
        },
        prevQuestion() {
            if (this.currentIndex <= 0) return;

            this.currentIndex--;
            // 检查上一题是否已有答案，需要找到对应的选项索引
            const prevAnswer = this.answers[this.currentIndex];
            if (prevAnswer) {
                // 根据分数找到对应的选项索引
                this.selectedOption = this.currentQuestion.options.findIndex(
                    (option) => option.score === prevAnswer.score,
                );
            } else {
                this.selectedOption = null;
            }
            this.scrollToTop();
        },
        scrollToTop() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300,
            });
        },
        submitTest() {
            // 计算总分
            const totalScore = this.answers.reduce(
                (sum, a) => sum + (a ? a.score : 0),
                0,
            );

            // 根据10分制标准判断职业目标清晰度（7题，总分0-70）
            let careerLevel = "";
            let levelDescription = "";
            let suggestion = "";

            if (totalScore >= 0 && totalScore <= 14) {
                careerLevel = "目标定位待明确";
                levelDescription =
                    "您对职业目标的定位还比较模糊，缺乏具体的量化目标和执行计划。";
                suggestion =
                    "1. 梳理自己的职业期待和理想状态\n2. 研究目标职位的具体要求和发展前景\n3. 评估当前能力与目标的差距\n4. 制定初步的目标清晰化计划";
            } else if (totalScore >= 15 && totalScore <= 28) {
                careerLevel = "目标初步明确";
                levelDescription =
                    "您的职业目标有了初步想法，但仍需要更深入的思考和验证。";
                suggestion =
                    "1. 将目标具体化、量化，制定SMART目标\n2. 分析实现目标需要的关键步骤和时间线\n3. 识别可能的障碍和风险，制定应对策略\n4. 寻求导师或业内人士的建议和反馈";
            } else if (totalScore >= 29 && totalScore <= 42) {
                careerLevel = "目标较为清晰";
                levelDescription =
                    "您的职业目标已较为清晰，具有一定的可执行性。";
                suggestion =
                    "1. 将目标分解为具体的阶段性里程碑\n2. 制定详细的行动计划和资源配置\n3. 建立评估体系，定期检查进展\n4. 保持灵活性，根据实际情况适时调整";
            } else if (totalScore >= 43 && totalScore <= 70) {
                careerLevel = "目标明确可执行";
                levelDescription =
                    "您的职业目标非常明确，规划系统完整，具有很强的可执行性。";
                suggestion =
                    "1. 制定详细的执行计划，明确每个阶段的重点任务\n2. 建立项目管理体系，跟踪进展和效果\n3. 持续积累关键能力，建立竞争优势\n4. 定期反思总结，优化策略和方法";
            }

            // 设置结果数据并显示弹窗
            this.resultData = {
                totalScore,
                careerLevel,
                levelDescription,
                suggestion,
            };
            this.showResult = true;

            // 保存测试结果到数据库
            this.saveTestResultToDatabase();
        },
        getOptionStyle(index) {
            if (this.selectedOption === index) {
                return {
                    borderColor: this.typeTag.color,
                    backgroundColor: this.hexToRgba(this.typeTag.color, 0.08),
                };
            }
            return {};
        },
        hexToRgba(hex, opacity) {
            // 移除#号并解析RGB值
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        },
        closeResult() {
            this.showResult = false;
            uni.navigateBack({
                delta: 1,
            });
        },
        restartTest() {
            this.showResult = false;
            this.currentIndex = 0;
            this.selectedOption = null;
            this.answers = [];
            this.scrollToTop();
        },
        getLevelClass(level) {
            if (level.includes("待明确")) return "level-critical";
            if (level.includes("初步")) return "level-mild";
            if (level.includes("较为清晰")) return "level-moderate";
            if (level.includes("明确可执行")) return "level-normal";
            return "level-normal";
        },
        // 保存测试结果到数据库
        async saveTestResultToDatabase() {
            const requestData = {
                questionnaireName: "职业目标可行性评估",
                questionnaireType: "planning",
                score: this.resultData.totalScore,
                depressionLevel: this.resultData.careerLevel,
                levelDescription: this.resultData.levelDescription,
                resultData: {
                    answers: this.answers,
                    suggestion: this.resultData.suggestion,
                },
            };

            console.log("准备保存测试结果:", requestData);

            try {
                // 调用后端接口保存数据
                const result =
                    await this.$api.questionnaire.saveResult(requestData);

                if (result.code === 200) {
                    console.log("保存测试结果成功:", result);
                    uni.showToast({
                        title: "测试结果已保存",
                        icon: "success",
                        duration: 2000,
                    });
                } else {
                    // console.error('保存失败:', result.message)
                    // uni.showToast({
                    //   title: result.message || '保存失败，请重试',
                    //   icon: 'error',
                    //   duration: 2000
                    // })
                }
            } catch (error) {
                console.error("保存测试结果失败:", error);
                uni.showToast({
                    title: "网络错误，请检查网络连接",
                    icon: "error",
                    duration: 2000,
                });
            }
        },
    },
};
</script>

<style lang="scss">
.test-page {
    min-height: 100vh;
    padding: 30rpx;
    padding-bottom: 180rpx;
    background-color: #f8faff;
}

/* 顶部导航栏 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    background: white;
    border-bottom: 1rpx solid #e2e8f0;

    .header-left {
        display: flex;
        align-items: center;
    }

    .back-arrow {
        font-size: 40rpx;
        margin-right: 20rpx;
        color: #64748b;
    }

    .header-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #1e293b;
    }
}

/* 进度条样式 */
.progress-container {
    margin-bottom: 40rpx;

    .progress-text {
        display: block;
        text-align: center;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 15rpx;
    }

    .progress-bar {
        border-radius: 10rpx;
    }
}

/* 题目卡片样式 */
.question-card {
    background: white;
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
    }

    .question-type-tag {
        display: inline-flex;
        align-items: center;
        padding: 6rpx 20rpx;
        border-radius: 40rpx;

        text {
            font-size: 24rpx;
            color: white;
            margin-left: 10rpx;
        }

        .type-icon {
            width: 28rpx;
            height: 28rpx;
        }
    }

    .question-number {
        font-size: 32rpx;
        font-weight: bold;
        color: var(--theme-color);
    }

    .question-content {
        max-height: 40vh;

        .question-text {
            font-size: 36rpx;
            font-weight: 500;
            line-height: 1.6;
            color: #333;
        }

        .question-tip {
            display: block;
            font-size: 26rpx;
            color: #999;
            margin-top: 20rpx;
        }
    }
}

/* 选项列表样式 */
.options-container {
    .option-card {
        display: flex;
        align-items: center;
        background: white;
        border-radius: 16rpx;
        padding: 28rpx;
        margin-bottom: 20rpx;
        border: 2rpx solid #f1f3f6;
        transition: all 0.3s ease;

        &.selected {
            border-color: var(--theme-color);
            transform: translateY(-4rpx);
            box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
        }

        &:active {
            transform: scale(0.98);
        }
    }

    .option-selector {
        margin-right: 20rpx;

        .selector-outer {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            border: 2rpx solid #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .selector-inner {
            width: 24rpx;
            height: 24rpx;
            border-radius: 50%;
            background: var(--theme-color);
        }
    }

    .option-content {
        flex: 1;

        .option-text {
            font-size: 30rpx;
            color: #333;
        }

        .option-desc {
            display: block;
            font-size: 24rpx;
            color: #999;
            margin-top: 8rpx;
        }
    }

    .option-check {
        width: 36rpx;
        height: 36rpx;
        margin-left: 15rpx;
    }
}

/* 导航按钮样式 */
.navigation-buttons {
    position: fixed;
    bottom: 30rpx;
    left: 30rpx;
    right: 30rpx;
    display: flex;
    justify-content: space-between;

    .nav-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 90rpx;
        border-radius: 45rpx;
        font-size: 30rpx;
        transition: all 0.3s;

        &.disabled {
            opacity: 0.5;
        }

        .button-icon {
            width: 30rpx;
            height: 30rpx;
        }
    }

    .prev-button {
        background: white;
        color: var(--theme-color);
        border: 1rpx solid var(--theme-color);
        margin-right: 20rpx;

        .button-icon {
            margin-right: 10rpx;
        }
    }

    .next-button {
        background: var(--theme-color);
        color: white;

        .button-icon {
            margin-left: 10rpx;
        }
    }
}

/* 鼓励反馈样式 */
.encouragement-feedback {
    position: fixed;
    bottom: 160rpx;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 0.5s;

    .encouragement-emoji {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 15rpx;
    }

    .encouragement-text {
        background: white;
        padding: 12rpx 30rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        color: var(--theme-color);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 结果弹窗样式 */
.result-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
    animation: fadeIn 0.3s ease;
}

.result-content {
    background: white;
    border-radius: 24rpx;
    width: 100%;
    max-width: 600rpx;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 40rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .result-title {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
    }

    .close-btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #999;
        font-weight: 300;
    }
}

.result-body {
    padding: 40rpx;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 0;
}

.score-section {
    text-align: center;
    margin-bottom: 40rpx;

    .score-label {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
    }

    .score-value {
        font-size: 60rpx;
        font-weight: 700;
        color: var(--theme-color);
    }
}

.level-section {
    text-align: center;
    margin-bottom: 30rpx;

    .level-label {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
    }

    .level-value {
        font-size: 32rpx;
        font-weight: 600;
        padding: 12rpx 24rpx;
        border-radius: 20rpx;
        display: inline-block;

        &.level-normal {
            background: #e8f5e8;
            color: #52c41a;
        }

        &.level-mild {
            background: #fff7e6;
            color: #fa8c16;
        }

        &.level-moderate {
            background: #fff2e8;
            color: #ff7a00;
        }

        &.level-severe {
            background: #fef2f2;
            color: #ff4d4f;
        }

        &.level-critical {
            background: #fef0f0;
            color: #cf1322;
        }
    }
}

.description-section {
    margin-bottom: 30rpx;

    .description-text {
        font-size: 28rpx;
        line-height: 1.8;
        color: #333;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        display: block;
    }
}

.suggestion-section {
    .suggestion-label {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 15rpx;
    }

    .suggestion-text {
        font-size: 26rpx;
        line-height: 1.8;
        color: #333;
        background: #f8f9fa;
        padding: 24rpx;
        border-radius: 12rpx;
        border-left: 4rpx solid var(--theme-color);
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        min-height: 80rpx;
        display: block;
    }
}

.result-footer {
    display: flex;
    padding: 20rpx 40rpx 40rpx;
    gap: 20rpx;

    .result-btn {
        flex: 1;
        height: 80rpx;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: 600;
        border: none;

        &.primary {
            background: var(--theme-color);
            color: white;
        }

        &.secondary {
            background: #f5f5f5;
            color: #666;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
