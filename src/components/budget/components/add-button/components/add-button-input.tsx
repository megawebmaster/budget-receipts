import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Icon, Input, InputOnChangeData, Responsive } from 'semantic-ui-react'

import styles from '../add-button.module.css'

type AddButtonInputProps = {
  className?: string
  label: string
  size: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'
  onSave: (value: string) => void
  onClose: () => void
}

// TODO: Fix small changes of size when changing from button to input
export const AddButtonInput: FC<AddButtonInputProps> = ({ className, label, size, onSave, onClose }) => {
  const ref = useRef<Input>(null)
  const [value, setValue] = useState('')
  const updateValue = useCallback((_event, data: InputOnChangeData) => setValue(data.value), [setValue])
  const saveInput = useCallback(() => {
    onSave(value)
    setValue('')
  }, [value, onSave])

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      saveInput()
    }
    if (event.key === 'Esc') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }, [saveInput, onClose])

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
      <Button color="teal" onClick={saveInput}>
        <Icon className={styles.icon} name="plus" />
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          Add
        </Responsive>
      </Button>
      <Button color="red" onClick={onClose}>
        <Icon className={styles.icon} name="close" />
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          Cancel
        </Responsive>
      </Button>
    </Input>
  )
}
