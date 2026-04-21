<template>
    <view
        :class="['psychologist-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->
        <view class="header">
            <!-- <view class="header-left">
        <text class="back-arrow" @click="goBack">⬅️</text>
        <text class="header-title">心理医生</text>
      </view> -->
            <view class="header-right">
                <view class="appointment-record" @click="goToAppointmentRecord">
                    <text class="record-icon">📋</text>
                    <text class="record-text">预约记录</text>
                </view>
            </view>
        </view>
        <!-- <view class="header-subtitle">
      <text class="subtitle-text">专业心理咨询师团队</text>
    </view> -->

        <!-- 搜索栏 -->
        <view class="search-section">
            <view class="search-bar">
                <text class="search-icon">🔍</text>
                <input
                    class="search-input"
                    placeholder="搜索医生姓名或专业领域"
                    v-model="searchKeyword"
                    @input="handleSearch"
                />
            </view>
        </view>

        <!-- 医生列表 -->
        <view class="doctor-list" v-if="!loading">
            <view v-if="filteredDoctors.length === 0" class="empty-state">
                <text class="empty-emoji">🏥</text>
                <text class="empty-text">暂无匹配的医生</text>
                <text class="empty-desc">请尝试其他筛选条件</text>
            </view>

            <view v-else>
                <view
                    v-for="(doctor, index) in filteredDoctors"
                    :key="doctor.id"
                    class="doctor-card"
                    @click="viewDoctorDetail(doctor)"
                >
                    <view class="card-header">
                        <view class="avatar-container">
                            <image
                                :src="doctor.avatar"
                                class="doctor-avatar"
                                mode="aspectFill"
                            />
                            <view
                                class="online-status"
                                :class="{ online: doctor.isOnline }"
                            ></view>
                        </view>
                        <view class="doctor-info">
                            <view class="name-section">
                                <text class="doctor-name">{{
                                    doctor.name
                                }}</text>
                            </view>
                            <view class="basic-info">
                                <text class="info-item"
                                    >{{ doctor.age }}岁</text
                                >
                                <text class="info-item"
                                    >医龄{{ doctor.experience }}年</text
                                >
                                <text class="info-item">{{
                                    doctor.title
                                }}</text>
                            </view>
                        </view>
                        <view class="rating-section">
                            <view class="rating">
                                <text class="rating-score">{{
                                    doctor.rating
                                }}</text>
                                <text class="rating-star">⭐</text>
                            </view>
                            <text class="rating-count"
                                >{{ doctor.reviewCount }}评价</text
                            >
                        </view>
                    </view>

                    <view class="card-content">
                        <view class="specialties">
                            <text class="specialty-label">专业领域：</text>
                            <view class="specialty-tags">
                                <text
                                    v-for="specialty in doctor.specialties"
                                    :key="specialty"
                                    class="specialty-tag"
                                >
                                    {{ specialty }}
                                </text>
                            </view>
                        </view>

                        <view class="introduction">
                            <text class="intro-text">{{
                                doctor.introduction
                            }}</text>
                        </view>
                    </view>

                    <view class="card-footer">
                        <view class="action-buttons">
                            <button
                                class="appointment-btn"
                                @click.stop="makeAppointment(doctor)"
                            >
                                预约咨询
                            </button>
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

        <!-- 医生详情弹窗 -->
        <view class="detail-modal" v-if="showDetail" @click="closeDetail">
            <view class="detail-content" @click.stop>
                <view class="detail-header">
                    <view class="doctor-profile">
                        <image
                            :src="selectedDoctor.avatar"
                            class="detail-avatar"
                            mode="aspectFill"
                        />
                        <view class="profile-info">
                            <text class="detail-name">{{
                                selectedDoctor.name
                            }}</text>
                            <text class="detail-title">{{
                                selectedDoctor.title
                            }}</text>
                        </view>
                    </view>
                    <view class="close-btn" @click="closeDetail">×</view>
                </view>

                <view class="detail-body">
                    <view class="detail-section">
                        <text class="section-label">基本信息</text>
                        <view class="info-grid">
                            <view class="info-item">
                                <text class="info-label">性别</text>
                                <text class="info-value">{{
                                    selectedDoctor.gender
                                }}</text>
                            </view>
                            <view class="info-item">
                                <text class="info-label">年龄</text>
                                <text class="info-value"
                                    >{{ selectedDoctor.age }}岁</text
                                >
                            </view>
                            <view class="info-item">
                                <text class="info-label">医龄</text>
                                <text class="info-value"
                                    >{{ selectedDoctor.experience }}年</text
                                >
                            </view>
                            <view class="info-item">
                                <text class="info-label">职称</text>
                                <text class="info-value">{{
                                    selectedDoctor.title
                                }}</text>
                            </view>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">专业领域</text>
                        <view class="specialty-list">
                            <text
                                v-for="specialty in selectedDoctor.specialties"
                                :key="specialty"
                                class="specialty-item"
                            >
                                {{ specialty }}
                            </text>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">个人简介</text>
                        <text class="detail-intro">{{
                            selectedDoctor.introduction
                        }}</text>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">专业背景</text>
                        <text class="detail-background">{{
                            selectedDoctor.background
                        }}</text>
                    </view>
                </view>

                <view class="detail-footer">
                    <button
                        class="detail-appointment-btn"
                        @click="makeAppointment(selectedDoctor)"
                    >
                        预约咨询
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
            themeColor: "#4facfe",
            loading: true,
            searchKeyword: "",
            showDetail: false,
            selectedDoctor: {},
            doctors: [
                {
                    id: 1,
                    name: "李心怡",
                    gender: "女",
                    age: 35,
                    experience: 8,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1&backgroundColor=b6e3f4",
                    rating: 4.9,
                    reviewCount: 1286,
                    isOnline: true,
                    specialties: ["焦虑症", "抑郁症", "情感咨询"],
                    introduction:
                        "专注于认知行为疗法，帮助患者建立积极思维模式，擅长处理焦虑和抑郁问题。",
                    background:
                        "北京大学心理学博士，中科院心理所博士后，国家二级心理咨询师，从事心理咨询8年。",
                    consultationCount: 3240,
                    successRate: 94,
                    responseTime: 15,
                    price: 300,
                },
                {
                    id: 2,
                    name: "王明华",
                    gender: "男",
                    age: 42,
                    experience: 12,
                    title: "副主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2&backgroundColor=c7a2ff",
                    rating: 4.8,
                    reviewCount: 2156,
                    isOnline: false,
                    specialties: ["家庭治疗", "婚姻咨询", "亲子关系"],
                    introduction:
                        "系统家庭治疗专家，擅长解决家庭矛盾和亲子关系问题，帮助家庭重建和谐关系。",
                    background:
                        "清华大学心理学硕士，美国加州大学访问学者，家庭治疗师认证，从业12年。",
                    consultationCount: 4560,
                    successRate: 92,
                    responseTime: 20,
                    price: 350,
                },
                {
                    id: 3,
                    name: "张雅文",
                    gender: "女",
                    age: 38,
                    experience: 10,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor3&backgroundColor=ffd1dc",
                    rating: 4.9,
                    reviewCount: 1890,
                    isOnline: true,
                    specialties: ["儿童心理", "青少年问题", "学习障碍"],
                    introduction:
                        "儿童心理专家，温柔耐心，擅长处理儿童和青少年的心理问题，深受家长信任。",
                    background:
                        "北京师范大学心理学博士，儿童心理研究所研究员，沙盘游戏治疗师，从业10年。",
                    consultationCount: 2890,
                    successRate: 96,
                    responseTime: 12,
                    price: 280,
                },
                {
                    id: 4,
                    name: "陈志强",
                    gender: "男",
                    age: 45,
                    experience: 15,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor4&backgroundColor=ffb3ba",
                    rating: 4.7,
                    reviewCount: 3240,
                    isOnline: true,
                    specialties: ["创伤治疗", "PTSD", "危机干预"],
                    introduction:
                        "创伤治疗专家，具有丰富的危机干预经验，帮助患者走出心理创伤，重建生活信心。",
                    background:
                        "复旦大学心理学博士，国际创伤治疗师认证，危机干预专家，从业15年。",
                    consultationCount: 5670,
                    successRate: 89,
                    responseTime: 25,
                    price: 400,
                },
                {
                    id: 5,
                    name: "刘美玲",
                    gender: "女",
                    age: 33,
                    experience: 7,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor5&backgroundColor=bae1ff",
                    rating: 4.8,
                    reviewCount: 1560,
                    isOnline: true,
                    specialties: ["情感咨询", "恋爱问题", "人际关系"],
                    introduction:
                        "情感咨询专家，擅长处理恋爱关系和人际交往问题，帮助来访者建立健康的人际关系。",
                    background:
                        "华东师范大学心理学硕士，情感咨询师认证，人际关系治疗师，从业7年。",
                    consultationCount: 2130,
                    successRate: 93,
                    responseTime: 18,
                    price: 250,
                },
                {
                    id: 6,
                    name: "赵建国",
                    gender: "男",
                    age: 50,
                    experience: 18,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor6&backgroundColor=ffdfba",
                    rating: 4.9,
                    reviewCount: 4120,
                    isOnline: false,
                    specialties: ["老年心理", "认知障碍", "临终关怀"],
                    introduction:
                        "老年心理专家，关注老年人的心理健康，擅长处理认知障碍和临终关怀问题。",
                    background:
                        "中山大学心理学博士，老年心理研究所所长，认知行为治疗师，从业18年。",
                    consultationCount: 6780,
                    successRate: 91,
                    responseTime: 30,
                    price: 450,
                },
                {
                    id: 7,
                    name: "孙晓敏",
                    gender: "女",
                    age: 36,
                    experience: 9,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor7&backgroundColor=ffffba",
                    rating: 4.8,
                    reviewCount: 1980,
                    isOnline: true,
                    specialties: ["职场心理", "压力管理", "职业规划"],
                    introduction:
                        "职场心理专家，帮助职场人士处理工作压力，提升职业幸福感，实现职业发展。",
                    background:
                        "中国人民大学心理学硕士，职业规划师认证，压力管理专家，从业9年。",
                    consultationCount: 2670,
                    successRate: 95,
                    responseTime: 16,
                    price: 320,
                },
                {
                    id: 8,
                    name: "周文博",
                    gender: "男",
                    age: 41,
                    experience: 11,
                    title: "副主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor8&backgroundColor=baffc9",
                    rating: 4.7,
                    reviewCount: 2890,
                    isOnline: true,
                    specialties: ["成瘾治疗", "行为矫正", "心理康复"],
                    introduction:
                        "成瘾治疗专家，帮助患者戒除各种成瘾行为，重建健康的生活方式。",
                    background:
                        "武汉大学心理学博士，成瘾治疗师认证，行为治疗专家，从业11年。",
                    consultationCount: 3890,
                    successRate: 88,
                    responseTime: 22,
                    price: 380,
                },
                {
                    id: 9,
                    name: "吴丽华",
                    gender: "女",
                    age: 39,
                    experience: 10,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor9&backgroundColor=ffb3d1",
                    rating: 4.9,
                    reviewCount: 2340,
                    isOnline: false,
                    specialties: ["女性心理", "产后抑郁", "更年期问题"],
                    introduction:
                        "女性心理专家，关注女性各个阶段的心理健康，特别擅长处理产后抑郁和更年期问题。",
                    background:
                        "北京协和医学院心理学硕士，女性心理研究所研究员，产后心理治疗师，从业10年。",
                    consultationCount: 3120,
                    successRate: 94,
                    responseTime: 14,
                    price: 290,
                },
                {
                    id: 10,
                    name: "郑浩然",
                    gender: "男",
                    age: 37,
                    experience: 8,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor10&backgroundColor=d1b3ff",
                    rating: 4.8,
                    reviewCount: 1760,
                    isOnline: true,
                    specialties: ["社交恐惧", "强迫症", "恐惧症"],
                    introduction:
                        "焦虑障碍专家，擅长处理各种焦虑相关疾病，帮助患者克服恐惧，恢复正常生活。",
                    background:
                        "上海交通大学心理学博士，焦虑障碍治疗师认证，暴露疗法专家，从业8年。",
                    consultationCount: 2450,
                    successRate: 92,
                    responseTime: 19,
                    price: 330,
                },
                {
                    id: 11,
                    name: "林雅婷",
                    gender: "女",
                    age: 34,
                    experience: 6,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor11&backgroundColor=b3d1ff",
                    rating: 4.8,
                    reviewCount: 1420,
                    isOnline: true,
                    specialties: ["艺术治疗", "音乐治疗", "表达性治疗"],
                    introduction:
                        "艺术治疗师，通过艺术创作帮助患者表达内心情感，特别适合儿童和青少年。",
                    background:
                        "中央美术学院心理学硕士，艺术治疗师认证，音乐治疗师，从业6年。",
                    consultationCount: 1890,
                    successRate: 90,
                    responseTime: 21,
                    price: 260,
                },
                {
                    id: 12,
                    name: "黄志明",
                    gender: "男",
                    age: 48,
                    experience: 16,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor12&backgroundColor=ffd1b3",
                    rating: 4.9,
                    reviewCount: 3560,
                    isOnline: false,
                    specialties: ["精神分析", "人格障碍", "深度心理治疗"],
                    introduction:
                        "精神分析专家，擅长深度心理治疗，帮助患者探索潜意识，解决深层心理问题。",
                    background:
                        "北京大学心理学博士，精神分析学会会员，国际精神分析师认证，从业16年。",
                    consultationCount: 5230,
                    successRate: 87,
                    responseTime: 35,
                    price: 500,
                },
                {
                    id: 13,
                    name: "马小芳",
                    gender: "女",
                    age: 31,
                    experience: 5,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor13&backgroundColor=b3ffd1",
                    rating: 4.7,
                    reviewCount: 980,
                    isOnline: true,
                    specialties: ["正念治疗", "冥想指导", "压力缓解"],
                    introduction:
                        "正念治疗师，通过正念冥想帮助患者缓解压力，提升心理韧性，改善生活质量。",
                    background:
                        "南京大学心理学硕士，正念治疗师认证，冥想指导师，从业5年。",
                    consultationCount: 1560,
                    successRate: 93,
                    responseTime: 17,
                    price: 220,
                },
                {
                    id: 14,
                    name: "何建华",
                    gender: "男",
                    age: 44,
                    experience: 13,
                    title: "副主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor14&backgroundColor=d1ffb3",
                    rating: 4.8,
                    reviewCount: 2670,
                    isOnline: true,
                    specialties: ["团体治疗", "人际关系", "社交技能训练"],
                    introduction:
                        "团体治疗专家，通过团体活动帮助患者改善人际关系，提升社交技能。",
                    background:
                        "华中师范大学心理学博士，团体治疗师认证，社交技能训练师，从业13年。",
                    consultationCount: 3780,
                    successRate: 91,
                    responseTime: 24,
                    price: 360,
                },
                {
                    id: 15,
                    name: "徐美丽",
                    gender: "女",
                    age: 40,
                    experience: 11,
                    title: "副主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor15&backgroundColor=ffb3ff",
                    rating: 4.9,
                    reviewCount: 2980,
                    isOnline: false,
                    specialties: ["睡眠障碍", "失眠治疗", "生物反馈"],
                    introduction:
                        "睡眠专家，帮助患者解决各种睡眠问题，通过生物反馈技术改善睡眠质量。",
                    background:
                        "北京师范大学心理学博士，睡眠医学专家，生物反馈治疗师，从业11年。",
                    consultationCount: 4120,
                    successRate: 96,
                    responseTime: 13,
                    price: 340,
                },
                {
                    id: 16,
                    name: "宋志伟",
                    gender: "男",
                    age: 46,
                    experience: 14,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor16&backgroundColor=b3ffff",
                    rating: 4.8,
                    reviewCount: 3340,
                    isOnline: true,
                    specialties: ["性心理", "性功能障碍", "性取向咨询"],
                    introduction:
                        "性心理专家，专业处理各种性心理问题，帮助患者建立健康的性观念。",
                    background:
                        "复旦大学心理学博士，性心理治疗师认证，性医学专家，从业14年。",
                    consultationCount: 4560,
                    successRate: 89,
                    responseTime: 28,
                    price: 420,
                },
                {
                    id: 17,
                    name: "韩雪梅",
                    gender: "女",
                    age: 32,
                    experience: 6,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor17&backgroundColor=ffffb3",
                    rating: 4.7,
                    reviewCount: 1230,
                    isOnline: true,
                    specialties: ["饮食障碍", "身体意象", "自我接纳"],
                    introduction:
                        "饮食障碍专家，帮助患者建立健康的身体意象，改善饮食关系，提升自我接纳。",
                    background:
                        "浙江大学心理学硕士，饮食障碍治疗师认证，身体意象专家，从业6年。",
                    consultationCount: 1780,
                    successRate: 92,
                    responseTime: 20,
                    price: 270,
                },
                {
                    id: 18,
                    name: "冯国强",
                    gender: "男",
                    age: 52,
                    experience: 20,
                    title: "主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor18&backgroundColor=d1d1ff",
                    rating: 4.9,
                    reviewCount: 4560,
                    isOnline: false,
                    specialties: ["心理评估", "智力测试", "人格测试"],
                    introduction:
                        "心理评估专家，擅长各种心理测试和评估，为患者提供准确的心理诊断。",
                    background:
                        "中科院心理所博士，心理测量学专家，国际心理评估师认证，从业20年。",
                    consultationCount: 6780,
                    successRate: 95,
                    responseTime: 40,
                    price: 480,
                },
                {
                    id: 19,
                    name: "田晓红",
                    gender: "女",
                    age: 38,
                    experience: 9,
                    title: "主治医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor19&backgroundColor=ffd1d1",
                    rating: 4.8,
                    reviewCount: 2100,
                    isOnline: true,
                    specialties: ["创伤后成长", "心理韧性", "积极心理学"],
                    introduction:
                        "积极心理学专家，帮助患者从创伤中成长，提升心理韧性，发现生活的意义。",
                    background:
                        "清华大学心理学博士，积极心理学研究员，创伤后成长专家，从业9年。",
                    consultationCount: 2890,
                    successRate: 94,
                    responseTime: 16,
                    price: 310,
                },
                {
                    id: 20,
                    name: "谢文斌",
                    gender: "男",
                    age: 43,
                    experience: 12,
                    title: "副主任医师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor20&backgroundColor=d1ffd1",
                    rating: 4.7,
                    reviewCount: 2450,
                    isOnline: true,
                    specialties: ["网络成瘾", "游戏障碍", "数字健康"],
                    introduction:
                        "数字健康专家，帮助患者摆脱网络和游戏成瘾，建立健康的数字生活方式。",
                    background:
                        "北京理工大学心理学博士，数字健康专家，网络成瘾治疗师，从业12年。",
                    consultationCount: 3450,
                    successRate: 90,
                    responseTime: 23,
                    price: 370,
                },
            ],
        };
    },
    computed: {
        filteredDoctors() {
            let filtered = this.doctors;

            // 按搜索关键词筛选
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                filtered = filtered.filter(
                    (doctor) =>
                        doctor.name.toLowerCase().includes(keyword) ||
                        doctor.specialties.some((specialty) =>
                            specialty.toLowerCase().includes(keyword),
                        ) ||
                        doctor.introduction.toLowerCase().includes(keyword),
                );
            }

            return filtered;
        },
    },
    methods: {
        async loadDoctors() {
            try {
                this.loading = true;
                // 模拟API调用延迟
                await new Promise((resolve) => setTimeout(resolve, 1000));
                this.loading = false;
            } catch (error) {
                console.error("加载医生列表失败:", error);
                this.loading = false;
            }
        },

        handleSearch() {
            // 搜索逻辑已在computed中处理
        },

        viewDoctorDetail(doctor) {
            this.selectedDoctor = doctor;
            this.showDetail = true;
        },

        closeDetail() {
            this.showDetail = false;
            this.selectedDoctor = {};
        },

        makeAppointment(doctor) {
            // 跳转到预约页面，传递医生信息
            uni.navigateTo({
                url: `/pages/psychologist/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&doctorTitle=${encodeURIComponent(doctor.title)}&doctorAvatar=${encodeURIComponent(doctor.avatar)}&doctorSpecialties=${encodeURIComponent(doctor.specialties.join(","))}`,
            });
        },

        goBack() {
            uni.navigateBack();
        },

        goToAppointmentRecord() {
            uni.navigateTo({
                url: "/pages/psychologist/record",
            });
        },
    },

    onShow() {
        this.loadDoctors();
    },
};
</script>

