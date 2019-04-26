export type TAction = ReturnType<
	(typeof import('./actions'))[keyof typeof import('./actions')]
>
