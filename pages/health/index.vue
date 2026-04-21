<template>
    <view
        :class="['health-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->
        <!-- <view class="header">
		  <view class="header-left">
			<text class="back-arrow" @click="goBack">⬅️</text>
			<text class="header-title">健康科普</text>
		  </view>
		  <view class="header-subtitle">
			<text class="subtitle-text">科学养生，健康生活</text>
		  </view>
		</view> -->

        <!-- 分类导航 -->
        <view class="category-section">
            <scroll-view class="category-scroll" scroll-x>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'all' }"
                    @click="filterByCategory('all')"
                >
                    <text class="category-icon">📚</text>
                    <text class="category-text">全部</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'mental' }"
                    @click="filterByCategory('mental')"
                >
                    <text class="category-icon">💡</text>
                    <text class="category-text">心理健康</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'nutrition' }"
                    @click="filterByCategory('nutrition')"
                >
                    <text class="category-icon">🍎</text>
                    <text class="category-text">营养健康</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'exercise' }"
                    @click="filterByCategory('exercise')"
                >
                    <text class="category-icon">🏃</text>
                    <text class="category-text">运动健身</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'sleep' }"
                    @click="filterByCategory('sleep')"
                >
                    <text class="category-icon">🌙</text>
                    <text class="category-text">睡眠健康</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'disease' }"
                    @click="filterByCategory('disease')"
                >
                    <text class="category-icon">⚕️</text>
                    <text class="category-text">疾病预防</text>
                </view>
            </scroll-view>
        </view>

        <!-- 文章列表 -->
        <view class="article-list" v-if="!loading">
            <view v-if="filteredArticles.length === 0" class="empty-state">
                <text class="empty-emoji">📚</text>
                <text class="empty-text">暂无相关文章</text>
                <text class="empty-desc">请选择其他分类查看</text>
            </view>

            <view v-else>
                <view
                    v-for="(article, index) in filteredArticles"
                    :key="article.id"
                    class="article-card"
                    @click="viewArticle(article)"
                >
                    <view class="card-header">
                        <view
                            class="article-category"
                            :class="getCategoryClass(article.category)"
                        >
                            <text class="category-text">{{
                                getCategoryName(article.category)
                            }}</text>
                        </view>
                        <view class="article-meta">
                            <text class="read-count"
                                >{{ article.readCount }}阅读</text
                            >
                            <text class="publish-time">{{
                                formatDate(article.publishTime)
                            }}</text>
                        </view>
                    </view>

                    <view class="card-content">
                        <text class="article-title">{{ article.title }}</text>
                        <text class="article-summary">{{
                            article.summary
                        }}</text>

                        <view class="article-tags">
                            <text
                                v-for="tag in article.tags"
                                :key="tag"
                                class="tag"
                            >
                                {{ tag }}
                            </text>
                        </view>
                    </view>

                    <view class="card-footer">
                        <view class="author-info">
                            <text class="author-name">{{
                                article.author
                            }}</text>
                            <text class="author-title">{{
                                article.authorTitle
                            }}</text>
                        </view>
                        <view class="read-more">
                            <text class="read-text">阅读全文</text>
                            <text class="arrow">➡️</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 文章详情弹窗 -->
        <view class="article-modal" v-if="showArticle" @click="closeArticle">
            <view class="article-content" @click.stop>
                <view class="article-header">
                    <view
                        class="article-category"
                        :class="getCategoryClass(selectedArticle.category)"
                    >
                        <text class="category-text">{{
                            getCategoryName(selectedArticle.category)
                        }}</text>
                    </view>
                    <view class="close-btn" @click="closeArticle">×</view>
                </view>

                <view class="article-body">
                    <text class="article-title">{{
                        selectedArticle.title
                    }}</text>

                    <view class="article-meta">
                        <view class="meta-item">
                            <text class="meta-label">作者</text>
                            <text class="meta-value"
                                >{{ selectedArticle.author }} ·
                                {{ selectedArticle.authorTitle }}</text
                            >
                        </view>
                        <view class="meta-item">
                            <text class="meta-label">发布时间</text>
                            <text class="meta-value">{{
                                formatDate(selectedArticle.publishTime)
                            }}</text>
                        </view>
                        <view class="meta-item">
                            <text class="meta-label">阅读量</text>
                            <text class="meta-value">{{
                                selectedArticle.readCount
                            }}</text>
                        </view>
                    </view>

                    <view class="article-tags">
                        <text
                            v-for="tag in selectedArticle.tags"
                            :key="tag"
                            class="tag"
                        >
                            {{ tag }}
                        </text>
                    </view>

                    <view class="article-content-text">
                        <text class="content-text">{{
                            selectedArticle.content
                        }}</text>
                    </view>
                </view>

                <view class="article-footer">
                    <button class="close-btn" @click="closeArticle">
                        关闭
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            themeColor: "#f093fb",
            loading: true,
            currentCategory: "all",
            showArticle: false,
            selectedArticle: {},
            articles: [
                {
                    id: 1,
                    title: "如何正确管理压力和焦虑",
                    summary:
                        "现代生活中，压力和焦虑是常见问题。本文将介绍科学有效的压力管理方法，帮助您建立健康的心理状态。",
                    content:
                        "在现代快节奏的生活中，压力和焦虑已经成为许多人面临的常见问题。正确管理这些情绪对于维护心理健康至关重要。\n\n首先，识别压力源是管理压力的第一步。了解什么情况会引发您的压力反应，有助于制定针对性的应对策略。\n\n其次，建立健康的生活习惯。规律的运动、充足的睡眠和均衡的饮食都能有效缓解压力。每天进行30分钟的有氧运动，如散步、跑步或游泳，可以释放内啡肽，提升心情。\n\n第三，学会放松技巧。深呼吸、冥想、瑜伽等都是有效的放松方法。每天花10-15分钟进行深呼吸练习，可以显著降低焦虑水平。\n\n最后，建立支持网络。与家人、朋友分享您的感受，寻求专业帮助也是重要的应对策略。记住，寻求帮助是勇敢的表现，不是软弱。",
                    category: "mental",
                    author: "张心理",
                    authorTitle: "心理咨询师",
                    publishTime: "2024-01-15",
                    readCount: 1256,
                    tags: ["心理健康", "压力管理", "焦虑"],
                },
                {
                    id: 2,
                    title: "营养均衡的饮食指南",
                    summary:
                        "了解如何通过合理的饮食搭配来维持身体健康，预防疾病，提升生活质量。",
                    content:
                        "营养均衡的饮食是维持身体健康的基础。一个健康的饮食应该包含五大营养素：碳水化合物、蛋白质、脂肪、维生素和矿物质。\n\n碳水化合物是身体的主要能量来源，应选择复合碳水化合物，如全谷物、燕麦、糙米等，避免精制糖和加工食品。\n\n蛋白质是身体组织的重要组成部分，优质蛋白质来源包括鱼类、瘦肉、豆类、坚果等。建议每餐都包含一定量的蛋白质。\n\n健康脂肪对大脑和心脏健康至关重要。选择不饱和脂肪，如橄榄油、牛油果、坚果和深海鱼类。\n\n维生素和矿物质虽然需要量少，但对身体功能至关重要。多吃各种颜色的蔬菜和水果，确保摄入足够的维生素C、维生素A、叶酸等。\n\n此外，保持充足的水分摄入，每天至少8杯水，限制盐分和糖分的摄入，这些都是健康饮食的重要组成部分。",
                    category: "nutrition",
                    author: "李营养",
                    authorTitle: "营养师",
                    publishTime: "2024-01-14",
                    readCount: 892,
                    tags: ["营养健康", "饮食指南", "健康生活"],
                },
                {
                    id: 3,
                    title: "科学运动，健康生活",
                    summary:
                        "运动是保持身体健康的重要方式，了解如何制定适合自己的运动计划。",
                    content:
                        "运动是维持身体健康和心理健康的重要方式。科学合理的运动计划可以帮助您增强体质，预防疾病，提升生活质量。\n\n有氧运动是运动的基础，包括跑步、游泳、骑自行车等。建议每周进行至少150分钟的中等强度有氧运动，或75分钟的高强度有氧运动。\n\n力量训练同样重要，可以帮助增强肌肉力量，提高骨密度，预防骨质疏松。建议每周进行2-3次力量训练，针对主要肌群进行练习。\n\n柔韧性训练，如瑜伽、普拉提等，可以改善身体柔韧性，减少运动损伤的风险。\n\n平衡训练对老年人尤为重要，可以预防跌倒，提高生活质量。\n\n制定运动计划时，要根据自己的年龄、健康状况和运动经验来调整。循序渐进，避免过度运动。运动前要做好热身，运动后要进行拉伸。\n\n记住，任何运动都比不运动好，找到自己喜欢的运动方式，坚持下去，健康生活从运动开始。",
                    category: "exercise",
                    author: "王健身",
                    authorTitle: "健身教练",
                    publishTime: "2024-01-13",
                    readCount: 743,
                    tags: ["运动健身", "健康生活", "科学运动"],
                },
                {
                    id: 4,
                    title: "优质睡眠的秘诀",
                    summary:
                        "睡眠质量直接影响身体健康和心理健康，学习如何改善睡眠质量。",
                    content:
                        "睡眠是身体恢复和修复的重要时间，优质的睡眠对身体健康和心理健康都至关重要。\n\n建立规律的睡眠时间表是改善睡眠质量的第一步。尽量每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。\n\n创造良好的睡眠环境。保持卧室温度适宜（18-22°C），保持安静和黑暗。使用遮光窗帘和耳塞可以帮助创造更好的睡眠环境。\n\n睡前避免使用电子设备。蓝光会抑制褪黑素的分泌，影响睡眠。建议睡前1小时停止使用手机、电脑等电子设备。\n\n建立睡前放松习惯。可以阅读、听轻音乐、进行深呼吸练习或冥想。避免在睡前进行剧烈运动或刺激性活动。\n\n注意饮食对睡眠的影响。避免在睡前3小时内进食大量食物，限制咖啡因和酒精的摄入。\n\n如果长期存在睡眠问题，建议咨询专业医生，排除睡眠障碍等疾病。记住，良好的睡眠是健康生活的基础。",
                    category: "sleep",
                    author: "陈睡眠",
                    authorTitle: "睡眠医学专家",
                    publishTime: "2024-01-12",
                    readCount: 1089,
                    tags: ["睡眠健康", "睡眠质量", "健康生活"],
                },
                {
                    id: 5,
                    title: "常见疾病的预防措施",
                    summary:
                        "了解常见疾病的预防方法，建立健康的生活方式，降低患病风险。",
                    content:
                        "预防胜于治疗，了解常见疾病的预防措施是维护健康的重要方法。\n\n心血管疾病是威胁健康的主要疾病之一。预防措施包括：控制血压、血糖和血脂，戒烟限酒，保持健康体重，规律运动，低盐低脂饮食。\n\n糖尿病预防需要控制体重，保持健康饮食，规律运动，定期监测血糖。避免高糖高脂饮食，多吃蔬菜水果和全谷物。\n\n癌症预防包括：戒烟限酒，避免过度日晒，定期体检，保持健康体重，多吃蔬菜水果，限制加工肉类摄入。\n\n骨质疏松预防需要充足的钙质和维生素D摄入，规律运动，避免吸烟和过量饮酒。\n\n心理健康同样重要。保持积极心态，学会压力管理，建立良好的人际关系，寻求专业帮助都是维护心理健康的重要方法。\n\n定期体检是预防疾病的重要手段，可以早期发现和干预健康问题。建议根据年龄和性别进行相应的体检项目。\n\n记住，健康的生活方式是预防疾病的最佳方法，投资健康就是投资未来。",
                    category: "disease",
                    author: "赵预防",
                    authorTitle: "预防医学专家",
                    publishTime: "2024-01-11",
                    readCount: 1567,
                    tags: ["疾病预防", "健康生活", "预防医学"],
                },
                {
                    id: 6,
                    title: "心理健康的重要性",
                    summary:
                        "心理健康与身体健康同样重要，了解如何维护心理健康。",
                    content:
                        "心理健康是整体健康的重要组成部分，与身体健康密不可分。维护心理健康对提高生活质量、增强抗压能力、改善人际关系都至关重要。\n\n心理健康包括情绪稳定、认知功能正常、社会适应良好等方面。当心理状态出现问题时，会直接影响身体健康，反之亦然。\n\n维护心理健康的方法包括：\n\n1. 保持积极的心态。学会从积极的角度看待问题，培养乐观的生活态度。\n\n2. 建立良好的人际关系。与家人、朋友保持密切联系，分享感受，获得支持。\n\n3. 学会压力管理。掌握有效的压力应对技巧，如深呼吸、冥想、运动等。\n\n4. 保持工作与生活的平衡。合理安排时间，避免过度工作，给自己留出休息和娱乐的时间。\n\n5. 寻求专业帮助。当心理问题严重影响生活时，不要犹豫寻求心理咨询师或精神科医生的帮助。\n\n6. 培养兴趣爱好。参与自己喜欢的活动，可以带来成就感和满足感。\n\n记住，关注心理健康不是软弱的表现，而是智慧的选择。投资心理健康，就是投资更好的自己。",
                    category: "mental",
                    author: "孙心理",
                    authorTitle: "临床心理学家",
                    publishTime: "2024-01-10",
                    readCount: 2134,
                    tags: ["心理健康", "心理保健", "生活质量"],
                },
            ],
        };
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === "all") {
                return this.articles;
            }
            return this.articles.filter(
                (article) => article.category === this.currentCategory,
            );
        },
    },
    methods: {
        async loadArticles() {
            try {
                this.loading = true;
                // 模拟API调用延迟
                await new Promise((resolve) => setTimeout(resolve, 1000));
                this.loading = false;
            } catch (error) {
                console.error("加载文章失败:", error);
                this.loading = false;
            }
        },

        filterByCategory(category) {
            this.currentCategory = category;
        },

        getCategoryName(category) {
            const categoryMap = {
                mental: "心理健康",
                nutrition: "营养健康",
                exercise: "运动健身",
                sleep: "睡眠健康",
                disease: "疾病预防",
            };
            return categoryMap[category] || "其他";
        },

        getCategoryClass(category) {
            const classMap = {
                mental: "category-mental",
                nutrition: "category-nutrition",
                exercise: "category-exercise",
                sleep: "category-sleep",
                disease: "category-disease",
            };
            return classMap[category] || "category-default";
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (days === 0) {
                return "今天";
            } else if (days === 1) {
                return "昨天";
            } else if (days < 7) {
                return `${days}天前`;
            } else {
                return date.toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            }
        },

        viewArticle(article) {
            this.selectedArticle = article;
            this.showArticle = true;
        },

        closeArticle() {
            this.showArticle = false;
            this.selectedArticle = {};
        },

        goBack() {
            uni.navigateBack();
        },
    },

    onShow() {
        this.loadArticles();
    },
};
</script>

