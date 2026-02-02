import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

interface SuccessAlertProps {
  message: string
  show: boolean
}

export function SuccessAlert({ message, show }: SuccessAlertProps) {
  if (!show) return null

  return (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">{message}</AlertDescription>
    </Alert>
  )
}
