import React from 'react'

const fetchCategoryList = async () => {
    const response = await fetch("http://localhost:2004/categories")
    await new Promise((resolve) => setTimeout(resolve,2000))

    if(!response.ok){
        throw new Error("カテゴリ一覧の取得に失敗しました")
    }
    const data = await response.json()
  return data
}

export default fetchCategoryList