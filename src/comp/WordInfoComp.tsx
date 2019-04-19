import * as React from 'react'
import { connect } from 'react-redux'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { BINGO_SCORE } from '../model/Constants'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { MoveError } from '../model/MoveError'
import { IState } from '../model/State'
import { selectIsBingoFromState } from '../select/selectIsBingo'
import { selectMoveErrorsFromState } from '../select/selectMoveErrors'
import { selectValidAndInvalidWordsFromState } from '../select/selectValidAndInvalidWords'
import { DispatchProp } from './DispatchProp'
import './WordInfoComp.css'

export interface WordInfoCompPropsFromStore {
	words: IValidAndInvalidWords
	errors: MoveError[]
	isBingo: boolean
}
export interface WordInfoCompProps
	extends WordInfoCompPropsFromStore,
		DispatchProp {}

export const WordInfoComp = connect(
	(state: IState): WordInfoCompPropsFromStore => ({
		words: selectValidAndInvalidWordsFromState(state),
		errors: selectMoveErrorsFromState(state),
		isBingo: selectIsBingoFromState(state),
	}),
)(
	({
		words: { valid, invalid },
		errors,
		isBingo,
		dispatch,
	}: WordInfoCompProps) => {
		return (
			<div className='word-info'>
				{valid.length > 0 && (
					<>
						{isBingo && (
							<div className='bingo'>{`+${BINGO_SCORE} pont!`}</div>
						)}
						<div>
							{`Érvényes szavak:`}
							{` `}
							{valid.map((word, index) => {
								const wordString = getWordString(word)
								return (
									<React.Fragment key={index}>
										{index > 0 && <>{`, `}</>}
										<a
											className='valid-word'
											href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
												`"${wordString}"`,
											)}`}
											target='_blank'
										>
											{wordString.replace(' ', ' ')}
										</a>
										{` `}
										<span className='word-score'>
											{getWordScore(word)}
											{` `}
											{`pont`}
										</span>
									</React.Fragment>
								)
							})}
						</div>
					</>
				)}
				{invalid.length > 0 && (
					<div>
						{`Érvénytelen szavak:`}
						{` `}
						{invalid.map((word, index) => {
							const wordString = getWordString(word)
							return (
								<React.Fragment key={index}>
									{index > 0 && <>{`, `}</>}
									<a
										className='invalid-word'
										href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
											`"${wordString}"`,
										)}`}
										target='_blank'
									>
										{wordString.replace(' ', ' ')}
									</a>
								</React.Fragment>
							)
						})}
					</div>
				)}
				{errors.length > 0 && (
					<div>
						{Array.from(errors)
							.map(e => {
								switch (e) {
									case MoveError.InvalidWord:
										return `Van egy érvénytelen szavad!`
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
										return `[ppy6tx]: ${e}`
								}
							})
							.map((e, index) => (
								<div key={index}>{e}</div>
							))}
					</div>
				)}
			</div>
		)
	},
)
