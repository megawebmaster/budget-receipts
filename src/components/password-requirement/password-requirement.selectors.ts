import { AppState } from '../../app.store'

export const passwordRequired = (state: AppState) => state.password.visible
