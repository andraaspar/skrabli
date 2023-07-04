<script setup lang="ts">
import { FieldKind } from '@/model/FieldKind'
import { useStore } from '../store/useStore'
import TileComp from './TileComp.vue'
import { Mode } from '@/model/Mode'

const emit = defineEmits(['setJokerLetter'])

const store = useStore()

function fieldKindToString(fieldKind: FieldKind): string {
	switch (fieldKind) {
		case FieldKind.Normal:
			return ''
		case FieldKind.DoubleLetter:
			return '2×\nBetű'
		case FieldKind.DoubleWord:
			return '2×\nSzó'
		case FieldKind.Start:
			return 'Start'
		case FieldKind.TripleLetter:
			return '3×\nBetű'
		case FieldKind.TripleWord:
			return '3×\nSzó'
		default:
			throw new Error(`[ppp079]: ${fieldKind}`)
	}
}

function onFieldClicked(fieldIndex: number) {
	if (store.mode !== Mode.PlaceTile) return
	const fieldToSelect = store.board[fieldIndex]
	if (
		store.field != null &&
		store.field.tile &&
		store.field.tile.isOwned &&
		(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
	) {
		store.swapTiles(store.fieldIndex!, fieldIndex)
	} else if (
		store.handTile &&
		(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
	) {
		store.swapHandAndBoard(fieldIndex, store.handIndex!)
		if (store.board[fieldIndex].tile?.isJoker) {
			emit('setJokerLetter')
		}
	} else if (store.fieldIndex === fieldIndex) {
		store.fieldIndex = null
	} else {
		store.fieldIndex = fieldIndex
	}
}
</script>
<template>
	<div class="board">
		<div
			v-for="(field, fieldIndex) in store.board"
			:class="{
				'board-field': true,
				'is-selected': fieldIndex === store.fieldIndex,
				'is-normal': field.kind === FieldKind.Normal,
				'is-double-letter': field.kind === FieldKind.DoubleLetter,
				'is-double-word': field.kind === FieldKind.DoubleWord,
				'is-start': field.kind === FieldKind.Start,
				'is-triple-letter': field.kind === FieldKind.TripleLetter,
				'is-triple-word': field.kind === FieldKind.TripleWord,
			}"
			@click="onFieldClicked(fieldIndex)"
		>
			<TileComp v-if="field.tile" :tile="field.tile" />
			<template v-else>{{ fieldKindToString(field.kind) }}</template>
		</div>
	</div>
</template>
<style>
.board {
	width: 25rem;
	display: grid;
	grid-template-columns: repeat(15, calc((100vmin - 14px) / 15));
	grid-template-rows: repeat(15, calc((100vmin - 14px) / 15));
	grid-gap: 1px;
}

.board-field {
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: #444;
	color: white;
	text-align: center;
	font-size: 0.5rem;
	border: 1px solid transparent;
	cursor: pointer;
	white-space: pre-wrap;
	aspect-ratio: 1 / 1;
	line-height: 1.2;
}

.board-field.is-start,
.board-field.is-double-word {
	background-color: indianred;
}

.board-field.is-triple-word {
	background-color: crimson;
}

.board-field.is-double-letter {
	background-color: cornflowerblue;
}

.board-field.is-triple-letter {
	background-color: royalblue;
}

.board-field.is-selected {
	border-color: hotpink;
}
</style>
