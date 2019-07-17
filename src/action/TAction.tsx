type TActionsModule = typeof import('./actions')
export type TAction = ReturnType<TActionsModule[keyof TActionsModule]>
