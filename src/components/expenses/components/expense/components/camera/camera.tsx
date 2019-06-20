import React, { FC, useCallback, useEffect, useRef } from 'react'
import { ImageCapture } from 'image-capture'
import { Button, Modal } from 'semantic-ui-react'

type CameraProps = {
  close: () => void
  processImage: (photo: Blob) => void
  visible: boolean
}

let videoStream: MediaStream

export const Camera: FC<CameraProps> = React.memo(
  ({ close, processImage, visible }) => {
    const videoElement = useRef<HTMLVideoElement>(null)

    const closeModal = useCallback(() => {
      videoStream.getVideoTracks()[0].stop()
      close()
    }, [close])

    const takePhoto = useCallback(async () => {
      try {
        const videoDevice = videoStream.getVideoTracks()[0]
        const captureDevice = new ImageCapture(videoDevice)

        try {
          const photo = await captureDevice.takePhoto()
          processImage(photo)
          console.log('image taken!', URL.createObjectURL(photo))
        } catch (e) {
          alert('Unable to take a picture: ' + e.message)
        }
      } catch (e) {
        alert('Your device does not support taking pictures')
      }
      closeModal()
    }, [processImage, closeModal])

    useEffect(() => {
      (async () => {
        if (!visible) {
          return
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { min: 1280 },
              height: { min: 720 },
            },
          })

          videoStream = stream

          if (videoElement.current !== null) {
            videoElement.current.srcObject = stream
          }
        } catch (e) {
          alert('Your device does not support taking pictures' + e.message)
        }
      })()
    }, [videoElement, visible])

    return (
      <Modal open={visible} size="large">
        <Modal.Content>
          <video id="camera" autoPlay ref={videoElement} style={{ width: '100%', height: 'calc(100% - 130px)' }} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button color="green" onClick={takePhoto}>Take photo</Button>
        </Modal.Actions>
      </Modal>
    )
  },
)
