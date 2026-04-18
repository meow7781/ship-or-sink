"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function FloatingBrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#ff7755"
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 100
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])
  
  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3)
    const palette = [
      [1, 0.5, 0.3],   // coral
      [0.9, 0.7, 0.9], // pink
      [1, 0.9, 0.6],   // yellow
      [0.7, 0.5, 0.9], // purple
    ]
    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)]
      cols[i * 3] = color[0]
      cols[i * 3 + 1] = color[1]
      cols[i * 3 + 2] = color[2]
    }
    return cols
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} />
    </points>
  )
}

function FloatingEmojis() {
  const emojis = ["🧠", "✨", "🔮", "💫", "🌙", "⭐"]
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      {emojis.map((_, i) => {
        const angle = (i / emojis.length) * Math.PI * 2
        const radius = 3
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={0.5}>
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(i) * 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color={["#ff7755", "#ffcc66", "#cc88ff", "#66ccff", "#ff88aa", "#88ff88"][i]}
                emissive={["#ff7755", "#ffcc66", "#cc88ff", "#66ccff", "#ff88aa", "#88ff88"][i]}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff8866" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8866ff" />
      
      <FloatingBrain />
      <FloatingParticles />
      <FloatingEmojis />
      
      <Sparkles
        count={50}
        size={2}
        scale={8}
        speed={0.4}
        color="#ffcc66"
      />
    </>
  )
}

export function ThreeScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
