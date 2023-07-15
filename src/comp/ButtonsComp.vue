<script setup lang="ts"></script>

<template>
	<div class="buttons"><slot></slot></div>
</template>

<style>
.buttons {
	display: flex;
	flex-flow: row wrap;
	gap: var(--gap);
	padding: var(--gap);
}
.buttons > * {
	flex: 1 0 auto;
}
</style>
