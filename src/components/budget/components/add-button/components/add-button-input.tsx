import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Icon, Input, InputOnChangeData, Responsive } from 'semantic-ui-react'

import styles from '../add-button.module.css'

type AddButtonInputProps = {
  className?: string
  label: string
  size: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'
  onSave: (value: string) => void
  onClose: () => void
}

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
      <Button color="teal" onClick={saveInput} size={size}>
        <Icon className={styles.icon} name="plus" />
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          Add
        </Responsive>
      </Button>
      <Button color="red" onClick={onClose} size={size}>
        <Icon className={styles.icon} name="close" />
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          Cancel
        </Responsive>
      </Button>
    </Input>
  )
}
