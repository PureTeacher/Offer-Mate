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
                        <text class="level-label">职业定位清晰度</text>
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
            themeColor: "#5d9bff", // 主色调 - 青色代表职业规划
            answers: [], // 初始化空数组
            questions: [
                {
                    id: 1,
                    type: "planning",
                    text: "你对自己的职业兴趣领域是否有明确的认识",
                    options: [
                        { text: "完全不了解", desc: "0分", score: 0 },
                        { text: "了解一些", desc: "3分", score: 3 },
                        { text: "较为清楚", desc: "6分", score: 6 },
                        { text: "非常清楚", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 2,
                    type: "planning",
                    text: "你的核心能力优势是否与目标岗位相匹配",
                    options: [
                        { text: "匹配较弱", desc: "0分", score: 0 },
                        { text: "有一定匹配", desc: "3分", score: 3 },
                        { text: "比较匹配", desc: "6分", score: 6 },
                        { text: "高度匹配", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 3,
                    type: "planning",
                    text: "你是否拥有目标岗位要求的专业技能和行业经验",
                    options: [
                        { text: "完全不具备", desc: "0分", score: 0 },
                        { text: "有所缺乏", desc: "3分", score: 3 },
                        { text: "基本具备", desc: "6分", score: 6 },
                        { text: "充分具备", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 4,
                    type: "planning",
                    text: "你是否乐于主动学习新知识和技能，保持竞争力",
                    options: [
                        { text: "完全不会", desc: "0分", score: 0 },
                        { text: "很少会", desc: "3分", score: 3 },
                        { text: "经常会", desc: "6分", score: 6 },
                        { text: "经常主动", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 5,
                    type: "planning",
                    text: "你是否有清晰的个人职业品牌和价值主张",
                    options: [
                        { text: "完全没有", desc: "0分", score: 0 },
                        { text: "有所了解", desc: "3分", score: 3 },
                        { text: "比较清楚", desc: "6分", score: 6 },
                        { text: "非常清晰", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 6,
                    type: "planning",
                    text: "你是否了解所在行业和上下游的发展趋势",
                    options: [
                        { text: "完全不了解", desc: "0分", score: 0 },
                        { text: "了解一些", desc: "3分", score: 3 },
                        { text: "较为了解", desc: "6分", score: 6 },
                        { text: "深度了解", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 7,
                    type: "planning",
                    text: "你是否主动展示自己的竞争力或向他人介绍个人价值",
                    options: [
                        { text: "从不主动", desc: "0分", score: 0 },
                        { text: "偶尔展示", desc: "3分", score: 3 },
                        { text: "定期展示", desc: "6分", score: 6 },
                        { text: "经常主动", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 8,
                    type: "planning",
                    text: "你是否制定了明确的职业发展目标和阶段性计划",
                    options: [
                        { text: "完全没有", desc: "0分", score: 0 },
                        { text: "有初步想法", desc: "3分", score: 3 },
                        { text: "较为清晰", desc: "6分", score: 6 },
                        { text: "目标和计划完整", desc: "10分", score: 10 },
                    ],
                },
                {
                    id: 9,
                    type: "planning",
                    text: "你是否经常与行业前辈、专家交流以获得职业指导",
                    options: [
                        { text: "从不交流", desc: "0分", score: 0 },
                        { text: "偶尔交流", desc: "3分", score: 3 },
                        { text: "定期交流", desc: "6分", score: 6 },
                        { text: "经常主动", desc: "10分", score: 10 },
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

            // 根据10分制标准判断职业定位清晰度（9题，总分0-90）
            let careerLevel = "";
            let levelDescription = "";
            let suggestion = "";

            if (totalScore >= 0 && totalScore <= 18) {
                careerLevel = "职业规划待完善";
                levelDescription =
                    "您对职业定位的认知有待加强，缺乏清晰的职业方向和规划。";
                suggestion =
                    "1. 进行深度自我评估，明确自己的兴趣、优势和核心价值观\n2. 研究目标行业和岗位的市场需求和发展前景\n3. 通过实践和体验探索可能的职业方向\n4. 制定初步的职业探索计划";
            } else if (totalScore >= 19 && totalScore <= 36) {
                careerLevel = "职业方向初步明确";
                levelDescription =
                    "您已有职业方向的初步想法，但规划的系统性和完整性需要提升。";
                suggestion =
                    "1. 进一步验证职业方向的适配度（与能力、兴趣、价值观的匹配度）\n2. 了解该领域的发展前景、就业机会和薪资水平\n3. 制定具体的能力提升计划和行动步骤\n4. 设立3-6个月的短期目标和里程碑";
            } else if (totalScore >= 37 && totalScore <= 54) {
                careerLevel = "职业规划较为清晰";
                levelDescription =
                    "您对职业定位有了较清晰的认识，具备基本的发展方向和目标。";
                suggestion =
                    "1. 制定详细的1-3年职业发展路线图，明确各阶段目标\n2. 识别关键能力缺口，优先进行针对性的学习和提升\n3. 建立专业人脉网络，寻找导师指导和机会\n4. 定期回顾进展，灵活调整计划";
            } else if (totalScore >= 55 && totalScore <= 72) {
                careerLevel = "职业方向明确稳定";
                levelDescription =
                    "您的职业定位清晰稳定，已形成完整的职业规划体系。";
                suggestion =
                    "1. 深化核心竞争力，在专业领域建立差异化优势\n2. 拓展行业人脉和影响力，争取更多发展机会\n3. 定期评估市场变化对职业规划的影响\n4. 考虑建立副业或多元发展的可能性";
            } else if (totalScore >= 73 && totalScore <= 90) {
                careerLevel = "职业规划完整优秀";
                levelDescription =
                    "您具有非常清晰的职业定位和完整的发展规划，已具备执行能力。";
                suggestion =
                    "1. 坚定执行职业规划，逐步实现既定目标\n2. 在专业领域深化优势，争取成为行业专家或领军人物\n3. 反思个人价值和社会贡献，探索更深层的职业意义\n4. 准备开启职业发展的新阶段或新突破";
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
            // 返回上一页
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
            if (level.includes("待完善")) return "level-critical";
            if (level.includes("初步")) return "level-mild";
            if (level.includes("较为")) return "level-moderate";
            if (level.includes("明确稳定")) return "level-normal";
            if (level.includes("完整优秀")) return "level-normal";
            return "level-normal";
        },
        // 保存测试结果到数据库
        async saveTestResultToDatabase() {
            const requestData = {
                questionnaireName: "职业性格特质筛查量表",
                questionnaireType: "mood",
                score: this.resultData.totalScore,
                careerLevel: this.resultData.depressionLevel,
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
                    console.error("保存失败:", result.message);
                    uni.showToast({
                        title: result.message || "保存失败，请重试",
                        icon: "error",
                        duration: 2000,
                    });
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
