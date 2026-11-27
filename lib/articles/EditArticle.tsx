import { ArticleFormValues } from "@/validation/article/ArticleSchema"

type EditArticleInput = ArticleFormValues & {
    updatedAt:string
}
const EditArticle = async (id:string,data:EditArticleInput) => {
    const response = await fetch(`http://localhost:2004/articles/${id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("記事更新に失敗しました。")
    }
}

export default EditArticle