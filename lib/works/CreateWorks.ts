import { Works } from '@/types/worksTypes'

export type WorkFormInput = Omit<Works,"id">

const CreateWorks = async (data:WorkFormInput) => {
    const response = await fetch("http://localhost:2004/works",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("制作実績の投稿に失敗しました")
    }
}

export default CreateWorks