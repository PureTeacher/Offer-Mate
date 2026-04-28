<template>
    <view
        :class="['health-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->
        <!-- <view class="header">
		  <view class="header-left">
			<text class="back-arrow" @click="goBack">⬅️</text>
			<text class="header-title">职场干货</text>
		  </view>
		  <view class="header-subtitle">
			<text class="subtitle-text">科学养生，职业成长</text>
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
                    <text class="category-text">职业发展</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'nutrition' }"
                    @click="filterByCategory('nutrition')"
                >
                    <text class="category-icon">🍎</text>
                    <text class="category-text">行业洞察</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'exercise' }"
                    @click="filterByCategory('exercise')"
                >
                    <text class="category-icon">🏃</text>
                    <text class="category-text">求职技能</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'sleep' }"
                    @click="filterByCategory('sleep')"
                >
                    <text class="category-icon">🌙</text>
                    <text class="category-text">面试实战</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'disease' }"
                    @click="filterByCategory('disease')"
                >
                    <text class="category-icon">⚕️</text>
                    <text class="category-text">职场成长</text>
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
                    title: "求职焦虑的可执行管理法",
                    summary:
                        "在投递与面试高压期，如何稳住状态并持续输出？本文给出可立即执行的压力管理方法。",
                    content:
                        "求职过程中的焦虑是常见的，但可以通过科学的方法进行管理和缓解。很多求职者在投递被拒、等待回应或面试不顺时，往往陷入无尽的自我怀疑中。第一步是识别焦虑的具体来源，分析到底是简历问题、面试表现不佳，还是方向选择错误，做到心中有数才能对症下药。\n\n识别问题后，最重要的是将焦虑转化为行动的动力。制定具体可执行的计划——优化简历、刷题练习、进行模拟面试、研究目标公司，让每一天都有明确的目标和任务。这样做的好处是让你的关注点从不确定的结果转向你能直接控制的行为，大大降低焦虑感。\n\n同时建立定期的反馈和复盘机制非常关键。每周花时间分析自己的数据：投递了多少份简历、获得多少面试邀请、面试通过率如何、收到了什么样的反馈意见。通过这些数据快速迭代改进方向，你会发现焦虑逐渐被清晰的改进路径所替代。\n\n心态上也需要调整。求职本质上是一个概率事件，需要足够的时间和尝试。建议同步准备多家公司、多个岗位，这样可以降低单一机会的权重，避免过度关注某一个offer而产生的极端焦虑。最后，建立你的支持体系——与朋友交流求职经验、参加求职交流群、寻求专业导师指导，在团体中你会发现自己的焦虑并不孤单，这本身就是很好的情绪缓解方式。",
                    category: "mental",
                    author: "张职场",
                    authorTitle: "职业导师",
                    publishTime: "2024-01-15",
                    readCount: 1256,
                    tags: ["职业发展", "压力管理", "焦虑"],
                },
                {
                    id: 2,
                    title: "行业选择的三层判断框架",
                    summary:
                        "从趋势、岗位能力和长期成长三个维度，快速判断你适合进入的行业方向。",
                    content:
                        "行业选择是职业生涯中最重要的决策之一，这个选择往往会影响你未来5到10年的发展轨迹。很多人在选择行业时只看眼前的薪资，但真正明智的选择需要从多个维度综合评估。\n\n首先要进行宏观趋势分析。观察一个行业的增长率、政策导向、以及未来5-10年的发展空间。处于增长阶段的行业能为你的职业发展提供更广阔的舞台，而衰退阶段的行业即使薪资不错，长期来看也充满风险。你需要问自己：这个行业的蛋糕在变大还是在缩小？\n\n第二个维度是岗位能力匹配。深入分析该行业核心岗位需要的关键技能，评估自己现有技能的差距。重要的是思考这些技能的学习成本——有些核心技能易学，可以在几个月内快速获得；有些则需要多年的行业积累。这直接影响你的入行成本和转型可能性。\n\n第三个维度是长期价值评估。分析这个行业的薪资发展空间、职业天花板在哪里、以及你的行业经历是否能跨越到其他领域。思考一下10年后这个行业会处于什么位置，以及在该行业积累的经验对你整体职业发展的价值。\n\n除此之外，还要问自己一些核心问题：这个行业的工作内容是否让你感兴趣？企业文化是否适合你？工作生活平衡如何？地理位置和薪资是否匹配你的预期？这些问题看似细节，却直接影响你的长期投入。选择行业时不要只看薪资，优先选择增长阶段、能力匹配高、跨界价值强的行业。初期的行业选择相对容易，但一旦步入职业中期再想转行，成本会翻倍上升。",
                    category: "nutrition",
                    author: "李行业",
                    authorTitle: "行业研究顾问",
                    publishTime: "2024-01-14",
                    readCount: 892,
                    tags: ["行业洞察", "饮食指南", "职业成长"],
                },
                {
                    id: 3,
                    title: "简历优化的关键抓手",
                    summary:
                        "从项目成果量化、关键词匹配到表达结构，系统提升简历通过率。",
                    content:
                        "简历是求职的第一关，往往决定了你是否能进入面试环节。很多求职者花费大量时间投递简历，却不知道自己的简历为什么没有得到回应。其实简历优化有一些关键的抓手，如果抓住这些要点，你的简历通过率会有质的飞跃。\n\n首先要学会成果量化。很多简历里充斥着'负责项目管理'、'参与系统优化'这样的空洞表述，但这些词汇对招聘者来说没有任何说服力。正确的做法是用数字说话：'管理5个产品线、20人团队，在6个月内实现30%成本降低、用户增长100万'。具体的数字是最有说服力的证据，它让你的能力变得可视化和可衡量。\n\n其次要进行关键词匹配。大多数公司使用ATS（申请追踪系统）来筛选简历，这套系统会自动扫描简历中的关键词。因此你需要研究目标职位的描述，提取其中的高频词汇（如'数据分析、Python、SQL、A/B测试'），并确保这些关键词在你的简历中自然地出现。如果招聘者在JD中强调需要'项目管理'能力，那你的简历里也要有这个表述。\n\n结构上也要优化。采用倒序法展示你的经历——最相关、最强的经历放在最前面。不要按时间顺序简单地从现在往前列举，而是根据目标职位的要求调整顺序，突出最相关的项目和成就。这样招聘者在扫一眼简历的前三秒就能看到你最有竞争力的部分。\n\n篇幅上要控制在1-2页。删除那些无关的信息和陈旧的技能，每写一句话都问自己'这能证明我的价值吗？'这样做的好处是让简历变得精炼而有力。最后在细节上下功夫——检查语法错误、格式一致性、日期准确性。排版要清晰，避免过度装饰。同时要记住，要为不同的职位调整简历的重点。一份通用简历的通过率往往远低于为特定职位定制的简历。",
                    category: "exercise",
                    author: "王求职",
                    authorTitle: "求职策略教练",
                    publishTime: "2024-01-13",
                    readCount: 743,
                    tags: ["求职技能", "职业成长", "科学运动"],
                },
                {
                    id: 4,
                    title: "面试表达与追问应对",
                    summary:
                        "掌握STAR结构、反问策略与追问拆解技巧，提升面试临场表现。",
                    content:
                        "面试中的表达质量往往决定最终的结果。同样的工作经历，不同的表达方式可能会让你获得截然不同的评价。掌握科学的面试表达技巧能显著提升你的临场表现。\n\n最重要的是学会用STAR结构来回答面试官的问题。STAR分别代表情景(Situation)、任务(Task)、行动(Action)和结果(Result)。当面试官问起你的经历时，不要随意讲述，而是按这个框架来组织你的答案。比如，不要说'我做过一个很成功的项目'，而是要说'我在XX公司负责数据分析工作（情景），面临的任务是在3个月内提升转化率（任务），我采取了A/B测试和用户调研的方法（行动），最终成功将转化率提升了30%（结果）'。这样的结构清晰、完整、有说服力。\n\n当面试官追问时，这往往是你深化印象的关键机会。准备好2-3个延展点来应对追问，比如'在这个过程中遇到的最大困难是什么''团队是如何协作的''这段经历中你学到了什么'。这些追问帮助面试官进一步了解你的解决问题能力和思维深度。\n\n在描述你的成果时，一定要量化。用具体的数字说话——项目的规模有多大、参与多少人、业务指标提升了多少。数字比任何修饰词都更有说服力，它让你的能力变得可衡量和具体。因此在面试前，最好准备5-8个真实的项目案例，这些案例要覆盖不同的能力维度——如领导力、解决问题能力、创新思维等，这样在临场时你可以根据问题灵活选择最匹配的案例。\n\n不要忽视面试最后的环节。当面试官问'你还有问题吗？'时，不要说没有。提出3-5个有深度的问题，这展现了你的思考能力和对公司的真实兴趣。最后，每个回答要控制在1-2分钟，清晰完整优于冗长的讲述。记住面带微笑、语调自信、保持眼神接触，这些细节会大大提升你的整体印象。",
                    category: "sleep",
                    author: "陈面试",
                    authorTitle: "面试训练导师",
                    publishTime: "2024-01-12",
                    readCount: 1089,
                    tags: ["面试实战", "睡眠质量", "职业成长"],
                },
                {
                    id: 5,
                    title: "试用期快速融入团队",
                    summary:
                        "从目标对齐、汇报节奏到跨部门协作，帮助你在试用期建立信任与产出。",
                    content:
                        "试用期是职业发展的关键阶段，这90天往往决定了你是否能在公司长期发展。很多新员工在试用期时紧张焦虑，其实掌握正确的融入策略，你会发现试用期远没有想象中那么困难。\n\n首先要在入职的第一周就与主管进行深度沟通。不要假设自己理解了岗位要求，而是主动明确试用期的目标、关键任务和考核标准。将那些模糊的目标转化为具体可衡量的指标，这样你就有了清晰的行动方向。同时也要系统学习公司的文化、业务逻辑和团队风格。与关键同事一一沟通，了解他们的工作职责和沟通偏好，这样可以帮助你快速适应新环境。\n\n建立定期的汇报节奏也很重要。每周与主管同步一次进度、遇到的问题和下周的计划。这样做一方面让主管清晰地看到你的产出，放心地给你分配更多工作；另一方面你也能及时获得指导，避免走弯路。\n\n在早期选择一些能快速完成的小任务先做成功。这不是说你要选择简单的工作，而是要找到那些你有把握在短时间内出色完成的任务。通过这些早期的胜利，你能快速建立自信心和获得来自团队的信任。同时要主动与相关部门沟通协作，这能快速扩展你的影响范围，让更多人了解你的能力。\n\n最关键的是展现你的学习心态。对来自主管和同事的反馈要虚心接纳，主动询问改进建议，快速迭代改进。这种姿态往往比完美的执行还要得分。很多人认为试用期是被考察的时期，其实更准确地说，这是你快速融入团队的时期。要记住的是，90天后留任的决定通常在30天就已经形成了，所以前30天的表现至关重要。",
                    category: "disease",
                    author: "赵成长",
                    authorTitle: "职场成长教练",
                    publishTime: "2024-01-11",
                    readCount: 1567,
                    tags: ["职场成长", "职业成长", "预防医学"],
                },
                {
                    id: 6,
                    title: "职业长期主义：三年成长路线图",
                    summary:
                        "建立长期职业目标、阶段能力清单和复盘机制，避免路径焦虑与频繁内耗。",
                    content:
                        "职业发展需要长期主义思维。很多人在工作中容易陷入短期思维的陷阱，频繁跳槽追求薪资增长，或者长期内耗而没有清晰的成长方向。其实建立一个三年成长路线图能帮助你避免这些误区，实现稳健而可持续的晋升。\n\n第一年的重点应该是专业基础的积累。在这一年，你需要专注打磨自己的核心技能，争取成为某个领域的专家。积极承接具有挑战性的项目、系统学习行业知识、通过出色的表现建立专业名声。在这一年结束时，你的目标是成为团队中某个领域的Top performer，让周围的人都认可你在这个专业领域的能力。\n\n第二年是能力的纵深拓展阶段。在巩固第一年积累的核心能力基础上，开始扩展到相邻的能力领域。比如如果你是数据分析师，可以开始学习商业思维和产品知识；如果你是产品经理，可以学习数据分析和技术基础。同时开始承担一些跨部门的项目，这样可以帮助你积累宝贵的管理经验。第二年结束时，你应该从单一技能的专家转变为具备多项能力的复合型人才。\n\n第三年是影响力提升和晋升的关键时期。此时你已经在公司积累了丰富的经验，建立了广泛的人脉，掌握了多项核心能力。现在是时候承担更大的责任和挑战了——带领小团队、主导战略性的项目或业务线。此时你的晋升条件已经成熟，抓住这个机会向上发展。\n\n为了确保这个三年计划的有效执行，你需要一些关键的保障措施。每个季度要进行一次复盘，回顾自己的进度是否按计划进行，根据实际情况调整目标。列出每年需要掌握的5-10项关键能力，然后系统地学习这些能力。同时积极投资人脉，每年建立3-5个跨行业的高质量关系，这些人脉在你的长期职业发展中会发挥重要作用。另外，通过发表文章、参加行业峰会、建立个人品牌来获得外部认可，这会大大加强你的职场竞争力。\n\n最重要的建议是：不要频繁跳槽去追求短期的薪资增长。在一家公司深耕3年的经历，远比1年换3家公司获得的薪资增长更有价值。因为深度经历能让你建立系统化的思维、积累战略性的经验、建立稳定的人脉。走正确的路比快跑更重要，这是职业长期主义最核心的哲学。",
                    category: "mental",
                    author: "孙规划",
                    authorTitle: "职业规划师",
                    publishTime: "2024-01-10",
                    readCount: 2134,
                    tags: ["职业发展", "职业保健", "生活质量"],
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
                mental: "职业发展",
                nutrition: "行业洞察",
                exercise: "求职技能",
                sleep: "面试实战",
                disease: "职场成长",
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
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
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
            background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
            transform: scale(1.05);
            border-color: #60a5fa;
            box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.25);

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
            color: #60a5fa;
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
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    border: none;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    &:active {
        transform: translateY(-4rpx) scale(0.99);
        box-shadow: 0 12rpx 28rpx rgba(59, 130, 246, 0.15);
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
