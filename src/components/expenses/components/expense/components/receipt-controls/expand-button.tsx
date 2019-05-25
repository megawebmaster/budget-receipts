import React, { FC } from 'react'
import { Button } from 'semantic-ui-react'
import cx from 'classnames'

type ExpandButtonProps = {
  expanded: boolean,
  setExpanded: (value: boolean) => void,
}

export const ExpandButton: FC<ExpandButtonProps> = React.memo(
  ({ expanded, setExpanded }) => (
    <Button icon={cx('arrow', { up: expanded, down: !expanded })} onClick={() => setExpanded(!expanded)} />
  ),
)
