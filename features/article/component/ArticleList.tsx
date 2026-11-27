import AddButton from "@/components/AddButton"
import Loading from "@/components/Loading"
import PageTitle from "@/components/PageTitle"
import fetchArticleList from "@/lib/articles/fetchArticleList"
import fetchCategoryList from "@/lib/categories/fetchCategoryList"
import fetchTagList from "@/lib/tags/fetchTagList"
import { Alert, Box, Stack } from "@mui/material"
import useSWR from "swr"
import ArticleListField from "./ArticleListField"
import { Articles } from "@/types/articleTypes"
import { Tags } from "@/types/tagTypes"
import { Categories } from "@/types/categoryTypes"

const ArticleList = () => {
  const {
    data:articleList,
    isLoading:ArticleLoading,
    error:articleError,
    mutate:articleMutate,
    mutate
  } = useSWR<Articles[]>("article/",fetchArticleList)
  const {
    data:CategoryList,
    error:categoryError,
    isLoading:CategoryLoading,
    mutate:categoryMutate
  } = useSWR<Categories[]>("categories/",fetchCategoryList)
  const {
    data:tagsList,
    error:tagsError,
    mutate:tagsMutate,
    isLoading:tagsLoading
  } = useSWR<Tags[]>("tags/",fetchTagList)
  if(ArticleLoading || CategoryLoading || tagsLoading){
    return (
      <Loading />
    )
  }
  if (!articleList || !CategoryList || !tagsList) {
    return <Loading />;
}
  if(tagsError || categoryError || articleError){
    return (
      <Alert severity="error">記事読み込みに異常が発生しました</Alert>
    )
  }
      if(!ArticleLoading && !CategoryLoading && !tagsLoading){
    return (
      <Stack spacing={4}>
            <Box sx={{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between"
            }}>
                <PageTitle title="記事一覧" subTitle="記事の登録・検索・公開状態を管理します。" />
                <AddButton name="新規登録" href='/admin/articles/new'/>
            </Box>
              <ArticleListField mutate={mutate} articleList={articleList} CategoryList={CategoryList} tagsList={tagsList}/>
      </Stack>
    )
  }
}

export default ArticleList