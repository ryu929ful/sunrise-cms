import React from 'react'
import ArticleCreate from './ArticleCreate'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Articles } from '@/types/articleTypes'
import fetchArticleList from '@/lib/articles/fetchArticleList'
import Loading from '@/components/Loading'
import { Alert } from '@mui/material'

const ArticleEdit = () => {
    const {data,error,isLoading} = useSWR<Articles[]>("articles/",fetchArticleList)
    const param = useSearchParams()
    const id = param.get("id")
    const editValue = data?.find((item) => {
        return item.id === id
    })
    if(isLoading){
        return (
            <Loading />
        )
    }
    if(error){
        <Alert severity='error'>記事一覧の取得に失敗しました。</Alert>
    }
  return <ArticleCreate isEdit={true} editValue={editValue} />
}

export default ArticleEdit