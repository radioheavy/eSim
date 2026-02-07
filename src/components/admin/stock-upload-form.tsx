'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
interface StockUploadFormProps {
  packages: { id: string; name: string }[]
}

export function StockUploadForm({ packages }: StockUploadFormProps) {
  const { addToast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    setFiles((prev) => [...prev, ...dropped])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) =>
        f.type.startsWith('image/')
      )
      setFiles((prev) => [...prev, ...selected])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (!selectedPackage || files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('package_id', selectedPackage)

        const res = await fetch('/api/stock/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Upload failed')
        }

        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      addToast(`${files.length} QR kod başarıyla yüklendi`, 'success')
      setFiles([])
      setProgress(0)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Yükleme hatası', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Select
        id="package_select"
        label="Paket Seç"
        value={selectedPackage}
        onChange={(e) => setSelectedPackage(e.target.value)}
        placeholder="Paket seçin..."
        options={packages.map((p) => ({ value: p.id, label: p.name }))}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-black p-12 text-center cursor-pointer hover:bg-[#FFFDE6] transition-colors"
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="font-black text-lg uppercase">Sürükle & Bırak</p>
        <p className="text-sm text-gray-500 mt-1">veya tıklayarak dosya seçin</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="border-3 border-black divide-y-2 divide-gray-200">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2">
              <ImageIcon size={16} className="text-gray-400 shrink-0" />
              <span className="font-bold text-sm flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
              <button
                onClick={() => removeFile(i)}
                className="p-1 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="border-3 border-black overflow-hidden">
          <div
            className="h-6 bg-[#FFE500] transition-all duration-300 flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            <span className="font-black text-xs">{progress}%</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedPackage || files.length === 0 || uploading}
        size="lg"
        className="w-full"
      >
        {uploading ? 'Yükleniyor...' : `${files.length} DOSYA YÜKLE`}
      </Button>
    </div>
  )
}
