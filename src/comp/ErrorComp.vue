<script setup lang="ts">
import errorIcon from 'bootstrap-icons/icons/exclamation-octagon-fill.svg?raw'
import IconComp from './IconComp.vue'
const props = defineProps<{ error: unknown }>()
</script>

<template>
	<div class="error" v-if="props.error">
		<div class="content">
			<IconComp :icon="errorIcon" color="#f03" />
			<div class="message">
				{{ 'Hiba történt!' }}
				<div class="detail">
					{{ props.error + '' }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.error {
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
.detail {
	font-size: 0.6em;
	color: rgba(255, 255, 255, 0.6);
}
</style>
