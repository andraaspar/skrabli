<script setup lang="ts">
import warningIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import IconComp from './IconComp.vue'
const props = defineProps<{ warning: string | undefined }>()
</script>

<template>
	<div class="warning" v-if="props.warning">
		<div class="content">
			<IconComp :icon="warningIcon" color="#f70" />
			<div class="message">
				{{ props.warning }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.warning {
	display: flex;
}
.content {
	display: flex;
	gap: 0.5em;
	white-space: pre-wrap;
	margin: auto;
}
.message {
	display: flex;
	flex-flow: column;
	gap: 0.25em;
	text-align: left;
}
</style>
