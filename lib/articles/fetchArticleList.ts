
const fetchArticleList = async () => {
    const response = await fetch("http://localhost:2004/articles")
    await new Promise((resolve) => setTimeout(resolve,2000))
    if(!response.ok){
        throw new Error("記事一覧ページの読み込みに失敗しました")
    }
    const data = await response.json()

    return data
}

export default fetchArticleList