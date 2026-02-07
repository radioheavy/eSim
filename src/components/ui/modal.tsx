'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-black/50 border-3 border-black bg-white p-0 max-w-lg w-full"
    >
      <div className="flex items-center justify-between p-4 border-b-3 border-black">
        <h2 className="font-black text-lg uppercase">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
