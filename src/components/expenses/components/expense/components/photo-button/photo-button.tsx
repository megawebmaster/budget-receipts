import React, { FC, Fragment, useCallback, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Camera } from '../camera'

type PhotoButtonProps = {}

export const PhotoButton: FC<PhotoButtonProps> = React.memo(
  () => {
    const [cameraVisible, setCameraVisible] = useState(false)

    const showCamera = useCallback(() => {
      setCameraVisible(true)
    }, [setCameraVisible])

    const closeCamera = useCallback(() => {
      setCameraVisible(false)
    }, [setCameraVisible])

    return (
      <Fragment>
        <Camera visible={cameraVisible} close={closeCamera} />
        <Button color="blue" icon="photo" onClick={showCamera} />
      </Fragment>
    )
  },
)
