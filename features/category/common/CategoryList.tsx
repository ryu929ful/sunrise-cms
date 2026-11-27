import Loading from '@/components/Loading'
import fetchCategoryList from '@/lib/categories/fetchCategoryList'
import { Alert, Box, Stack } from '@mui/material'
import React from 'react'
import useSWR from 'swr'
import CategoryListField from './CategoryListField'
import PageTitle from '@/components/PageTitle'
import AddButton from '@/components/AddButton'


const CategoryList = () => {
    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR("category/",fetchCategoryList)
    if(isLoading){
        return(
            <Loading />
        )
    }
    if(error){
        <Alert severity='error'>カテゴリ一覧が取得できませんでした。</Alert>
    }
    if(!data){
        return(
            <Loading />
        )
    }
  return (
    <Stack spacing={4}>
    <Box sx={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between"
    }}>
        <PageTitle title="タグ管理" subTitle="記事や制作実績に付与するタグを管理します" />
        <AddButton name="新規登録" href='/admin/categories/new'/>
    </Box>
    <CategoryListField mutate={mutate} categoryList={data}/>
</Stack>
  )
}

export default CategoryList