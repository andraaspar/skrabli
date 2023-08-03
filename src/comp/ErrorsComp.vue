<script setup lang="ts">
import { MoveError } from '@/model/MoveError'
import { useGameStore } from '@/store/useGameStore'
import WarningComp from './WarningComp.vue'

const gameStore = useGameStore()

function errorToString(error: MoveError) {
	switch (error) {
		// case MoveError.InvalidWord:
		// 	return `Van egy szabálytalan szavad!`
		case MoveError.NoConnection:
			return `Kapcsolódnod kell a meglévő lapkákhoz!`
		case MoveError.NoDirection:
			return `Egy vonalba tedd a lapkáid, hézag nélkül!`
		case MoveError.NoStart:
			return `Érintened kell a Start mezőt!`
		case MoveError.NoTile:
			return `Tégy le egy lapkát!`
		case MoveError.OneTile:
			return `Egy szabályos szóhoz legalább két lapka kell!`
		default:
			return `[ppy6tx]: ${error}`
	}
}
</script>

<template>
	<div v-if="gameStore.moveErrors.length > 0" class="errors">
		<WarningComp
			v-for="(error, index) of gameStore.moveErrors"
			:key="index"
			:warning="errorToString(error)"
		/>
	</div>
</template>

<style scoped>
.errors {
	display: flex;
	flex-flow: column;
	padding: var(--gap);
	gap: var(--gap);
}
</style>
