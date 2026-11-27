import React from 'react'

const DeleteCategory = async (id:string) => {
    const response = await fetch(`http://localhost:2004/categories/${id}`,{
        method:"DELETE"
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("カテゴリ削除に失敗しました。")
    }
}

export default DeleteCategory