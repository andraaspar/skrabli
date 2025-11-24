import { onHashChange } from './onHashChange'

export function navigate(target: string) {
	location.hash = '#' + target
	onHashChange()
}
