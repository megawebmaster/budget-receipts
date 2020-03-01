import React, { Fragment, FC, ReactNode, useCallback, useState } from 'react'
import { Button, Dimmer, Form, Header, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { passwordRequired, processing } from '../password-requirement.selectors'
import { setEncryptionPassword } from '../../../encryption'

import '../password-requirement.css'

type PasswordRequirementProps = {
  children: ReactNode
  required: boolean
}

export const PasswordRequirement: FC<PasswordRequirementProps> = ({ children, required }) => {
  const requirePassword = useSelector(passwordRequired)
  const isProcessing = useSelector(processing)
  const [password, setPassword] = useState('')
  const updatePassword = useCallback((event) => {
    setPassword(event.target.value)
  }, [setPassword])
  const dispatch = useDispatch()
  const updateEncryptionPassword = useCallback(() => {
    dispatch(setEncryptionPassword(password))
  }, [password, dispatch])

  if (!required) {
    return (
      <Fragment>
        {children}
      </Fragment>
    )
  }

  return (
    <Dimmer.Dimmable as="div" dimmed={requirePassword}>
      <Dimmer inverted page active={requirePassword}>
        <Segment>
          <Header as="h2" color="teal" textAlign="center">
            <FormattedMessage id="encryption.header" />
          </Header>
          <Form size="large">
            <Form.Input
              fluid
              type="password"
              icon="lock"
              iconPosition="left"
              onChange={updatePassword}
              value={password}
              disabled={isProcessing}
            />
            <Button
              color="teal"
              fluid
              size="large"
              onClick={updateEncryptionPassword}
              loading={isProcessing}
              disabled={isProcessing}
            >
              <FormattedMessage id="encryption.confirm" />
            </Button>
          </Form>
        </Segment>
      </Dimmer>
      {children}
    </Dimmer.Dimmable>
  )
}
