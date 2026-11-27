import Loading from '@/components/Loading'
import Notice from '@/components/Notice'
import PageTitle from '@/components/PageTitle'
import fetchCategoryList from '@/lib/categories/fetchCategoryList'
import fetchTagList from '@/lib/tags/fetchTagList'
import { Articles } from '@/types/articleTypes'
import { Categories } from '@/types/categoryTypes'
import { ArticleFormValues, articleSchema } from '@/validation/article/ArticleSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import  useSWR  from "swr"
import ArticleBasicField from './ArticleBasicField'
import ArticleSettingField from './ArticleSettingField'
import AddButton from '@/components/AddButton'
import EditArticle from '@/lib/articles/EditArticle'
import CreateArticle, { ArticleInput } from '@/lib/articles/CreateArticle'
import { useRouter } from 'next/navigation'

type Props = {
    isEdit:boolean,
    editValue?:Articles
}

const ArticleCreate = ({isEdit,editValue}:Props) => {
    const [notice, setNotice] = useState({
    open: false,
    message: "",
    status: "success" as "success" | "error" | "warning" | "info",
    });
    const [load,setLoad] = useState<boolean>(false)
    const {
        data:categoryList,
        isLoading:categoryLoad,
        error:categoryError,
    } = useSWR<Categories[]>("categories/",fetchCategoryList)
    const {
        data:tagList,
        isLoading:tagLoad,
        error:tagError,
    } = useSWR<Categories[]>("tags/",fetchTagList)
    const router = useRouter()
    const defaultValues:ArticleFormValues = {
    title: "",
    slug: "",
    content: "",
    categoryIds:[],
    tagIds:[],
    description: "",
    thumbnailId:null,
    status:"draft",
    }
    const methods = useForm<ArticleFormValues>({
        mode:"onBlur",
        resolver:zodResolver(articleSchema),
        defaultValues:isEdit ? editValue : defaultValues
    })
    useEffect(() => {
        if(isEdit && editValue){
            methods.reset(editValue)
        }
    },[isEdit,editValue])
    if(categoryLoad || tagLoad){
        return(
            <Loading />
        )
    }
    if(categoryError || tagError){
        <Alert severity='error'>データの取得に失敗しました</Alert>
    }
    const onSubmit = async (data:ArticleFormValues) => {
        const now = new Date().toISOString()
        const postParam:ArticleInput = {
            ...data,
            publishedAt:data.status === "published" ? new Date().toISOString() : null,
            thumbnail:null,
            createdAt:now,
            updatedAt:now
        }
        const editParam = {
            ...data,
            updatedAt:now
        }
        try{
            setLoad(true)
            if(isEdit && editValue){
                await EditArticle(editValue.id,editParam)
                setNotice({
                open:true,
                message:"記事の更新に成功しました",
                status:"success"
            })
            router.push("/admin/articles")
            } else {
                await CreateArticle(postParam)
            }
            setNotice({
                open:true,
                message:"記事のアップロードに成功しました",
                status:"success"
            })
            router.push("/admin/articles")
        } catch(err) {
            setNotice({
                open:true,
                message:"記事のアップロードに失敗しました。",
                status:"error"
            })
            console.error(err)
        } finally {
            setLoad(false)

        }
    }
    if(!categoryList || !tagList){
        return(
            <Loading />
        )
    }
    if(load){
        return (
            <Loading />
        )
    }
  return (
    <FormProvider {...methods}>
        <PageTitle title="記事を登録" subTitle="記事の情報を入力して保存します。" />
    <Notice
    open={notice.open}
    setOpen={(open) =>
    setNotice((prev) => ({
        ...prev,
        open: typeof open === "function" ? open(prev.open) : open,
    }))
    }
    message={notice.message}
    status={notice.status}
    />
    <Box component={"form"} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack direction={"row"} spacing={2} sx={{mt:4}}>
            <Box sx={{
                flex:1
            }}>
                <ArticleBasicField categoryList={categoryList} tagList={tagList}/>
            </Box>
            <Box sx={{
                flex:.5
            }}>
                <ArticleSettingField />
            </Box>
        </Stack>
                <Box sx={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"right",
                    gap:2,
                    mt:2
                }}>
                <Button type="submit" variant="outlined" size="large">
                    {isEdit ? ("下書き保存（更新）") : ("下書き保存")}
                </Button>
                <AddButton name="保存して公開"/>
                </Box>
    </Box>
    </FormProvider>
  )
}

export default ArticleCreate