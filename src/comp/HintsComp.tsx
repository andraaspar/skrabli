import verticalIcon from 'bootstrap-icons/icons/arrow-down-square.svg?raw'
import horizontalIcon from 'bootstrap-icons/icons/arrow-right-square.svg?raw'
import stopwatchIcon from 'bootstrap-icons/icons/stopwatch.svg?raw'
import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { useEffect } from '../c-mp/fun/useEffect'
import { mutateState, useState } from '../c-mp/fun/useState'
import { jsonClone } from '../fun/jsonClone'
import { loadHints } from '../fun/loadHints'
import { IWordPlans } from '../model/IWordPlans'
import { gameStore } from '../store/gameStore'
import { DialogBodyComp } from './DialogBodyComp'
import { DialogComp } from './DialogComp'
import { DialogHeaderComp } from './DialogHeaderComp'
import { ErrorComp } from './ErrorComp'
import css from './HintsComp.module.css'
import { IconComp } from './IconComp'

export const HintsComp = defineComponent<{
	getIsOpen: () => boolean
	onClose: () => void
}>('HintsComp', (props, $) => {
	const state = useState('state', {
		hints: null as IWordPlans | null,
		hintsError: null as string | null,
	})

	async function load() {
		try {
			mutateState(`${$.debugName} clear hints [t6wvx1]`, () => {
				state.hints = null
				state.hintsError = null
			})
			const hints = await loadHints({
				board: jsonClone(gameStore.getState().board),
				boardSize: jsonClone(gameStore.getState().boardSize),
				hand: jsonClone(gameStore.getHand()!),
			})
			mutateState(`${$.debugName} set hints [t6wvx2]`, () => {
				state.hints = hints
			})
		} catch (e) {
			console.error(`[rx9sem]`, e)
			mutateState(`${$.debugName} set hintsError [t6wvx3]`, () => {
				state.hintsError = e + ''
			})
		}
	}

	useEffect('HintsComp load effect [t6wvx4]', () => {
		if (props.getIsOpen()) {
			load()
		}
	})

	$.append(
		<DialogComp isOpen={props.getIsOpen}>
			<DialogHeaderComp onClose={props.onClose}>Tipp</DialogHeaderComp>
			<DialogBodyComp>
				<div class={css.results}>
					<Show
						when={() => !!state.hintsError}
						then={() => <ErrorComp error={() => state.hintsError} />}
					/>
					<Show
						when={() => !state.hintsError && state.hints == null}
						then={() => <IconComp icon={stopwatchIcon} />}
					/>
					<Show
						when={() => state.hints != null}
						then={() => {
							const hintsTexts = () => {
								if (state.hints == null) return { horizontal: '', vertical: '' }
								return {
									horizontal: state.hints.horizontal
										.map((it) => it.word)
										.join(', '),
									vertical: state.hints.vertical
										.map((it) => it.word)
										.join(', '),
								}
							}

							return (
								<>
									<div class={css.result}>
										<div class={css.title}>
											<IconComp icon={horizontalIcon} /> Vízszintes
										</div>
										<div>{() => hintsTexts().horizontal || '‑'}</div>
									</div>
									<div class={css.result}>
										<div class={css.title}>
											<IconComp icon={verticalIcon} /> Függőleges
										</div>
										<div>{() => hintsTexts().vertical || '‑'}</div>
									</div>
								</>
							)
						}}
					/>
				</div>
			</DialogBodyComp>
		</DialogComp>,
	)

	return $
})
