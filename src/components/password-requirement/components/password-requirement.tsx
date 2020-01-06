import React, { FC, ReactNode, useCallback, useState } from 'react'
import { Button, Dimmer, Form, Header, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { passwordRequired, processing } from '../password-requirement.selectors'
import { setEncryptionPassword } from '../../../encryption'

import '../password-requirement.css'

type PasswordRequirementProps = {
  children: ReactNode
}

export const PasswordRequirement: FC<PasswordRequirementProps> = ({ children }) => {
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

  return (
    <Dimmer.Dimmable as="div" dimmed={requirePassword}>
      <Dimmer inverted page active={requirePassword}>
        <Segment>
          <Header as="h2" color="teal" textAlign="center">
            Please enter encryption password
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
              Set password
            </Button>
          </Form>
        </Segment>
      </Dimmer>
      {children}
    </Dimmer.Dimmable>
  )
}