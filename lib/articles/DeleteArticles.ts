
const DeleteArticles = async (id:string) => {
    const response = await fetch(`http://localhost:2004/articles/${id}`,{
        method:"DELETE"
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("記事の削除に失敗しました")
    }
}

export default DeleteArticles