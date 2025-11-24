import { For } from '../c-mp/comp/For'
import { Show } from '../c-mp/comp/Show'
import { Slot } from '../c-mp/comp/Slot'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { mutateState } from '../c-mp/fun/useState'
import { FieldKind } from '../model/FieldKind'
import { IBoardInfo } from '../model/IBoardInfo'
import { Mode } from '../model/Mode'
import { gameStore } from '../store/gameStore'
import css from './BoardComp.module.css'
import { TileComp } from './TileComp'

export const BoardComp = defineComponent<{
	getBoardInfo?: () => IBoardInfo
	isSmaller?: boolean
	onSetJokerLetter: () => void
}>('BoardComp', (props, $) => {
	const getBoard = () =>
		props.getBoardInfo?.().board ?? gameStore.getState().board
	const getBoardSize = () =>
		props.getBoardInfo?.().boardSize ?? gameStore.getState().boardSize
	const getAspectRatio = () => {
		const boardSize = getBoardSize()
		return boardSize.width / boardSize.height
	}

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
		const state = gameStore.getState()
		if (state.mode !== Mode.PlaceTile) return
		const fieldToSelect = state.board[fieldIndex]!
		const field = gameStore.getField()
		if (
			field != null &&
			field.tile &&
			field.tile.isOwned &&
			(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
		) {
			gameStore.swapTiles(state.fieldIndex!, fieldIndex)
		} else if (
			gameStore.getHandTile() &&
			(!fieldToSelect.tile || fieldToSelect.tile.isOwned)
		) {
			gameStore.swapHandAndBoard(fieldIndex, state.handIndex!)
			if (state.board[fieldIndex]!.tile?.isJoker) {
				props.onSetJokerLetter()
			}
		} else if (state.fieldIndex === fieldIndex) {
			mutateState('unset field index [t68q6i]', () => {
				state.fieldIndex = null
			})
		} else {
			mutateState('set field index [t68q7a]', () => {
				state.fieldIndex = fieldIndex
			})
		}
	}

	$.append(
		<div
			class={[css.board, props.isSmaller && css['is-smaller']]}
			style={{ aspectRatio: getAspectRatio() + '' }}
		>
			<For
				each={getBoard}
				render={(field) => (
					<div
						class={() => [
							css['board-field'],
							field.index === gameStore.getState().fieldIndex &&
								css['is-selected'],
							field.item.kind === FieldKind.Normal && css['is-normal'],

							field.item.kind === FieldKind.DoubleLetter &&
								css['is-double-letter'],

							field.item.kind === FieldKind.DoubleWord && css['is-double-word'],
							field.item.kind === FieldKind.Start && css['is-start'],

							field.item.kind === FieldKind.StartNoBonus &&
								css['is-start-no-bonus'],

							field.item.kind === FieldKind.TripleLetter &&
								css['is-triple-letter'],

							field.item.kind === FieldKind.TripleWord && css['is-triple-word'],
						]}
						onclick={() => onFieldClicked(field.index)}
					>
						<Show
							when={() => field.item.tile}
							then={() => <TileComp getTile={() => field.item.tile!} />}
							else={() => (
								<Slot get={() => fieldKindToString(field.item.kind)} />
							)}
						/>
					</div>
				)}
			/>
		</div>,
	)

	return $
})
