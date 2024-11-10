"use client"
import React, { useRef, useEffect } from 'react'

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const WIDTH = canvas.width
      const HEIGHT = canvas.height

      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const draw = () => {
        requestAnimationFrame(draw)
        analyser.getByteFrequencyData(dataArray)

        ctx.fillStyle = 'rgb(0, 0, 0)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)

        const barWidth = (WIDTH / bufferLength) * 2.5
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2

          ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
          ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight)

          x += barWidth + 1
        }
      }

      draw()
    }

    animate()

    return () => {
      source.disconnect()
      analyser.disconnect()
      audioContext.close()
    }
  }, [audioRef])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-full" />
}

export default AudioVisualizer