import { Show } from '../c-mp/comp/Show'
import { defineComponent } from '../c-mp/fun/defineComponent'
import { useEffect } from '../c-mp/fun/useEffect'
import { mutateState, useState } from '../c-mp/fun/useState'
import { TChildrenIn } from '../c-mp/model/TChildrenIn'

export const DialogComp = defineComponent<{
	isOpen: () => boolean
	openDelay?: 1
	children?: TChildrenIn
}>('DialogComp', (props, $) => {
	let dialogElem = useState('dialogElem', {
		ref: undefined as HTMLDialogElement | undefined,
	})

	$.append(
		<Show
			when={props.isOpen}
			then={() => (
				<dialog
					ref={(it) => {
						mutateState('set dialog ref [t68s1j]', () => {
							dialogElem.ref = it
						})
					}}
					class='dialog'
					onclose={(e) => e.preventDefault()}
				>
					{props.children}
				</dialog>
			)}
		/>,
	)

	useEffect('show dialog [t68hvv]', () => {
		if (dialogElem.ref && props.isOpen()) {
			dialogElem.ref.showModal()
		}
	})

	return $
})
