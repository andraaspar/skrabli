<script setup lang="ts">
import IconComp from './IconComp.vue'
import xSvg from 'bootstrap-icons/icons/x-lg.svg?raw'

defineEmits(['close'])
</script>

<template>
	<div class="dialog-header">
		<div class="title"><slot></slot></div>
		<button class="close" title="Zárd be" @click="$emit('close')">
			<IconComp :icon="xSvg" />
		</button>
	</div>
</template>

<style scoped>
.dialog-header {
	padding: 0 0 4vmin;
	display: flex;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	margin: -4vmin -4vmin 0;
	align-items: center;
}
.title {
	flex: 0 1 auto;
	padding: 2vmin;
	color: white;
	width: 100%;
	text-align: left;
}

.close {
	flex: 0 0 auto;
}
</style>
