"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sparkles } from "@react-three/drei"
import * as THREE from "three"

function ThoughtCore() {
  const groupRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15 - 0.2
    }

    if (shellRef.current) {
      shellRef.current.rotation.x = Math.sin(t * 0.35) * 0.08
      shellRef.current.rotation.z = Math.cos(t * 0.3) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.7, 3]} />
        <meshStandardMaterial
          color="#250404"
          emissive="#3a0808"
          emissiveIntensity={1}
          roughness={0.7}
          metalness={0.15}
          transparent
          opacity={0.96}
        />
      </mesh>

      <mesh ref={shellRef} scale={1.2}>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshStandardMaterial
          color="#ff6b57"
          emissive="#ff4d33"
          emissiveIntensity={0.18}
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      <mesh position={[0.32, 0.5, 1.1]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshBasicMaterial color="#ff2d20" />
      </mesh>
    </group>
  )
}

function ThoughtOrbitals() {
  const groupRef = useRef<THREE.Group>(null)
  const orbitals = useMemo(
    () => [
      { radius: 3.9, speed: 0.55, size: 0.38, color: "#d57ca3", offset: 0.2 },
      { radius: 3.1, speed: -0.8, size: 0.26, color: "#8fd17f", offset: 1.7 },
      { radius: 2.55, speed: 1.15, size: 0.54, color: "#6db7e5", offset: 3.1 },
      { radius: 4.6, speed: 0.4, size: 0.28, color: "#d6b250", offset: 4.7 },
      { radius: 5.9, speed: -0.3, size: 0.44, color: "#ae74d4", offset: 5.5 },
    ],
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {orbitals.map((orbital, index) => (
        <group key={index}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbital.radius, 0.01, 6, 80]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
          </mesh>

          <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.45}>
            <AnimatedOrbital {...orbital} />
          </Float>
        </group>
      ))}
    </group>
  )
}

function AnimatedOrbital({
  radius,
  speed,
  size,
  color,
  offset,
}: {
  radius: number
  speed: number
  size: number
  color: string
  offset: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return

    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.y = Math.sin(t * 1.4) * 0.45
    ref.current.position.z = Math.sin(t) * radius * 0.35
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.012
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
    </mesh>
  )
}

function Starfield() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 420

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18
    }
    return pos
  }, [])

  const colors = useMemo(() => {
    const palette = [
      new THREE.Color("#f5d8a8"),
      new THREE.Color("#d8c3ff"),
      new THREE.Color("#ffd27a"),
      new THREE.Color("#fff1d6"),
    ]
    const values = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)]
      values[i * 3] = color.r
      values[i * 3 + 1] = color.g
      values[i * 3 + 2] = color.b
    }
    return values
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function CometTrails() {
  const comets = useMemo(
    () => [
      { start: [-7, 1.9, -3] as [number, number, number], color: "#ffbf66", speed: 0.26 },
      { start: [6, -0.2, -2] as [number, number, number], color: "#ff89a6", speed: 0.2 },
    ],
    []
  )

  return (
    <>
      {comets.map((comet, index) => (
        <MovingComet key={index} {...comet} />
      ))}
    </>
  )
}

function MovingComet({
  start,
  color,
  speed,
}: {
  start: [number, number, number]
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return

    const t = (state.clock.elapsedTime * speed) % 1
    ref.current.position.x = start[0] + t * 14
    ref.current.position.y = start[1] - t * 4
    ref.current.position.z = start[2] + t * 2
  })

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[-0.38, 0.12, -0.02]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.72, 0.05, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#f7eedf", 8, 18]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff1db" />
      <pointLight position={[-4, 2, 3]} intensity={1.6} color="#ff7f5f" />
      <pointLight position={[5, -1, 4]} intensity={1} color="#8c78ff" />

      <Starfield />
      <ThoughtCore />
      <ThoughtOrbitals />
      <CometTrails />

      <Sparkles count={80} size={2.6} scale={[12, 7, 10]} speed={0.45} color="#ffde87" />
    </>
  )
}

export function ThreeScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0.2, 8.5], fov: 44 }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
        <Scene />
      </Canvas>
    </div>
  )
}
