import { combineEpics, Epic } from 'redux-observable'
import { concatMap, filter } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppState } from '../../app.store'
import { AppAction } from '../../app.actions'
import * as Actions from './password-requirement.actions'
import { actions } from './password-requirement.selectors'
import { setEncryptionPassword } from '../../encryption'

const setEncryptionPasswordEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(setEncryptionPassword)),
    concatMap(() => [
      ...actions(state$.value),
      Actions.continueActions(),
    ]),
  )


export const passwordEpic = combineEpics(
  setEncryptionPasswordEpic,
)
