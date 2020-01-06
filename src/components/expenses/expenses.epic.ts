import { combineEpics, Epic, ofType } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'
import { concatMap, filter, map, mergeAll, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import * as Actions from './expenses.actions'
import { AvailableRoutes, ExpenseRouteAction } from '../../routes'
import { ConnectionService } from '../../connection.service'
import { decryptAction } from '../../encryption'

// TODO: Support optional fields decrypting
// const decryptReceipts = decryptAction({
//   actionCreator: Actions.updateReceipts,
//   fields: ['shop'],
// })
const decryptReceiptItems = decryptAction({
  actionCreator: Actions.updateReceiptItems,
  fields: ['description'],
  numericFields: ['value'],
})

const pageLoadEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, ExpenseRouteAction>(AvailableRoutes.EXPENSES_MONTH),
    map(({ payload: { budget, year, month } }) => (
      `${process.env.REACT_APP_API_URL}/v2/budgets/${budget}/${year}/receipts/${month}`
    )),
    mergeMap((url) => of(
      ConnectionService.fetchFromNetwork(url, Actions.loadReceiptsFromApi),
      ConnectionService.loadFromCache(url, Actions.loadReceiptsFromApi),
    )),
    mergeAll(),
  )

const loadReceiptsFromApiEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.loadReceiptsFromApi)),
    concatMap(({ payload: { source, value } }) => [
      Actions.updateReceipts({ source, value }),
      ...value.map((receipt) => decryptReceiptItems({ source, value: receipt.items || [] })),
    ]),
  )

export const expensesEpic = combineEpics(
  pageLoadEpic,
  loadReceiptsFromApiEpic,
)