<style lang="scss">
.psychologist-container {
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
    background: linear-gradient(135deg, #e07856 0%, #d4744e 50%, #c85a3a 100%);
    box-shadow: 0 8rpx 24rpx rgba(224, 120, 86, 0.25);
    border: none;

    .header-left {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
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

    .header-right {
        .appointment-record {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            padding: 12rpx 20rpx;
            border-radius: 20rpx;
            transition: all 0.3s;
            border: 1rpx solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10rpx);

            &:active {
                transform: scale(0.95);
                background: rgba(255, 255, 255, 0.3);
            }

            .record-icon {
                font-size: 24rpx;
                margin-right: 8rpx;
                color: rgba(255, 255, 255, 0.9);
            }

            .record-text {
                font-size: 24rpx;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 600;
            }
        }
    }

    .header-subtitle {
        padding: 0 30rpx 20rpx;

        .subtitle-text {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
        }
    }
}

.search-section {
    padding: 20rpx 30rpx;
    background: transparent;

    .search-bar {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 24rpx;
        padding: 20rpx 30rpx;
        border: none;
        box-shadow: 0 4rpx 16rpx rgba(224, 120, 86, 0.1);
        backdrop-filter: blur(10rpx);

        .search-icon {
            font-size: 32rpx;
            margin-right: 15rpx;
            color: #d4744e;
        }

        .search-input {
            flex: 1;
            font-size: 28rpx;
            color: #1e293b;
            border: none;
            outline: none;
            background: transparent;
        }
    }
}

.doctor-list {
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
    }

    .empty-text {
        font-size: 32rpx;
        color: white;
        font-weight: bold;
        margin-bottom: 15rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.7);
    }
}

