import createAuth0Client from '@auth0/auth0-spa-js';
import { combineEpics, Epic } from 'redux-observable'
import { filter, ignoreElements, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { AppAction } from '../app.actions'
import { AppState } from '../app.store'
import * as Actions from './auth0.actions'

const auth0 = createAuth0Client({
  domain: 'megawebmaster.eu.auth0.com',
  client_id: 'PqsSsHBLYS3MDS2FXthxnouqES3Amiu9',
  redirect_uri: `${process.env.REACT_APP_URL}/login`,
  scope: 'openid profile email',
})


const loginEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.login)),
    ignoreElements(),
  )

export const authEpic = combineEpics(
  loginEpic,
)
