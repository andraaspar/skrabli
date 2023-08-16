<script setup lang="ts">
import { aiLevelToColor } from '@/fun/aiLevelToColor'
import { aiLevelToIcon } from '@/fun/aiLevelToIcon'
import { aiLevelToString } from '@/fun/aiLevelToString'
import { jsonClone } from '@/fun/jsonClone'
import { range } from '@/fun/range'
import { withInterface } from '@/fun/withInterface'
import { AiLevel } from '@/model/AiLevel'
import { BOARDS } from '@/model/BOARDS'
import { HAND_SIZE } from '@/model/Constants'
import type { INewPlayer } from '@/model/INewPlayer'
import type { ITile } from '@/model/ITile'
import { LETTERS } from '@/model/LETTERS'
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import arrowLeftIcon from 'bootstrap-icons/icons/arrow-left.svg?raw'
import arrowRightIcon from 'bootstrap-icons/icons/arrow-right.svg?raw'
import addPlayerIcon from 'bootstrap-icons/icons/person-add.svg?raw'
import playIcon from 'bootstrap-icons/icons/play-circle-fill.svg?raw'
import trashIcon from 'bootstrap-icons/icons/trash3-fill.svg?raw'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BoardComp from './BoardComp.vue'
import ButtonsComp from './ButtonsComp.vue'
import DialogBodyComp from './DialogBodyComp.vue'
import DialogComp from './DialogComp.vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import HeaderComp from './HeaderComp.vue'
import IconComp from './IconComp.vue'
import WarningComp from './WarningComp.vue'

const gameStore = useGameStore()
const router = useRouter()

const newGame = ref<{
	players: INewPlayer[]
	hintsCount: number
	boardIndex: number
}>({
	players: [
		{
			name: '1. játékos',
			level: AiLevel.Human,
		},
		{
			name: `2. ${aiLevelToString(AiLevel.Easy)}`,
			level: AiLevel.Easy,
		},
	],
	hintsCount: 3,
	boardIndex: 0,
})

const LEVELS = [
	AiLevel.Human,
	AiLevel.Easy,
	AiLevel.Medium,
	AiLevel.Hard,
	AiLevel.VeryHard,
	AiLevel.Ultimate,
]

const changeLevelIndex = ref<undefined | number>()

const changeLevelName = computed(() => {
	if (changeLevelIndex.value == null) return ''
	return newGame.value.players.at(changeLevelIndex.value)?.name ?? ''
})

const warning = computed(() => {
	const players = newGame.value.players
	if (players.length < 2) {
		return `Legalább két játékos kell!`
	}
	if (!players.find((player) => player.level === AiLevel.Human)) {
		return `Legalább egy emberi játékosnak kell lennie!`
	}
	return undefined
})

// onMounted(() => {
// 	newGame.value.players = gameStore.playerInfos.map((playerInfo) =>
// 		withInterface<INewPlayer>({
// 			name: playerInfo.name,
// 			level: playerInfo.aiLevel,
// 		}),
// 	)
// })

function nextBoard(offset: number) {
	newGame.value.boardIndex += offset
	if (newGame.value.boardIndex < 0) newGame.value.boardIndex = BOARDS.length - 1
	if (newGame.value.boardIndex >= BOARDS.length) newGame.value.boardIndex = 0
}

function addPlayer() {
	newGame.value.players.push({
		name: `${newGame.value.players.length + 1}. játékos`,
		level: AiLevel.Human,
	})
}

function removePlayer(index: number) {
	newGame.value.players.splice(index, 1)
}

function changeLevel(index: number) {
	changeLevelIndex.value = index
}

function selectLevel(aiLevel: AiLevel) {
	const player = newGame.value.players.at(changeLevelIndex.value!)
	if (player) {
		if (player.level !== aiLevel) {
			player.level = aiLevel
			player.name = `${changeLevelIndex.value! + 1}. ${aiLevelToString(
				aiLevel,
			)}`
		}
		closeChangeLevel()
	}
}

function closeChangeLevel() {
	changeLevelIndex.value = undefined
}

function onInputHintsCount(e: Event) {
	const value = (e.currentTarget as HTMLInputElement).value.trim()
	if (value) {
		const num = parseInt(value, 10)
		if (!isNaN(num) && isFinite(num)) {
			newGame.value.hintsCount = Math.max(0, num)
		}
	}
}

function onInputHintsBlur(e: Event) {
	;(e.currentTarget as HTMLInputElement).value = newGame.value.hintsCount + ''
}

