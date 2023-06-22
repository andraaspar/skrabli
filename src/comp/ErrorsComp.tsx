import { connect } from 'react-redux'
import { IAppState } from '../model/AppState'
import { MoveError } from '../model/MoveError'
import { selectMoveErrors } from '../select/selectMoveErrors'
import { DispatchProp } from './DispatchProp'
import './ErrorsComp.css'

interface ErrorsCompPropsFromState {
	errors: MoveError[]
}
export interface ErrorsCompProps
	extends ErrorsCompPropsFromState,
		DispatchProp {}

export const ErrorsComp = connect(
	(state: IAppState): ErrorsCompPropsFromState => ({
		errors: selectMoveErrors(state),
	}),
)(({ dispatch, errors }: ErrorsCompProps) => {
	return (
		<>
			{errors.length > 0 && (
				<div className='errors'>
					{Array.from(errors)
						.map((e) => {
							switch (e) {
								// case MoveError.InvalidWord:
								// 	return `Van egy érvénytelen szavad!`
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
		</>
	)
})
