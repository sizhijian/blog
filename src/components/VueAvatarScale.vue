<template>
	<input
    v-model="scale"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :style="{ width:width +'px'}"
  />
</template>
<script >
	export default{
		props:{
			width:{
				type:Number,
				default:200
			},
			min:{
				type:Number,
				default:1
			},
			max:{
				type:Number,
				default:2
			},
			step:{
				type:Number,
				default:0.01
			},

		},
		methods:{
			setScale:function(scale){
				this.scale = scale
			}
		},
		data:function(){
			return {
				scale:1
			}
		},
		watch:{
			scale:function(){
				this.$emit('vue-avatar-editor-scale:change-scale', this.scale)
			}
		}
	}
</script>
<style>
input[type=range] {
	-webkit-appearance: none;
	width: 300px;
	border-radius: 10px;
	margin-top: 10px;
	/*这个属性设置使填充进度条时的图形为圆角*/
}

input[type=range]::-webkit-slider-thumb {
	-webkit-appearance: none;
}
input[type=range]::-webkit-slider-runnable-track {
    height: 15px;
    border-radius: 10px; /*将轨道设为圆角的*/
    box-shadow: 0 1px 1px #def3f8, inset 0 .125em .125em #0d1112; /*轨道内置阴影效果*/
}
input[type=range]:focus {
    outline: none;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 25px;
    width: 25px;
    margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
    background: #ffffff;
    border-radius: 50%; /*外观设置为圆形*/
    border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
    box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/
}
</style>
