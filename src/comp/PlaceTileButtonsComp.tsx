import { get } from 'illa/FunctionUtil'
import * as React from 'react'
import { useContext } from 'react'
import { collectTiles } from '../fun/collectTiles'
import { disownTiles } from '../fun/disownTiles'
import { fillHand } from '../fun/fillHand'
import { getMoveScore } from '../fun/getMoveScore'
import { nextPlayer } from '../fun/nextPlayer'
import { score } from '../fun/score'
import { setJokerLetter } from '../fun/setJokerLetter'
import { setMode } from '../fun/setMode'
import { validateMove } from '../fun/validateMove'
import { Mode } from '../model/Mode'
import letters from '../res/letters.json'
import { SetStateContext, StateContext } from './ContextProvider'
import './PlaceTileButtonsComp.css'

export function PlaceTileButtonsComp() {
	const { board, fieldIndex, bag } = useContext(StateContext)
	const setState = useContext(SetStateContext)
	const moveScore = getMoveScore(board)
	return (
		<div className='buttons'>
			<button
				disabled={validateMove(board).size > 0}
				onClick={e => {
					setState(score())
					setState(disownTiles())
					setState(fillHand())
					setState(nextPlayer())
				}}
			>
				{`Oké`}
				{moveScore > 0 && (
					<>
						{`: `}
						<small>
							{moveScore}
							{` `}
							{`pont`}
						</small>
					</>
				)}
			</button>
			<button
				onClick={e => {
					setState(collectTiles())
				}}
			>
				{`Szedd össze`}
			</button>
			<button
				disabled={bag.length < 7}
				onClick={e => {
					setState(collectTiles())
					setState(setMode(Mode.ReplaceTiles))
				}}
			>
				{`Csere`}
			</button>
			<button
				onClick={e => {
					setState(collectTiles())
					setState(nextPlayer())
				}}
			>
				{`Kihagyom`}
			</button>
			{get(() => board[fieldIndex!].tile!.isJoker) && (
				<select
					value={board[fieldIndex!].tile!.letter}
					onChange={e => {
						setState(setJokerLetter(e.target.value))
					}}
				>
					{letters.map((letter, index) => (
						<option key={index}>{letter.letter}</option>
					))}
				</select>
			)}
		</div>
	)
}
