import { Categories } from '@/types/categoryTypes'
type CategoryInput = Omit<Categories,"id">

const CreateCategories = async (data:CategoryInput) => {
    const response = await fetch("http://localhost:2004/categories",{
        method:"POST",
        headers:{
            "Content-Type":"application/jSon"
        },
        body:JSON.stringify(data)
    })
    if(!response.ok){
        throw new Error("カテゴリの追加に失敗しました。")
    }
}

export default CreateCategories