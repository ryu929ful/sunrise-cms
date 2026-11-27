import { Articles } from "@/types/articleTypes"

export type ArticleInput = Omit<Articles,"id">

const CreateArticle = async (data:ArticleInput) => {
    const response = await fetch("http://localhost:2004/articles",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("記事の投稿に失敗しました。")
    }
}

export default CreateArticle