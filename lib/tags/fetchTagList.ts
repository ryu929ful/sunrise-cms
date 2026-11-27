
const fetchTagList = async () => {
    const response = await fetch("http://localhost:2004/tags")
    await new Promise((resolve) => setTimeout(resolve,2000))

    if(!response.ok){
        throw new Error("タグ一覧の取得に失敗しました")
    }
    const data = await response.json()
  return data
}

export default fetchTagList