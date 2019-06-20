import React, { FC, useCallback, useState } from 'react'
import { ImageCapture } from 'image-capture'
import { Button } from 'semantic-ui-react'
import { ExpensesService } from '../../../../expenses.service'

type PhotoButtonProps = {
  processingImage: boolean
  processImage: (photo: Blob) => void
}

export const PhotoButton: FC<PhotoButtonProps> = React.memo(
  ({ processingImage, processImage }) => {
    const [processing, setProcessing] = useState(false)
    const takePhoto = useCallback(async () => {
      // TODO: Show view to shoot picture
      setProcessing(true)
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 1280 },
            height: { min: 720 }
          },
        })
        const videoDevice = mediaStream.getVideoTracks()[0]
        const captureDevice = new ImageCapture(videoDevice);

        if (!captureDevice) {
          videoDevice.stop()
          return
        }

        try {
          const photo = await captureDevice.takePhoto()
          processImage(photo)
          // console.log('image taken!', URL.createObjectURL(photo))
        } catch(e) {
          alert('Unable to take a picture: ' + e.message)
        } finally {
          videoDevice.stop()
        }
      } catch (e) {
        alert('Your device does not support taking pictures')
      } finally {
        setProcessing(false)
      }
    }, [setProcessing, processImage])

    return (
      <Button color="blue" icon="photo" onClick={takePhoto} loading={processing || processingImage} />
    )
  },
)
