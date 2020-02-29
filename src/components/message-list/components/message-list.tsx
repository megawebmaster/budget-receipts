import React, { FC, Fragment, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Message } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

import { AppMessage, AppMessageType } from '../app-message'
// This is explicitly taken selector to avoid circular dependency
import { messages as pageMessages } from '../../page/page.selectors'

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

export const MessageList = () => {
  const messages = useSelector(pageMessages)

  return (
    <Fragment>
      {messages.map((message, idx) => (
        <DismissableMessage key={`${idx}-${message.text}`} message={message} />
      ))}
    </Fragment>
  )
}

