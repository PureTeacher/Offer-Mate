import App from "./App";
import Vue from "vue";
import uView from "uview-ui";
import moment from "moment";
import api from "@/common/api";
import config from "@/common/config/env.js";
import themeManager from "@/common/store/theme";

// 注册全局组件
import msg from "@/components/msg/msg.vue";
Vue.component("msg", msg);
Vue.config.productionTip = false;
Vue.use(uView);
App.mpType = "app";
moment.locale("zh-cn");
Vue.prototype.$moment = moment;
Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$themeManager = themeManager;

// 创建全局 mixin，使所有组件都能响应主题变化
Vue.mixin({
    data() {
        return {
            _themeForceUpdate: 0, // 强制更新标志
        };
    },
    computed: {
        currentTheme() {
            // 通过访问 _themeForceUpdate 确保这个方法被依赖
            this._themeForceUpdate;
            return this.$themeManager.state.currentTheme;
        },
        currentFontSize() {
            // 通过访问 _themeForceUpdate 确保这个方法被依赖
            this._themeForceUpdate;
            return this.$themeManager.state.currentFontSize;
        },
        containerClasses() {
            return `theme-${this.currentTheme} font-${this.currentFontSize}`;
        },
    },
    created() {
        // 在组件创建时订阅主题变化
        this.unsubscribeTheme = this.$themeManager.subscribe(() => {
            // 更新强制更新标志，触发计算属性重新计算
            this._themeForceUpdate++;
        });
    },
    beforeDestroy() {
        // 取消订阅
        if (this.unsubscribeTheme) {
            this.unsubscribeTheme();
        }
    },
});

const app = new Vue({
    ...App,
});

// uview-request
require("@/common/http/request.js")(app);

app.$mount();
