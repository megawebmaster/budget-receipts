import React, { FC, Fragment, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Message } from 'semantic-ui-react'

import { AppMessage, AppMessageType } from '../app-message'

type DismissableMessageProps = {
  message: AppMessage
}

const DismissableMessage: FC<DismissableMessageProps> = ({ message }) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(true)
  const dismiss = useCallback(() => setVisible(false), [])

  if (!visible) {
    return null
  }

  return (
    <Message
      error={message.type === AppMessageType.ERROR}
      warning={message.type === AppMessageType.WARNING}
      success={message.type === AppMessageType.SUCCESS}
      info={message.type === AppMessageType.INFO}
      content={message.translate ? intl.formatMessage({ id: message.text }) : message.text}
      onDismiss={dismiss}
    />
  )
}

export const MessageList: FC<{ messages: AppMessage[] }> = ({ messages }) => {
  return (
    <Fragment>
      {messages.map((message, idx) => (
        <DismissableMessage key={`${idx}-${message.text}`} message={message} />
      ))}
    </Fragment>
  )
}

