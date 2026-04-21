<template>
    <view :class="'animation-out-box ' + (visible ? 'show' : '')">
        <view
            :class="'animation-box ' + (visible ? 'animation-show' : '') + ' ' + type"
            :style="cusPosition === 'top' ? 'top:' + endTop + 'rpx' : cusPosition === 'bottom' ? 'bottom:' + endBottom + 'rpx' : ''"
        >
            <slot></slot>
        </view>
        <view
            @tap="masktap"
            @touchmove.stop.prevent="preventTouchMove"
            :class="'animation-mask ' + (visible ? 'animation-show' : '')"
            :data-ptpid="maskPtpid"
            v-if="maskshow"
        ></view>
    </view>
</template>

<script>

export default {
    data() {
        return {};
    },
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'opacity'
        },
        maskPtpid: {
            type: String,
            default: ''
        },
        cusPosition: {
            type: String,
            default: 'none'
        },
        endTop: {
            type: Number,
            default: 0
        },
        endBottom: {
            type: Number,
            default: 0
        },
        maskshow: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        preventTouchMove: function () {},
        masktap: function () {
            this.$emit('masktap');
        }
    },
    mounted: function () {}
};
</script>
<style lang="scss" scoped>
	@import './index.scss';
</style>
