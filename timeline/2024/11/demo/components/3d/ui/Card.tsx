"use client"
import { motion } from 'framer-motion'
import React, { useEffect, useMemo, useRef } from 'react'

const use3DEffect = (isHovering: boolean) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
    }

    card.addEventListener('mousemove', handleMouseMove)
    return () => card.removeEventListener('mousemove', handleMouseMove)
  }, [isHovering])

  const transform = useMemo(() => {
    if (!isHovering) return 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    const card = cardRef.current
    if (!card) return 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

    const { width, height } = card.getBoundingClientRect()
    const centerX = width / 2
    const centerY = height / 2
    const maxRotation = 15
    const maxDepression = 10

    const rotateY = (mousePosition.x - centerX) / centerX * maxRotation
    const rotateX = (centerY - mousePosition.y) / centerY * maxRotation

    const distanceFromCenter = Math.sqrt(
      Math.pow(centerX - mousePosition.x, 2) + Math.pow(centerY - mousePosition.y, 2)
    )
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2))
    const depression = (1 - distanceFromCenter / maxDistance) * maxDepression

    return `perspective(1000px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${-depression}px) scale3d(1, 1, 1)
    `
  }, [isHovering, mousePosition])

  return { cardRef, transform, setMousePosition }
}

interface A3DCardProps {
  children: React.ReactNode
  enablePerspectiveEffect?: boolean
  enableHoverEffect?: boolean
  className?: string
}
export default function A3DCard(
  { children ,
    enablePerspectiveEffect = true,
    enableHoverEffect = false,
  className=''

  }: A3DCardProps) {
    const [isHovering, setIsHovering] = React.useState(false)
    const [isLeaving, setIsLeaving] = React.useState(false)
    const [isFlipped, setIsFlipped] = React.useState(false)
    const { cardRef, transform, setMousePosition } = use3DEffect(isHovering)

    const handleMouseEnter = () => {
      setIsHovering(true)
      setIsLeaving(false)
    }
    
    const handleMouseLeave = () => {
      setIsLeaving(true)
      
      setTimeout(() => {
        setIsHovering(false)
        setIsLeaving(false)
        setMousePosition({ x: 0, y: 0 })
      }, 100)
    }

    const handleCardClick = () => {
      if (enableHoverEffect) {
        setIsFlipped(!isFlipped)
      }
    }
  return (
    <motion.div
    className={` cursor-pointer relative transition-all duration-100 ${className}`}
    style={{
      willChange: 'transform',
      transformOrigin: 'center',
    } as React.CSSProperties}
    onClick={handleCardClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    ref={cardRef}
    animate={{
      width: 'var(--card-width)',
      transform: isFlipped ? `${transform} rotateY(180deg)` : transform,
    }}
    transition={{duration: 0.3}}
    >
      {children}
    </motion.div>
  )
}
