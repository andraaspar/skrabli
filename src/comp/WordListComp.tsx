import * as React from 'react'
import { connect } from 'react-redux'
import { AddWordContext } from '../model/AddWordContext'
import { addWordRequestThunk } from '../action/addWordRequestThunk'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { IAppState } from '../model/AppState'
import { IField } from '../model/Field'
import { DispatchProp } from './DispatchProp'

export interface WordListCompPropsFromStore {}
export interface WordListCompProps
	extends WordListCompPropsFromStore,
		DispatchProp {
	words: ReadonlyArray<ReadonlyArray<IField>>
	showScore?: boolean
	wordClassName?: string
	scoreClassName?: string
	addWordContext?: AddWordContext
	label: React.ReactChild
}

export const WordListComp = connect(
	(state: IAppState): WordListCompPropsFromStore => ({}),
)(
	({
		words,
		showScore,
		wordClassName,
		scoreClassName,
		addWordContext,
		label,
		dispatch,
	}: WordListCompProps) => {
		return (
			<>
				{words.length > 0 && (
					<div>
						{label}
						{`: `}
						{words.map((word, index) => {
							const wordString = getWordString(word)
							return (
								<React.Fragment key={index}>
									{index > 0 && <>{`, `}</>}
									<a
										className={wordClassName}
										href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
											`"${wordString}"`,
										)}`}
										target='_blank'
										rel='noopener noreferrer'
									>
										{wordString.replace(' ', ' ')}
									</a>
									{showScore && (
										<>
											{` `}
											<span className={scoreClassName}>
												{getWordScore(word)}
												{` `}
												{`pont`}
											</span>
										</>
									)}
									{addWordContext && (
										<>
											{` `}
											<button
												onClick={() => {
													dispatch(
														addWordRequestThunk(
															addWordContext,
															wordString,
														),
													)
												}}
											>
												{addWordContext ===
												AddWordContext.Request
													? `Kérem`
													: `Jelzem`}
											</button>
										</>
									)}
								</React.Fragment>
							)
						})}
					</div>
				)}
			</>
		)
	},
)
