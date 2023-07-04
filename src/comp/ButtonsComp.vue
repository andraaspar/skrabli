<script setup lang="ts"></script>

<template>
	<div class="buttons"><slot></slot></div>
</template>

<style>
.buttons {
	display: flex;
	flex-flow: row wrap;
	gap: 2vmin;
	padding: 2vmin;
}
.buttons > * {
	flex: 1 0 auto;
}
</style>
