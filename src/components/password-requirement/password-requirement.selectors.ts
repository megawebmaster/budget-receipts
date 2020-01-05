import { AppState } from '../../app.store'

export const passwordRequired = (state: AppState) => state.password.visible
export const processing = (state: AppState) => state.password.processing
export const actions = (state: AppState) => state.password.actions
