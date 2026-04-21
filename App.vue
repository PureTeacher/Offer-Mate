<script>
export default {
    computed: {
        containerClasses() {
            return `theme-${this.$themeManager.getTheme()} font-${this.$themeManager.getFontSize()}`;
        },
    },
    onLaunch: function () {
        console.log("App Launch");
        // 初始化主题
        this.$themeManager.init();
    },
    onShow: function () {
        console.log("App Show");
    },
    onHide: function () {
        console.log("App Hide");
    },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";

uni-page-body,
html,
body {
    height: 100%;
}

/* ============= 全局主题样式 ============= */

/* 浅色主题 */
.theme-light {
    background-color: #f5f5f5 !important;
    color: #333333 !important;
}

.theme-light {
    .settings-container,
    .page-container,
    .login,
    .register,
    .health-container,
    .test-container,
    .test-page,
    .history-container,
    .psychologist-container,
    .appointment-container,
    .record-container,
    .message,
    .user-center {
        background-color: #f5f5f5 !important;
        color: #333333 !important;
    }

    .header {
        background-color: #667eea;
        color: #ffffff;
    }

    .settings-section,
    .content-section,
    .info-section,
    .list-section {
        background-color: #ffffff;

        .section-title {
            color: #333333;
            border-bottom-color: #f0f0f0;
        }
    }

    .settings-item,
    .menu-item,
    .list-item,
    .info-item {
        color: #333333;
        border-bottom-color: #f0f0f0;

        .item-label,
        .menu-title {
            color: #333333;
        }

        .item-desc,
        .menu-desc {
            color: #999999;
        }
    }

    switch {
        ::v-deep .uni-switch-input {
            background-color: #cccccc;

            &.uni-switch-input-checked {
                background-color: #667eea;
            }
        }
    }
}

/* 深色主题 */
page.theme-dark,
.theme-dark {
    background-color: #1a1a1a;
    color: #ffffff;

    .settings-container,
    .page-container,
    .health-container,
    .psychologist-container,
    .message-container,
    .user-center {
        background-color: #1a1a1a;
        color: #ffffff;
    }

    .header {
        background-color: #1a1a1a;
        color: #ffffff;
        border-bottom: 1upx solid #333333;
    }

    .settings-section,
    .content-section,
    .info-section,
    .list-section {
        background-color: #2d2d2d;

        .section-title {
            color: #ffffff;
            border-bottom-color: #444444;
        }
    }

    .settings-item,
    .menu-item,
    .list-item,
    .info-item {
        color: #ffffff;
        border-bottom-color: #444444;

        .item-label,
        .menu-title {
            color: #ffffff;
        }

        .item-desc,
        .menu-desc {
            color: #aaaaaa;
        }
    }

    .menu-arrow {
        color: #666666;
    }

    .card {
        &::after {
            background: rgba(0, 0, 0, 0.3);
        }
    }

    .popup-container {
        background-color: #2d2d2d;

        .popup-header {
            border-bottom-color: #444444;

            .popup-title {
                color: #ffffff;
            }

            .close-btn {
                color: #aaaaaa;
            }
        }
    }

    .theme-option,
    .font-option {
        background-color: #333333;
        border-color: #444444;

        .theme-name,
        .font-name {
            color: #cccccc;
        }

        &.selected {
            background-color: #1a2d4d;
        }

        .theme-check,
        .font-check {
            background-color: #444444;
        }
    }

    .password-btn {
        background-color: #333333;
        color: #667eea;
        border-color: #444444;
    }

    .user-info-card {
        background-color: #2d2d2d;
        border-bottom-color: #444444;

        .user-details {
            .user-name {
                color: #ffffff;
            }

            .user-id,
            .user-phone {
                color: #aaaaaa;
            }
        }
    }
}

/* 自动主题 */
page.theme-auto,
.theme-auto {
    /* 默认使用浅色 */
    @extend .theme-light;
}

/* 字体大小 */
.font-small {
    font-size: 20upx !important;

    .section-title {
        font-size: 22upx !important;
    }

    .item-label,
    .menu-title,
    .card-title {
        font-size: 24upx !important;
    }

    .item-desc,
    .menu-desc,
    .card-desc {
        font-size: 18upx !important;
    }
}

.font-medium {
    /* 默认字体大小 */
    font-size: 28upx !important;

    .section-title {
        font-size: 28upx !important;
    }

    .item-label,
    .menu-title,
    .card-title {
        font-size: 32upx !important;
    }

    .item-desc,
    .menu-desc,
    .card-desc {
        font-size: 24upx !important;
    }
}

.font-large {
    font-size: 36upx !important;

    .section-title {
        font-size: 34upx !important;
    }

    .item-label,
    .menu-title,
    .card-title {
        font-size: 38upx !important;
    }

    .item-desc,
    .menu-desc,
    .card-desc {
        font-size: 30upx !important;
    }
}

/* TabBar字体大小调整 */
.uni-tabbar {
    --tabbar-item-title-font-size: 80upx;
}

::v-deep .uni-tabbar__item-title {
    font-size: 80upx !important;
}

::v-deep .uni-tabbar__item {
    font-size: 80upx !important;
}

::v-deep .uni-tabbar__label {
    font-size: 80upx !important;
}
</style>
