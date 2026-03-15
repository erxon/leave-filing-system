import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

function LoadingButton({ action }: { action: string }) {
  return (
    <div className="flex items-center gap-2">
      <Spinner /> <p>{action}</p>
    </div>
  )
}

export default function DeleteAlert({
  title,
  description,
  action,
  cancel,
  onAction,
  open,
  setOpen,
  loading,
}: {
  title: string
  description: string
  action: string
  cancel: string
  onAction: () => void
  open: boolean
  setOpen: (open: boolean) => void
  loading: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={onAction}>
            {loading ? <LoadingButton action={action} /> : action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