<style lang="scss">
.health-container {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #fff8f3 0%,
        #ffe8d6 50%,
        #fff5f0 100%
    );
    padding-bottom: 40rpx;
}

.header {
    display: flex;
    flex-direction: column;
    padding: 40rpx 30rpx 20rpx;
    background: white;
    border-bottom: 1rpx solid #e2e8f0;

    .header-left {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
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

    .header-subtitle {
        .subtitle-text {
            font-size: 24rpx;
            color: #64748b;
        }
    }
}

.category-section {
    padding: 20rpx 30rpx;
    background: transparent;

    .category-scroll {
        white-space: nowrap;
    }

    .category-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 30rpx;
        margin-right: 20rpx;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 20rpx;
        transition: all 0.3s;
        min-width: 120rpx;
        border: 1rpx solid rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10rpx);

        &.active {
            background: linear-gradient(135deg, #e07856 0%, #d4744e 100%);
            transform: scale(1.05);
            border-color: #d4744e;
            box-shadow: 0 8rpx 20rpx rgba(224, 120, 86, 0.25);

            .category-text {
                color: white;
            }
        }

        .category-icon {
            font-size: 32rpx;
            margin-bottom: 8rpx;
            opacity: 0.8;
        }

        .category-text {
            font-size: 22rpx;
            color: #d4744e;
            font-weight: 600;
        }
    }
}

