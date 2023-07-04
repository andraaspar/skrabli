<script setup lang="ts">
import type { ITile } from '../model/ITile'

defineProps<{ tile: ITile; neverOwned?: boolean }>()
</script>
<template>
	<div
		:class="{
			tile: true,
			'is-owned': !neverOwned && tile.isOwned,
			'is-joker': tile.isJoker,
			'is-last': tile.isLast,
		}"
	>
		<div class="tile-letter">{{ tile.letter }}</div>
		<div class="tile-score">{{ tile.score }}</div>
	</div>
</template>
<style scoped>
.tile {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	border: 1px solid burlywood;
	border-bottom-width: 0.2em;
	padding: 0 0.2em 0.2em;
	border-radius: 0.4em;
	background-color: antiquewhite;
	color: black;
	aspect-ratio: 1 / 1;
}
.tile.is-owned {
	background-color: white;
}
.tile.is-last {
	background-color: burlywood;
	border-color: peru;
}
.tile.is-joker .tile-letter {
	font-style: italic;
}

.tile-letter {
	font-family: serif;
	font-size: 1.7em;
}

.tile-score {
	position: absolute;
	bottom: 5%;
	right: 5%;
	font-size: 0.5em;
}
</style>
