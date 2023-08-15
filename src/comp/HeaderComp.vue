<script setup lang="ts">
import listSvg from 'bootstrap-icons/icons/list.svg?raw'
import logoSvg from '../asset/logo.svg?raw'
import { RouterLink } from 'vue-router'
import IconComp from './IconComp.vue'
</script>

<template>
	<div class="header-row">
		<IconComp :icon="logoSvg" class="logo" />
		<div class="title"><slot></slot></div>
		<RouterLink class="button" :to="{ name: 'menu' }" replace>
			<IconComp :icon="listSvg"></IconComp>
		</RouterLink>
	</div>
</template>

<style scoped>
.header-row {
	display: flex;
	flex-flow: row;
	padding: var(--gap);
	gap: var(--gap);
	height: fit-content;
	align-items: center;
	justify-content: space-between;
}

.logo {
	width: 6vmin;
	height: 6vmin;
	transform: rotate(15deg);
}
.title {
	flex: 1 0 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	text-align: center;
}

@media (aspect-ratio >= 16/10) {
	.header-row {
		flex-flow: column;
		height: auto;
	}

	.title {
		writing-mode: vertical-lr;
		writing-mode: sideways-lr;
		width: auto;
	}
}
</style>