.article-list {
    padding: 0 30rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    text-align: center;

    .empty-emoji {
        font-size: 120rpx;
        margin-bottom: 30rpx;
        opacity: 0.6;
    }

    .empty-text {
        font-size: 32rpx;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 15rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: #94a3b8;
    }
}

.article-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.12);
    border: none;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(224, 120, 86, 0.18);
    }

    &:active {
        transform: translateY(-4rpx) scale(0.99);
        box-shadow: 0 12rpx 28rpx rgba(224, 120, 86, 0.15);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;

        .article-category {
            padding: 8rpx 16rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            font-weight: 500;

            &.category-mental {
                background: #dbeafe;
                color: #1d4ed8;
                border: 1rpx solid #bfdbfe;
            }

            &.category-nutrition {
                background: #dcfce7;
                color: #16a34a;
                border: 1rpx solid #bbf7d0;
            }

            &.category-exercise {
                background: #fef3c7;
                color: #d97706;
                border: 1rpx solid #fde68a;
            }

            &.category-sleep {
                background: #e9d5ff;
                color: #7c3aed;
                border: 1rpx solid #ddd6fe;
            }

            &.category-disease {
                background: #fee2e2;
                color: #dc2626;
                border: 1rpx solid #fecaca;
            }

            &.category-default {
                background: #f1f5f9;
                color: #64748b;
                border: 1rpx solid #e2e8f0;
            }
        }

        .article-meta {
            text-align: right;

            .read-count {
                display: block;
                font-size: 20rpx;
                color: #94a3b8;
                margin-bottom: 5rpx;
            }

            .publish-time {
                font-size: 18rpx;
                color: #cbd5e1;
            }
        }
    }

    .card-content {
        margin-bottom: 24rpx;

        .article-title {
            display: block;
            font-size: 30rpx;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15rpx;
            line-height: 1.4;
        }

        .article-summary {
            display: block;
            font-size: 24rpx;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 15rpx;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10rpx;

            .tag {
                font-size: 18rpx;
                color: #3b82f6;
                background: #f1f5f9;
                padding: 4rpx 12rpx;
                border-radius: 12rpx;
                border: 1rpx solid #e2e8f0;
            }
        }
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .author-info {
            .author-name {
                display: block;
                font-size: 22rpx;
                color: #1e293b;
                font-weight: 600;
                margin-bottom: 4rpx;
            }

            .author-title {
                font-size: 18rpx;
                color: #94a3b8;
            }
        }

        .read-more {
            display: flex;
            align-items: center;

            .read-text {
                font-size: 22rpx;
                color: #3b82f6;
                margin-right: 8rpx;
            }

            .arrow {
                font-size: 18rpx;
                color: #3b82f6;
            }
        }
    }
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;

    .loading-spinner {
        width: 60rpx;
        height: 60rpx;
        border: 4rpx solid #e2e8f0;
        border-top: 4rpx solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20rpx;
    }

    .loading-text {
        font-size: 28rpx;
        color: #64748b;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.article-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
    animation: fadeIn 0.3s ease;
}

