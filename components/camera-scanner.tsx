"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Camera, Scan, Zap } from "lucide-react"
import type { Product } from "@/lib/types"

interface CameraScannerProps {
  onProductDetected: (product: Product) => void
  products: Product[]
}

export function CameraScanner({ onProductDetected, products }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastDetection, setLastDetection] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 640, height: 480 },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraError(null)
      } catch (err) {
        console.error("Camera access denied:", err)
        setCameraError("Camera access denied. Please allow camera permissions.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Simulate AI product detection
  const simulateDetection = useCallback(() => {
    if (products.length === 0) return

    setIsScanning(true)

    // Simulate random product detection after 2-4 seconds
    const delay = 2000 + Math.random() * 2000

    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setLastDetection(randomProduct.name)
      onProductDetected(randomProduct)
      setIsScanning(false)

      // Clear detection message after 2 seconds
      setTimeout(() => setLastDetection(null), 2000)
    }, delay)
  }, [products, onProductDetected])

  useEffect(() => {
    // Continuously simulate detection every 5-8 seconds
    const interval = setInterval(
      () => {
        if (!isScanning && products.length > 0) {
          simulateDetection()
        }
      },
      5000 + Math.random() * 3000,
    )

    return () => clearInterval(interval)
  }, [isScanning, products, simulateDetection])

  return (
    <Card className="glass neon-border-cyan overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${isScanning ? "bg-primary animate-pulse" : "bg-neon-green"}`} />
        <span className="text-sm font-medium text-foreground">{isScanning ? "Scanning..." : "Ready"}</span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="glass px-3 py-1 rounded-full flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-xs text-foreground">AI Active</span>
        </div>
      </div>

      <div className="relative aspect-video bg-secondary/30">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <Camera className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">{cameraError}</p>
            <p className="text-center text-sm text-primary">Demo mode: Products will be detected automatically</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}

        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary" />

          {/* Scanning line */}
          {isScanning && (
            <div className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scan-animation" />
          )}
        </div>

        {/* Detection notification */}
        {lastDetection && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-xl neon-glow-cyan pulse-detected">
            <div className="flex items-center gap-3">
              <Scan className="h-5 w-5 text-neon-green" />
              <span className="font-medium text-foreground">Detected: {lastDetection}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          Place products in front of the camera for automatic scanning
        </p>
      </div>
    </Card>
  )
}
