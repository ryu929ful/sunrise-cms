"use client"

import ArticleEdit from "@/features/article/component/ArticleEdit"
import { Suspense } from "react"

const page = () => {
  return (
    <Suspense>
      <ArticleEdit />
    </Suspense>
  )
}

export default page