
const DeleteMedia = async (id:string) => {
    const response = await fetch(`http://localhost:2004/media/${id}`,{
        method:"DELETE",
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("画像の削除に失敗しました。")
    }
}

export default DeleteMedia