.doctor-card {
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
        align-items: center;
        margin-bottom: 20rpx;

        .avatar-container {
            position: relative;
            margin-right: 20rpx;

            .doctor-avatar {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                border: 3rpx solid rgba(255, 255, 255, 0.8);
            }

            .online-status {
                position: absolute;
                bottom: 5rpx;
                right: 5rpx;
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                background: #ccc;
                border: 2rpx solid white;

                &.online {
                    background: #52c41a;
                }
            }
        }

        .doctor-info {
            flex: 1;

            .name-section {
                display: flex;
                align-items: center;
                margin-bottom: 8rpx;

                .doctor-name {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #1e293b;
                    margin-right: 10rpx;
                }

                .doctor-gender {
                    font-size: 24rpx;
                    opacity: 0.8;
                }
            }

            .basic-info {
                display: flex;
                gap: 15rpx;

                .info-item {
                    font-size: 22rpx;
                    color: #64748b;
                    background: #f1f5f9;
                    padding: 4rpx 12rpx;
                    border-radius: 12rpx;
                    border: 1rpx solid #e2e8f0;
                }
            }
        }

        .rating-section {
            text-align: right;

            .rating {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-bottom: 5rpx;

                .rating-score {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #333;
                    margin-right: 5rpx;
                }

                .rating-star {
                    font-size: 20rpx;
                }
            }

            .rating-count {
                font-size: 20rpx;
                color: #999;
            }
        }
    }

    .card-content {
        margin-bottom: 20rpx;

        .specialties {
            margin-bottom: 15rpx;

            .specialty-label {
                font-size: 24rpx;
                color: #666;
                margin-right: 10rpx;
            }

            .specialty-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8rpx;
                margin-top: 8rpx;

                .specialty-tag {
                    font-size: 20rpx;
                    color: var(--theme-color);
                    background: rgba(79, 172, 254, 0.1);
                    padding: 4rpx 12rpx;
                    border-radius: 12rpx;
                }
            }
        }

        .introduction {
            margin-bottom: 15rpx;

            .intro-text {
                font-size: 26rpx;
                color: #666;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }

    .card-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .action-buttons {
            .appointment-btn {
                background: var(--theme-color);
                color: white;
                border: none;
                border-radius: 25rpx;
                padding: 12rpx 30rpx;
                font-size: 26rpx;
                font-weight: bold;
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
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        border-top: 4rpx solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20rpx;
    }

    .loading-text {
        font-size: 28rpx;
        color: white;
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

.detail-modal {
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

.detail-content {
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

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 40rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .doctor-profile {
        display: flex;
        align-items: center;

        .detail-avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }

        .profile-info {
            .detail-name {
                display: block;
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                margin-bottom: 8rpx;
            }

            .detail-title {
                font-size: 24rpx;
                color: #666;
            }
        }
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

.detail-body {
    padding: 40rpx;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 0;
}

.detail-section {
    margin-bottom: 30rpx;

    .section-label {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 15rpx;
        font-weight: bold;
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20rpx;

        .info-item {
            .info-label {
                display: block;
                font-size: 22rpx;
                color: #999;
                margin-bottom: 8rpx;
            }

            .info-value {
                font-size: 26rpx;
                color: #333;
                font-weight: bold;
            }
        }
    }

    .specialty-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;

        .specialty-item {
            font-size: 22rpx;
            color: var(--theme-color);
            background: rgba(79, 172, 254, 0.1);
            padding: 8rpx 16rpx;
            border-radius: 15rpx;
        }
    }

    .detail-intro,
    .detail-background {
        font-size: 26rpx;
        color: #333;
        line-height: 1.6;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        display: block;
    }
}

.detail-footer {
    padding: 20rpx 40rpx 40rpx;

    .detail-appointment-btn {
        width: 100%;
        height: 80rpx;
        background: var(--theme-color);
        color: white;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
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
