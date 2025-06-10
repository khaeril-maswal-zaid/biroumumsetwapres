"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  backUrl: string
}

export function PageHeader({ title, backUrl }: PageHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Link href={backUrl}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  )
}
