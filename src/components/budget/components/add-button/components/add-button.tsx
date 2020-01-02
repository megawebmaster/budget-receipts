import React, { FC, useCallback, useState } from 'react'
import { Button } from 'semantic-ui-react'
import cx from 'classnames'

import { AddButtonInput } from './add-button-input'

import styles from '../add-button.module.css'

type AddButtonProps = {
  className?: string
  disabled?: boolean
  label: string
  size: 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive'
  onSave: (value: string) => void
}

export const AddButton: FC<AddButtonProps> = ({ className, disabled = false, label, size, onSave }) => {
  const [adding, setAdding] = useState(false)
  const toggleInput = useCallback(() => setAdding(value => !value), [setAdding])

  return adding
    ? (
      <AddButtonInput className={className} label={label} size={size} onSave={onSave} onClose={toggleInput} />
    ) : (
      <Button
        basic
        className={cx(styles.button, className)}
        content={label}
        disabled={disabled}
        fluid
        icon="plus"
        onClick={toggleInput}
        size={size}
      />
    )
}
