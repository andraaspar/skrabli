<script setup lang="ts"></script>

<template>
	<div class="dialog-body"><slot></slot></div>
</template>

<style scoped>
.dialog-body {
	flex: 1 1 auto;
	display: flex;
	flex-flow: column;
	overflow: auto;
	gap: 4vmin;
}
</style>
