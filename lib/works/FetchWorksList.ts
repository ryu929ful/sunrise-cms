
const FetchWorksList = async () => {
  const response = await fetch("http://localhost:2004/works")
  await new Promise((resolve) => setTimeout(resolve,2000))
  if(!response.ok){
    throw new Error("制作実績一覧が取得できませんでした")
  }
  const data = await response.json()

return data
}

export default FetchWorksList