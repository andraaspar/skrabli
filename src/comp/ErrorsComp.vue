<script setup lang="ts">
import { MoveError } from '@/model/MoveError'
import { useStore } from '@/store/useStore'

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
			⚠️&nbsp;{{ errorToString(error) }}
		</div>
	</div>
</template>

<style scoped>
.errors {
	display: flex;
	flex-flow: column;
	padding: 2vmin;
	gap: 2vmin;
	text-align: center;
	color: lightpink;
	font-weight: bold;
}
</style>
