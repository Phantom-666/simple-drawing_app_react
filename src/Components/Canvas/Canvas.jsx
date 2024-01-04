import { useRef, useState } from "react"
import "./Canvas.css"

const Canvas = ({ ...rest }) => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [cursorColor, setCursorColor] = useState("#000000")
  const [lineSize, setLineSize] = useState(10)
  const ref = useRef()
  const imageInputRef = useRef()

  const mouseUp = () => {
    setIsMouseDown(false)

    ref.current.getContext("2d").beginPath()
  }

  const draw = (e) => {
    const canvas = ref.current
    const context = canvas.getContext("2d")
    context.lineWidth = lineSize * 2
    context.fillStyle = cursorColor
    context.strokeStyle = cursorColor

    const rect = canvas.getBoundingClientRect()

    if (isMouseDown) {
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top)
      context.stroke()

      context.beginPath()
      context.arc(
        e.clientX - rect.left,
        e.clientY - rect.top,
        lineSize,
        0,
        Math.PI * 2
      )
      context.fill()

      context.beginPath()
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  const colorEventListener = (e) => {
    setCursorColor(e.target.value)
  }
  const changeSize = (e) => {
    setLineSize(e.target.value)
  }
  const clearCanvas = () => {
    const canvas = ref.current
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
  }
  const loadImage = () => {
    const image = new Image()
    const imageInput = imageInputRef.current
    const canvas = ref.current
    const context = canvas.getContext("2d")

    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader()

      reader.onload = function (e) {
        image.src = e.target.result
        image.onload = function () {
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
        }
      }

      reader.readAsDataURL(imageInput.files[0])
    }

    // context.globalAlpha = 1.0
  }

  return (
    <>
      <div className="row">
        <div className="col s12">
          <div className="input-field col s1">
            <input
              onInput={(e) => colorEventListener(e)}
              type="color"
              id="colorPicker"
            />
          </div>
          <div className="col s4">
            <input
              defaultValue={lineSize}
              type="range"
              id="test5"
              min="0"
              max="100"
              onChange={(e) => changeSize(e)}
            />
            {lineSize}
          </div>
          <span className="col s1 input-field">
            <button className="btn" onClick={clearCanvas}>
              Clear
            </button>
          </span>
          <input
            className="input-field col s1"
            type="file"
            id="imageInput"
            accept="image/*"
            ref={imageInputRef}
          ></input>
          <button className="btn input-field col s1" onClick={loadImage}>
            Add Image
          </button>
          <div className="col s4">
            <h5>Simple drawing app in react</h5>
          </div>
        </div>

        <canvas
          className="canvas os s12 "
          onMouseUp={mouseUp}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseMove={(e) => draw(e)}
          ref={ref}
          {...rest}
        ></canvas>
      </div>
    </>
  )
}

export default Canvas
