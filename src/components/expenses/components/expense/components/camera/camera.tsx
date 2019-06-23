import React, { FC, useCallback, useEffect, useRef, useState, Fragment } from 'react'
import { ImageCapture } from 'image-capture'
import cx from 'classnames'
import { Icon } from 'semantic-ui-react'

import styles from './camera.module.css'

type CameraProps = {
  close: () => void
  processImage: (photo: Blob) => void
  visible: boolean
}

let videoStream: MediaStream

export const Camera: FC<CameraProps> = React.memo(
  ({ close, processImage, visible }) => {
    const videoElement = useRef<HTMLVideoElement>(null)
    const [photo, setPhoto] = useState<Blob | null>(null)

    const closeModal = useCallback(() => {
      if (videoStream) {
        videoStream.getVideoTracks()[0].stop()
      }
      setPhoto(null)
      close()
    }, [close, setPhoto])

    const takePhoto = useCallback(async () => {
      if (!videoStream) {
        alert('We need access to your camera to take pictures')
        closeModal()
        return
      }
      try {
        const videoDevice = videoStream.getVideoTracks()[0]
        const captureDevice = new ImageCapture(videoDevice)

        try {
          const photo = await captureDevice.takePhoto()
          setPhoto(photo)
        } catch (e) {
          console.error(e)
          alert('Unable to take a picture: ' + e.message)
        }
      } catch (e) {
        console.error(e)
        alert('Your device does not support taking pictures')
      }
    }, [setPhoto, closeModal])

    const acceptPhoto = useCallback(() => {
      if (photo !== null) {
        processImage(photo)
      }
      closeModal()
    }, [processImage, photo, closeModal])

    const resetPhoto = useCallback(() => {
      setPhoto(null)
    }, [setPhoto])

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
          console.error(e)
          alert('Your device does not support taking pictures')
        }
      })()
    }, [videoElement, visible])

    return (
      <div className={cx(styles.camera, { [styles.visible]: visible })}>
        <div className={styles.container}>
          <video autoPlay ref={videoElement} className={cx(styles.video, { [styles.hidden]: photo })} />
          {photo === null ? (
            <Fragment>
              <button onClick={takePhoto} className={styles.capture}>
                <Icon name="photo" circular inverted />
              </button>
              <button onClick={closeModal} className={styles.cancel}>
                <Icon name="arrow left" inverted />
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <img className={styles.video} src={URL.createObjectURL(photo)} alt="" />
              <button onClick={acceptPhoto} className={styles.capture}>
                <Icon name="check" circular inverted />
              </button>
              <button onClick={resetPhoto} className={styles.cancel}>
                <Icon name="redo" inverted />
              </button>
            </Fragment>
          )}
        </div>
      </div>
    )
  },
)
