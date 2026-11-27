"use client"

import WorksEdit from "@/features/works/components/WorksEdit"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense>
        <WorksEdit />
    </Suspense>
  )
}

export default page