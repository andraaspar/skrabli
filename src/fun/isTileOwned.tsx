import { get } from 'illa/FunctionUtil'
import { ITile } from '../model/Tile'

export function isTileOwned(tile: ITile | null): boolean {
	return !!get(() => tile!.isOwned)
}
