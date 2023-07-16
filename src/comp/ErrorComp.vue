<script setup lang="ts">
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'
import IconComp from './IconComp.vue'
const props = defineProps<{ error: unknown }>()
</script>

<template>
	<div class="error" v-if="props.error">
		<IconComp :icon="errorIcon" color="#f70" />
		{{ error + '' }}
	</div>
</template>

<style scoped>
.error {
	text-align: center;
}
</style>
