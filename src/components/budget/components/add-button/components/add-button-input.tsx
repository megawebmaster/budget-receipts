import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Icon, Input, InputOnChangeData, SemanticCOLORS } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

import styles from '../add-button.module.css'

type AddButtonInputProps = {
  className?: string
  label: string
  size: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'
  onSave: (value: string) => void
  onClose: () => void
}

type IconButtonProps = {
  color: SemanticCOLORS
  icon: 'plus' | 'close'
  onClick: () => void
  size: AddButtonInputProps['size']
  text: string
}

const IconButton: FC<IconButtonProps> = ({ color, icon, onClick, size, text }) => (
  <Button color={color} onClick={onClick} size={size}>
    <Icon className={styles.icon} name={icon} />
    <span className={styles.text}>
      <FormattedMessage id={text} />
    </span>
  </Button>
)

export const AddButtonInput: FC<AddButtonInputProps> = ({ className, label, size, onSave, onClose }) => {
  const ref = useRef<Input>(null)
  const [value, setValue] = useState('')
  const updateValue = (_event: React.ChangeEvent, data: InputOnChangeData) => setValue(data.value)
  const saveInput = () => {
    onSave(value)
    setValue('')
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      saveInput()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [ref])

  return (
    <Input
      action
      className={className}
      fluid
      onChange={updateValue}
      onKeyDown={onKeyDown}
      placeholder={label}
      ref={ref}
      size={size}
      value={value}
    >
      <input />
      <IconButton color="teal" icon="plus" onClick={saveInput} size={size} text="budget.add-button.add" />
      <IconButton color="red" icon="close" onClick={onClose} size={size} text="budget.add-button.cancel" />
    </Input>
  )
}
