import { Auth0DecodedHash, Auth0Error, Auth0ParseHashError, Auth0UserProfile, WebAuth } from 'auth0-js'
import { combineEpics, Epic, ofType } from 'redux-observable'
import { Observable } from 'rxjs'
import { filter, ignoreElements, map, switchMap, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { redirect } from 'redux-first-router'

import { AppAction } from '../app.actions'
import { AppState } from '../app.store'
import * as Actions from './auth.actions'
import { AvailableRoutes, RouteAction, Selectors as RouteSelectors } from '../routes'
import { Authenticator } from '../app.auth'
import { Encryption } from '../encryption/encryption'

const auth0 = new WebAuth({
  domain: 'megawebmaster.eu.auth0.com',
  clientID: 'PqsSsHBLYS3MDS2FXthxnouqES3Amiu9',
  redirectUri: process.env.REACT_APP_URL,
  scope: 'openid profile email',
  responseType: 'token id_token',
})

const loginEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(Actions.login)),
    filter(() => !window.location.hash.includes('access_token=')),
    tap(() => {
      const location = RouteSelectors.location(state$.value)
      const payload = RouteSelectors.payload(state$.value)
      localStorage.setItem('referrer', JSON.stringify({ location, payload }))
      auth0.authorize()
    }),
    ignoreElements(),
  )

const parseLoginEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    ofType<AppAction, RouteAction>(...Object.values(AvailableRoutes)),
    map(() => window.location.hash),
    filter((hash) => hash.includes('access_token=')),
    switchMap((hash) =>
      new Observable<AppAction>(observer => {
        const { location, payload } = JSON.parse(localStorage.getItem('referrer') || '{}')

        if (location && location !== AvailableRoutes.HOME) {
          observer.next(redirect({ type: location, payload }) as RouteAction)
        }

        observer.next(Actions.loggingIn())

        auth0.parseHash({ hash },(error: Auth0ParseHashError | null, authentication: Auth0DecodedHash | null) => {
          if (error) {
            observer.next(Actions.loginError(`login.error.${error.error}`))
            return
          }

          if (!authentication || !authentication.accessToken || !authentication.idToken || !authentication.expiresIn) {
            observer.next(Actions.loginError('login.error.authentication_missing'))
            return
          }

          Authenticator.setToken(authentication.idToken, authentication.expiresIn)
          auth0.client.userInfo(authentication.accessToken, (error: Auth0Error | null, profile: Auth0UserProfile) => {
            if (error) {
              observer.next(Actions.loginError(`login.error.${error.error}`))
            }
            Authenticator.setProfile(profile)
            observer.next(Actions.loggedIn())
          })
        })
      })),
  )

const logoutEpic: Epic<AppAction, AppAction, AppState> = (action$) =>
  action$.pipe(
    filter(isActionOf(Actions.logout)),
    tap(() => {
      Authenticator.removeToken()
      Encryption.removePasswords()
      auth0.logout({
        returnTo: process.env.REACT_APP_URL
      })
    }),
    ignoreElements(),
  )

export const authEpic = combineEpics(
  loginEpic,
  parseLoginEpic,
  logoutEpic,
)
