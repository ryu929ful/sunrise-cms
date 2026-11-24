
const fetchMediaList = async () => {
    const response = await fetch("http://localhost:2004/media")
    await new Promise((resolve) => setTimeout(resolve,2000))
    if(!response.ok){
        throw new Error("画像一覧読み込みに失敗しました")
    }
    const data = await response.json()

    return data

}

export default fetchMediaList