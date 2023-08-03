<script setup lang="ts">
import { numberToSignedString } from '@/fun/numberToSignedString'
import { Mode } from '@/model/Mode'
import { useGameStore } from '@/store/useGameStore'
import IconComp from './IconComp.vue'
import { aiLevelToIcon } from '@/fun/aiLevelToIcon'
import { aiLevelToColor } from '@/fun/aiLevelToColor'

// const props = defineProps<{}>()

const gameStore = useGameStore()
</script>

<template>
	<div class="players">
		<template v-for="(playerInfo, playerIndex) of gameStore.playerInfos">
			<div>
				<IconComp
					:icon="aiLevelToIcon(playerInfo.aiLevel)"
					:color="aiLevelToColor(playerInfo.aiLevel)"
				/>
				{{ playerInfo.name }}
			</div>
			<div class="score">
				{{ gameStore.state.playerScores.at(playerIndex) }} pont
				<div v-if="gameStore.state.mode === Mode.Ended" class="player-bonus">
					{{ numberToSignedString(gameStore.playerBonuses[playerIndex]) }}
					pont
				</div>
			</div>
			<div class="tiles">
				{{ gameStore.state.hands.at(playerIndex)?.filter(Boolean).length }}
				lapka
			</div>
		</template>
	</div>
</template>

<style scoped>
.players {
	margin: 0 auto;
	width: max-content;
	display: grid;
	grid-template-columns: auto auto auto;
	align-items: baseline;
	gap: calc(var(--gap) * 2);
	text-align: left;
}
.player-bonus {
	font-size: 0.8em;
	color: gray;
}

.tiles {
	font-size: 0.8em;
	color: lch(80 100 320);
}
</style>
