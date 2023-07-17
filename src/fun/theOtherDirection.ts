import { Direction } from '../model/Direction'

export function theOtherDirection(d: Direction) {
	return d === Direction.Horizontal ? Direction.Vertical : Direction.Horizontal
}
