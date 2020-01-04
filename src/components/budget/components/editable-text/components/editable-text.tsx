import React, { FC, ReactNode, useCallback, useState } from 'react'
import { Text } from './text'
import { TextInput } from './text-input'

type EditableTextProps = {
  children: ReactNode
  editable: boolean
  saving: boolean
  value: string
  onDelete: () => void
  onSave: (value: string) => void
}

export const EditableText: FC<EditableTextProps> = ({ children, editable, saving, value, onDelete, onSave }) => {
  const [editing, setEdit] = useState(false)
  const startEditing = useCallback(() => setEdit(true), [setEdit])
  const stopEditing = useCallback(() => setEdit(false), [setEdit])
  const save = useCallback((value: string) => {
    onSave(value)
    stopEditing()
  }, [onSave, stopEditing])

  return editing
    ? (
      <TextInput
        text={value}
        onCancel={stopEditing}
        onSave={save}
      />
    )
    : (
      <Text
        editable={editable}
        saving={saving}
        onDelete={onDelete}
        onEdit={startEditing}
      >
        {children}
      </Text>
    )
}
