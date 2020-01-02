import { combineEpics, Epic, ofType } from 'redux-observable'
import { concatMap, map, mergeAll } from 'rxjs/operators'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import { AvailableRoutes, RouteAction } from '../../routes'

import { CategoriesService } from './categories.service'

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(AvailableRoutes.BUDGET_MONTH_ENTRIES, AvailableRoutes.EXPENSES_MONTH),
    // TODO: Maybe ramdify it?
    // distinctUntilChanged((firstAction, secondAction) => firstAction.payload.budget === secondAction.payload.budget),
    map(({ payload: { budget } }) => (
      new Request(`${process.env.REACT_APP_API_URL}/budgets/${budget}/categories`)
    )),
    concatMap((request) => [
      CategoriesService.fetchFromNetwork(request),
      CategoriesService.loadFromCache(request),
    ]),
    mergeAll(),
  )

export const categoriesEpic = combineEpics(
  pageLoadEpic,
)