function start() {
	const board = jsonClone(BOARDS[newGame.value.boardIndex].board)
	const boardSize = jsonClone(BOARDS[newGame.value.boardIndex].boardSize)
	gameStore.$reset()
	gameStore.playerInfos = newGame.value.players.map((player) => ({
		name: player.name,
		aiLevel: player.level,
		hints: newGame.value.hintsCount,
	}))
	gameStore.states = [
		{
			mode: Mode.PlaceTile,
			playerScores: newGame.value.players.map(() => 0),
			hands: newGame.value.players.map(() => range(HAND_SIZE).map(() => null)),
			playerIndex: null,
			fieldIndex: null,
			handIndex: null,
			startingHandCount: null,
			skipCount: null,
			handIndicesToReplace: range(HAND_SIZE).map(() => false),
			board,
			boardSize,
			bag: LETTERS.flatMap(({ count, letter, score }) =>
				range(count).map(() =>
					withInterface<ITile>({
						letter,
						score,
						isOwned: null,
						isJoker: letter === ' ' || null,
						isLast: null,
					}),
				),
			),
		},
	]
	gameStore.startGame()
	router.replace({ name: 'game' })
}
</script>

<template>
	<div class="screen">
		<HeaderComp>Új játék</HeaderComp>
		<div class="board-and-buttons">
			<BoardComp :isSmaller="true" :boardInfo="BOARDS[newGame.boardIndex]" />
			<ButtonsComp>
				<button @click="nextBoard(-1)">
					<IconComp :icon="arrowLeftIcon" /> Előző tábla
				</button>
				<button @click="nextBoard(1)">
					Következő tábla <IconComp :icon="arrowRightIcon" />
				</button>
			</ButtonsComp>
		</div>
		<div class="form">
			<div class="form-control">
				<div class="form-label">Játékosok</div>
				<div class="players">
					<template v-for="(newPlayer, index) of newGame.players" :key="index">
						<input
							v-model="newPlayer.name"
							size="12"
							:disabled="newPlayer.level !== AiLevel.Human"
						/>
						<button @click="changeLevel(index)">
							<IconComp
								:icon="aiLevelToIcon(newPlayer.level)"
								:color="aiLevelToColor(newPlayer.level)"
							/>
							{{ aiLevelToString(newPlayer.level) }}
						</button>
						<button @click="removePlayer(index)">
							<IconComp :icon="trashIcon" color="lch(80 100 30)" />
						</button>
					</template>
				</div>
				<div v-if="newGame.players.length === 0" class="none">
					Nincsenek játékosok!
				</div>
				<ButtonsComp>
					<button @click="addPlayer">
						<IconComp :icon="addPlayerIcon" color="lch(80 100 180)" /> Új
						játékos
					</button>
				</ButtonsComp>
			</div>
			<div class="form-control">
				<label class="form-label" for="hints-count">Tippek</label>
				<div class="form-control-centered">
					<input
						id="hints-count"
						:value="newGame.hintsCount"
						@input="onInputHintsCount"
						@blur="onInputHintsBlur"
						size="1"
					/>
				</div>
			</div>
			<WarningComp :warning="warning" />
			<ButtonsComp>
				<button @click="start" :disabled="!!warning">
					<IconComp :icon="playIcon" color="lch(80 100 260)" /> Start!
				</button>
			</ButtonsComp>
		</div>
		<DialogComp :isOpen="changeLevelIndex != null">
			<DialogHeaderComp @close="closeChangeLevel">{{
				changeLevelName
			}}</DialogHeaderComp>
			<DialogBodyComp>
				<div class="form-buttons">
					<button
						v-for="(aiLevel, index) of LEVELS"
						:key="index"
						@click="selectLevel(aiLevel)"
					>
						<IconComp
							:icon="aiLevelToIcon(aiLevel)"
							:color="aiLevelToColor(aiLevel)"
						/>
						{{ aiLevelToString(aiLevel) }}
					</button>
				</div>
			</DialogBodyComp>
		</DialogComp>
	</div>
</template>

<style scoped>
.form {
	container: form / inline-size;
	width: 100%;
	display: flex;
	flex-flow: column;
	padding: 8vmin 8vmin 16vmin;
	gap: 4vmin;
	margin: 0 auto;
}

@media (aspect-ratio >= 16/10) {
	.form {
		overflow: auto;
	}
}

.form-control,
.form-buttons {
	display: flex;
	flex-flow: column;
	gap: var(--gap);
}
.form-label {
	font-size: 0.8em;
	text-align: center;
}
.form-control-centered {
	display: flex;
	justify-content: center;
}

.players {
	display: grid;
	gap: var(--gap);
	grid-template-columns: 1fr 1fr auto;
}

@container form (width <= 60vmin) {
	.players {
		grid-template-columns: 1fr;
	}
}

.none {
	padding: var(--button-padding);
	text-align: center;
	font-style: italic;
	color: lch(100 0 0 / 0.6);
}

.board-and-buttons {
	flex: 0 0 auto;
	display: flex;
	flex-flow: column;
}
</style>
