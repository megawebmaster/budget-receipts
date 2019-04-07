import { AppState } from '../app.store'
import { AvailableRoutes } from './routes'

export const location = (state: AppState) => state.location.type as AvailableRoutes
