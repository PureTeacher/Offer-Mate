<template>
    <view>
        <ani-box :maskPtpid="'ac03-1bca-1aff-c6f3-' + type" v-if="show">
            <view disableScroll class="dialog-box">
                <block>
                   <!-- <image lazyLoad class="dialog-box-top" mode="widthFix" src="@logo_icon.png"></image> -->
                    <view class="dialog-info-box">
                        <view class="dialog-title-new">{{ type === 1 ? '扫码' : type === 2 ? '答题' : type === 3 ? '步数兑换' : '' }}成功</view>
                        <view class="dialog-sibtitle-new">恭喜获得积分奖励</view>
                        <view class="money-box">
                        <!--    <image class="money-icon" src="@/static/images/guide_coin.png"></image> -->
                            <text class="money-text">+ {{peanNum}}  积分</text>
                        </view>
                        <button
                            @tap="stepToSuccess"
                            class="sign-btn-new animate-btn ptp_exposure"
                            :data-ptpid="'3ygs-1c0a-am8f-c0fb-' + type"
                            :id="'pid=3ygs-1c0a-am8f-c0fb-' + type"
                        >
                            {{word}}
                        </button>
                    </view>
                </block>
               
                <view @tap="closeDialog" class="iconfont iconclose_round close-button" :data-ptpid="'30d7-1c2a-an8f-cdfb-' + type"></view>
            </view>
        </ani-box>
    </view>
</template>

<script>
import aniBox from './aniBox/index';
export default {
    components: {
        aniBox
    },
    data() {
        return {
			
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        peanNum: {
            type: Number,
            default: 0
        },
        type: {
            type: Number,
            default: 1
        },
        word: {
            type: String,
            default: ''
        },
        money: {
            type: Number,
            default: 0.5
        }
    },
    methods: {
        stepToSuccess: function () {
            uni.switchTab({
            	url:'/pages/views/tabBar/home'
            })
        },
        closeDialog: function () {
            this.$emit('close');
           
        },
      
    }
};
</script>
<style>
@import './index.css';
</style>
