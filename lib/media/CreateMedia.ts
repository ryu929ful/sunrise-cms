import { Media } from '@/types/MediaTypes'
import React from 'react'

type MediaInputValue = Omit<Media,"id">

const CreateMedia = async (media:MediaInputValue) => {
  const response = await fetch("http://localhost:2004/media",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(media)
  })
  await new Promise((resolve) => setTimeout(resolve,500))
  if(!response.ok){
    throw new Error("メディアアップロードにっ失敗しました")
  }
}

export default CreateMedia