<script setup lang="ts">
import { Mode } from '../model/Mode'
import { useGameStore } from '../store/useGameStore'
import IconComp from './IconComp.vue'
import playersIcon from 'bootstrap-icons/icons/people.svg?raw'
import bagFullIcon from 'bootstrap-icons/icons/bag-fill.svg?raw'
import bagEmptyIcon from 'bootstrap-icons/icons/bag-x.svg?raw'
import { gameNameFromPlayerInfos } from '../fun/gameNameFromPlayerInfos'
import DialogComp from './DialogComp.vue'
import { ref } from 'vue'
import DialogHeaderComp from './DialogHeaderComp.vue'
import DialogBodyComp from './DialogBodyComp.vue'
import PlayersComp from './PlayersComp.vue'
import { aiLevelToIcon } from '../fun/aiLevelToIcon'
import { aiLevelToColor } from '../fun/aiLevelToColor'

const gameStore = useGameStore()

const playersOpen = ref(false)

function onPlayerClicked() {
	const playerIndex = gameStore.state.playerIndex!
	const name = prompt(`Mi a neved?`, gameStore.playerInfos[playerIndex].name)
	if (name && name.trim()) {
		gameStore.playerInfos[playerIndex].name = name.trim()
		gameStore.name = gameNameFromPlayerInfos(gameStore.playerInfos)
		gameStore.saveGame()
	}
}
</script>
<template>
	<div class="layout">
		<button @click="playersOpen = true">
			<IconComp :icon="playersIcon" color="lch(80 0 0 / .6)" />
		</button>
		<div class="player">
			<button class="player-name-button" @click="onPlayerClicked">
				<IconComp
					:icon="aiLevelToIcon(gameStore.playerInfo.aiLevel)"
					:color="aiLevelToColor(gameStore.playerInfo.aiLevel)"
				/>
				{{ gameStore.playerInfo.name }}
			</button>
			<div class="score">{{ gameStore.playerScore }} pont</div>
		</div>
		<div
			v-if="gameStore.state.mode !== Mode.Ended"
			class="bag"
			title="Lapkák a zsákban"
		>
			<IconComp
				:icon="gameStore.state.bag.length > 0 ? bagFullIcon : bagEmptyIcon"
			/>
			{{ gameStore.state.bag.length }}
		</div>
	</div>
	<DialogComp :isOpen="playersOpen">
		<DialogHeaderComp @close="playersOpen = false">Játékosok</DialogHeaderComp>
		<DialogBodyComp><PlayersComp /></DialogBodyComp>
	</DialogComp>
</template>
<style scoped>
.layout {
	display: flex;
	flex-flow: row wrap;
	padding: var(--gap);
	gap: var(--gap);
	align-items: baseline;
	width: 100%;
}
.player {
	flex: 1 0 auto;
	display: flex;
	flex-flow: row;
	align-items: center;
	gap: 1vmin;
}
.player-name-button {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.player-bonus {
	font-size: 0.8em;
	color: gray;
}
.bag {
	font-size: 0.8em;
	color: gray;
}
</style>
