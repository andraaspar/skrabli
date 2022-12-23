import { connect } from 'react-redux'
import { selectHandThunk } from '../action/selectHandThunk'
import { IAppState } from '../model/AppState'
import { TBoard } from '../model/Board'
import { THandIndicesToReplace } from '../model/HandIndicesToReplace'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import {
	selectBoard,
	selectHandIndicesToReplace,
	selectHands,
	selectMode,
} from '../select/simpleSelectors'
import { AspectComp } from './AspectComp'
import { DispatchProp } from './DispatchProp'
import './HandComp.css'
import { TileComp } from './TileComp'

interface HandCompPropsFromState {
	hands: THands
	playerIndex: number | null
	handIndex: number | null
	board: TBoard
	fieldIndex: number | null
	mode: Mode
	handIndicesToReplace: THandIndicesToReplace
}
export interface HandCompProps extends HandCompPropsFromState, DispatchProp {}

export const HandComp = connect(
	(state: IAppState): HandCompPropsFromState => ({
		hands: selectHands(state),
		playerIndex: state.playerIndex,
		handIndex: state.handIndex,
		fieldIndex: state.fieldIndex,
		board: selectBoard(state),
		handIndicesToReplace: selectHandIndicesToReplace(state),
		mode: selectMode(state),
	}),
)(
	({
		board,
		dispatch,
		fieldIndex,
		handIndex,
		handIndicesToReplace,
		hands,
		mode,
		playerIndex,
	}: HandCompProps) => {
		return (
			<>
				{playerIndex != null && (
					<div className='hand'>
						{hands[playerIndex].map((tile, aHandIndex) => (
							<div
								key={aHandIndex}
								className={[
									'hand-slot',
									handIndex === aHandIndex && 'is-selected',
									handIndicesToReplace[aHandIndex] && 'is-to-be-replaced',
								]
									.filter(Boolean)
									.join(' ')}
								onClick={(e) => {
									dispatch(selectHandThunk(aHandIndex))
								}}
							>
								<AspectComp width={1} height={1}>
									{tile && <TileComp tile={tile} neverOwned />}
								</AspectComp>
							</div>
						))}
					</div>
				)}
			</>
		)
	},
)
