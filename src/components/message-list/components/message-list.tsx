import React, { FC, Fragment, useState } from 'react'
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
      onDismiss={() => setVisible(false)}
    />
  )
}

export const MessageList: FC<MessageListProps> = ({ messages }) => (
  <Fragment>
    {messages.map((message, idx) => (
      <DismissableMessage key={`${idx}-${message.text}`} message={message} />
    ))}
  </Fragment>
)

