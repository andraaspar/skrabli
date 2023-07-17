<script setup lang="ts">
import { useStore } from '@/store/useStore'
import TileComp from './TileComp.vue'

const store = useStore()
</script>
<template>
	<div v-if="store.playerIndex != null" class="hand">
		<div
			v-for="(tile, tileIndex) of store.hands[store.playerIndex]"
			:key="tileIndex"
			:class="{
				'hand-slot': true,
				'is-selected': tileIndex === store.handIndex,
				'is-to-be-replaced': store.handIndicesToReplace[tileIndex],
			}"
			@click="store.selectHand(tileIndex)"
		>
			<TileComp v-if="tile" :tile="tile" :neverOwned="true" />
		</div>
	</div>
</template>
<style scoped>
.hand {
	display: flex;
	flex-wrap: wrap;
	padding: 0 1px 1px 0;
}

.hand-slot {
	position: relative;
	width: calc((100vmin - 1px) / 7 - 1px);
	margin: 1px 0 0 1px;
	background: #444;
	padding: 1vmin;
	border: 1px solid transparent;
	aspect-ratio: 1 / 1;
}
.hand-slot::after {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: inset 0 0 0 0 #9bff6980;
	transition: box-shadow 0.5s ease-out;
}

.hand-slot.is-selected {
	border-color: #9bff69;
}
.hand-slot.is-selected::after {
	box-shadow: inset 0 0 0 0.75vmin #9bff6980;
}

.hand-slot.is-to-be-replaced {
	opacity: 0.5;
}
</style>
