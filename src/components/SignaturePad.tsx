import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'

export interface SignaturePadHandle {
  isEmpty: () => boolean
  clear: () => void
  toBlob: () => Promise<Blob | null>
  toDataUrl: () => string | null
}

interface SignaturePadProps {
  width?: number
  height?: number
  onChange?: (hasInk: boolean) => void
}

const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  { width = 600, height = 180, onChange },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.2
    ctx.strokeStyle = '#2a2522'
  }, [width, height])

  function pointFromEvent(e: PointerEvent | React.PointerEvent): { x: number; y: number } {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawingRef.current = true
    lastPointRef.current = pointFromEvent(e)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const last = lastPointRef.current
    if (!ctx || !last) return
    const p = pointFromEvent(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastPointRef.current = p
    if (!hasInk) {
      setHasInk(true)
      onChange?.(true)
    }
  }

  function onPointerUp() {
    drawingRef.current = false
    lastPointRef.current = null
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.2
    ctx.strokeStyle = '#2a2522'
    setHasInk(false)
    onChange?.(false)
  }

  useImperativeHandle(ref, () => ({
    isEmpty: () => !hasInk,
    clear,
    toBlob: () =>
      new Promise((resolve) => {
        const canvas = canvasRef.current
        if (!canvas || !hasInk) return resolve(null)
        canvas.toBlob((b) => resolve(b), 'image/png')
      }),
    toDataUrl: () => (hasInk ? canvasRef.current?.toDataURL('image/png') ?? null : null),
  }))

  return (
    <div>
      <div className="rounded-2xl border-2 border-mud-800 bg-white p-2">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          className="block w-full touch-none cursor-crosshair rounded-xl"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-mud-600">
        <span>{hasInk ? 'Looks good. Sign anywhere on the box.' : 'Sign with your finger or mouse.'}</span>
        <button type="button" onClick={clear} className="underline hover:text-mud-800">
          Clear
        </button>
      </div>
    </div>
  )
})

export default SignaturePad
