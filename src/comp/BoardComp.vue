<script setup lang="ts">
import { FieldKind } from '@/model/FieldKind'
import type { IBoardInfo } from '@/model/IBoardInfo'
import { Mode } from '@/model/Mode'
import { computed } from 'vue'
import { useGameStore } from '../store/useGameStore'
import TileComp from './TileComp.vue'

const props = defineProps<{ boardInfo?: IBoardInfo; isSmaller?: boolean }>()

const emit = defineEmits(['setJokerLetter'])

const gameStore = useGameStore()

const board = computed(() => props.boardInfo?.board ?? gameStore.state.board)
const boardSize = computed(
	() => props.boardInfo?.boardSize ?? gameStore.state.boardSize,
)
const aspectRatio = computed(
	() => boardSize.value.width / boardSize.value.height,
)

function fieldKindToString(fieldKind: FieldKind): string {
	switch (fieldKind) {
		case FieldKind.Normal:
			return ''
		case FieldKind.DoubleLetter:
			return '2×\nBetű'
		case FieldKind.DoubleWord:
			return '2×\nSzó'
		case FieldKind.Start:
		case FieldKind.StartNoBonus:
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
	if (gameStore.state.mode !== Mode.PlaceTile) return
	const fieldToSelect = gameStore.state.board[fieldIndex]
	if (
		gameStore.field != null &&
		gameStore.field.tile &&
		gameStore.field.tile.isOwned &&
		(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
	) {
		gameStore.swapTiles(gameStore.state.fieldIndex!, fieldIndex)
	} else if (
		gameStore.handTile &&
		(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
	) {
		gameStore.swapHandAndBoard(fieldIndex, gameStore.state.handIndex!)
		if (gameStore.state.board[fieldIndex].tile?.isJoker) {
			emit('setJokerLetter')
		}
	} else if (gameStore.state.fieldIndex === fieldIndex) {
		gameStore.state.fieldIndex = null
	} else {
		gameStore.state.fieldIndex = fieldIndex
	}
}
</script>
<template>
	<div :class="{ board: true, 'is-smaller': props.isSmaller }">
		<div
			v-for="(field, fieldIndex) in board"
			:key="fieldIndex"
			:class="{
				'board-field': true,
				'is-selected': fieldIndex === gameStore.state.fieldIndex,
				'is-normal': field.kind === FieldKind.Normal,
				'is-double-letter': field.kind === FieldKind.DoubleLetter,
				'is-double-word': field.kind === FieldKind.DoubleWord,
				'is-start': field.kind === FieldKind.Start,
				'is-start-no-bonus': field.kind === FieldKind.StartNoBonus,
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
	container: board / inline-size;

	width: 100%;
	height: fit-content;
	display: grid;
	grid-template-columns: repeat(15, 1fr);
	grid-template-rows: repeat(15, 1fr);
	grid-gap: 1px;
	aspect-ratio: v-bind(aspectRatio);
}

@media (aspect-ratio >= 16/10) {
	.board {
		width: fit-content;
		height: 100%;
	}

	.is-smaller {
		height: 89vmin;
	}
}

.board-field {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: #444;
	color: white;
	text-align: center;
	font-size: 2cqi;
	border: 1px solid #9bff6900;
	cursor: pointer;
	white-space: pre-wrap;
	aspect-ratio: 1 / 1;
	line-height: 1.2;
	transition: border-color 0.5s;
}
.board-field::after {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: inset 0 0 0 0 #1f5d0080;
	transition: box-shadow 0.5s ease-out;
}

.board-field.is-start,
.board-field.is-double-word {
	background-color: indianred;
}

.board-field.is-start-no-bonus {
	background-color: lch(40 50 120);
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
	border-color: #9bff69;
}
.board-field.is-selected::after {
	box-shadow: inset 0 0 0 1vmin #1f5d0080;
}
</style>
