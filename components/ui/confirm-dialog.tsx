"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./dialog"

import { Button } from "./button"

type ConfirmDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  onConfirm: () => Promise<void> | void
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  children?: React.ReactNode // optional trigger element
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>
          <DialogDescription>
            {description ?? "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            className="ml-2"
            onClick={async () => {
              await onConfirm()
            }}
            disabled={loading}
            variant="destructive"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
