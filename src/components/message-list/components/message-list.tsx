import React, { FC, Fragment, useCallback, useState } from 'react'
import { Message } from 'semantic-ui-react'
import { AppMessage, AppMessageType } from '../app-message'

type MessageListProps = {
  messages: AppMessage[]
}

type DismissableMessageProps = {
  message: AppMessage
}

const DismissableMessage: FC<DismissableMessageProps> = ({ message }) => {
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
      content={message.text}
      onDismiss={dismiss}
    />
  )
}

export const MessageList: FC<MessageListProps> = React.memo(
  ({ messages }) => (
    <Fragment>
      {messages.map((message, idx) => (
        <DismissableMessage key={`${idx}-${message.text}`} message={message} />
      ))}
    </Fragment>
  ),
)

