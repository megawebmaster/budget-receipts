import React, { FC, ReactNode } from 'react'
import { Button, ButtonGroup, Icon, Label, Loader } from 'semantic-ui-react'

import styles from '../editable-text.module.css'

type TextProps = {
  children: ReactNode
  editable: boolean
  error?: string
  saving: boolean
  onDelete: () => void
  onEdit: () => void
}

export const Text: FC<TextProps> = ({ children, editable, error, saving, onDelete, onEdit }) => {
  return (
    <div className={styles.textContainer}>
      {error && (
        <Label color="red" className="error-label">
          <Icon name="exclamation triangle" /> {error}
        </Label>
      )}
      <span>{children}</span>
      {editable && !saving && (
        <ButtonGroup>
          <Button icon="pencil" color="teal" size="mini" onClick={onEdit} />
          <Button icon="trash" color="red" size="mini" onClick={onDelete} />
        </ButtonGroup>
      )}
      <Loader active={saving} size="small" inline />
    </div>
  )
}
