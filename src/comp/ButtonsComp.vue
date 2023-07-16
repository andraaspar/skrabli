<script setup lang="ts"></script>

<template>
	<div class="buttons">
		<slot></slot>
	</div>
</template>

<style scoped>
.buttons {
	display: flex;
	flex-flow: row wrap;
	gap: var(--gap);
	padding: var(--gap);
	justify-content: center;
}
</style>
