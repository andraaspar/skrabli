<script setup lang="ts">
import { numberToSignedString } from '@/fun/numberToSignedString'
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import IconComp from './IconComp.vue'
import handIcon from 'bootstrap-icons/icons/hand-index-thumb-fill.svg?raw'
import bagFullIcon from 'bootstrap-icons/icons/bag-fill.svg?raw'
import bagEmptyIcon from 'bootstrap-icons/icons/bag-x.svg?raw'
import { gameNameFromPlayerInfos } from '@/fun/gameNameFromPlayerInfos'

const gameStore = useGameStore()

function onPlayerClicked(playerIndex: number) {
	const name = prompt(`Mi a neved?`, gameStore.playerInfos[playerIndex].name)
	if (name && name.trim()) {
		gameStore.playerInfos[playerIndex].name = name.trim()
		gameStore.name = gameNameFromPlayerInfos(gameStore.playerInfos)
		gameStore.saveGame()
	}
}
</script>
<template>
	<div class="players">
		<div
			v-for="(player, playerIndex) of gameStore.playerInfos"
			:key="playerIndex"
			class="player"
		>
			<button class="player-name-button" @click="onPlayerClicked(playerIndex)">
				{{ player.name }}
			</button>
			<div class="score">
				<IconComp
					v-if="gameStore.state.playerIndex === playerIndex"
					:icon="handIcon"
					color="lightgreen"
					rotate90-and-flip
				/>
				{{ gameStore.state.playerScores[playerIndex] || 0 }} pont
				<div v-if="gameStore.state.mode === Mode.Ended" class="player-bonus">
					{{ numberToSignedString(gameStore.playerBonuses[playerIndex]) }} pont
				</div>
			</div>
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
</template>
<style scoped>
.players {
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
