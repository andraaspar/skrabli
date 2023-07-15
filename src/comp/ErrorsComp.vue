<script setup lang="ts">
import { MoveError } from '@/model/MoveError'
import { useStore } from '@/store/useStore'
import IconComp from './IconComp.vue'
import errorIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?raw'

const store = useStore()

function errorToString(error: MoveError) {
	switch (error) {
		// case MoveError.InvalidWord:
		// 	return `Van egy érvénytelen szavad!`
		case MoveError.NoConnection:
			return `Kapcsolódnod kell a meglévő lapkákhoz!`
		case MoveError.NoDirection:
			return `Egy vonalba tedd a lapkáid, hézag nélkül!`
		case MoveError.NoStart:
			return `Érintened kell a Start mezőt!`
		case MoveError.NoTile:
			return `Tégy le egy lapkát!`
		case MoveError.OneTile:
			return `Egy érvényes szóhoz legalább két lapka kell!`
		default:
			return `[ppy6tx]: ${error}`
	}
}
</script>

<template>
	<div v-if="store.moveErrors.length > 0" class="errors">
		<div v-for="error of store.moveErrors">
			<IconComp :icon="errorIcon" color="#f70" /> {{ errorToString(error) }}
		</div>
	</div>
</template>

<style scoped>
.errors {
	display: flex;
	flex-flow: column;
	padding: var(--gap);
	gap: var(--gap);
	text-align: center;
	color: #fa6;
	font-weight: bold;
}
</style>
