import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, Input, InputOnChangeData } from 'semantic-ui-react'

type TextInputProps = {
  error?: string
  placeholder?: string
  text: string
  onCancel: () => void
  onSave: (value: string) => void
}

export const TextInput: FC<TextInputProps> = ({ error, placeholder, text, onCancel, onSave }) => {
  const [value, setValue] = useState(text)
  const update = useCallback((_event, data: InputOnChangeData) => setValue(data.value), [setValue])
  const save = useCallback(() => onSave(value), [value, onSave])
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onSave(value)
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel()
    }
  }, [value, onCancel, onSave])

  useEffect(() => setValue(text), [text, setValue])

  return (
    <Input
      action
      autoFocus
      error={Boolean(error)}
      fluid
      placeholder={placeholder}
      size="mini"
      value={value}
      onChange={update}
      onKeyDown={onKeyDown}
    >
      <input />
      <Button color="teal" icon="save" onClick={save} />
      <Button color="red" icon="close" onClick={onCancel} />
    </Input>
  )
}