.article-content {
    background: white;
    border-radius: 20rpx;
    width: 100%;
    max-width: 600rpx;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 1rpx solid #e2e8f0;
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 40rpx 20rpx;
    border-bottom: 1rpx solid #e2e8f0;

    .article-category {
        padding: 8rpx 16rpx;
        border-radius: 12rpx;
        font-size: 20rpx;
        font-weight: 500;

        &.category-mental {
            background: #dbeafe;
            color: #1d4ed8;
            border: 1rpx solid #bfdbfe;
        }

        &.category-nutrition {
            background: #dcfce7;
            color: #16a34a;
            border: 1rpx solid #bbf7d0;
        }

        &.category-exercise {
            background: #fef3c7;
            color: #d97706;
            border: 1rpx solid #fde68a;
        }

        &.category-sleep {
            background: #e9d5ff;
            color: #7c3aed;
            border: 1rpx solid #ddd6fe;
        }

        &.category-disease {
            background: #fee2e2;
            color: #dc2626;
            border: 1rpx solid #fecaca;
        }
    }

    .close-btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #64748b;
        font-weight: 300;
        border: 1rpx solid #e2e8f0;
    }
}

.article-body {
    padding: 40rpx;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 0;

    .article-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 20rpx;
        line-height: 1.4;
    }

    .article-meta {
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        margin-bottom: 20rpx;

        .meta-item {
            display: flex;
            justify-content: space-between;

            .meta-label {
                font-size: 22rpx;
                color: #94a3b8;
                font-weight: 500;
            }

            .meta-value {
                font-size: 22rpx;
                color: #1e293b;
                font-weight: 500;
            }
        }
    }

    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-bottom: 30rpx;

        .tag {
            font-size: 18rpx;
            color: #3b82f6;
            background: #f1f5f9;
            padding: 6rpx 12rpx;
            border-radius: 12rpx;
            border: 1rpx solid #e2e8f0;
        }
    }

    .article-content-text {
        .content-text {
            font-size: 26rpx;
            color: #1e293b;
            line-height: 1.8;
            word-wrap: break-word;
            word-break: break-all;
            white-space: pre-wrap;
            display: block;
        }
    }
}

.article-footer {
    padding: 20rpx 40rpx 40rpx;

    .close-btn {
        width: 100%;
        height: 80rpx;
        background: #3b82f6;
        color: white;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: 600;
        border: none;
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
