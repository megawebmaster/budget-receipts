import { AppState } from '../../app.store'

export const currency = (state: AppState) => state.settings.currency
export const irregularDivisor = (state: AppState) => state.settings.irregularDivisor
