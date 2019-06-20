import React, { FC, useCallback } from 'react'
import { Button } from 'semantic-ui-react'

type PhotoButtonProps = {
  // addReceipt: (item: Receipt) => void
}

export const PhotoButton: FC<PhotoButtonProps> = React.memo(
  () => {
    const takePhoto = useCallback(() => {
      console.log('taking photo!')
    }, [])

    return (
      <Button color="blue" icon="photo" onClick={takePhoto} />
    )
  },
)
