
const DeleteWorks = async (id:string) => {
    const response = await fetch(`http://localhost:2004/works/${id}`,{
        method:"DELETE"
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("制作実績の削除に失敗しました")
    }
}

export default DeleteWorks