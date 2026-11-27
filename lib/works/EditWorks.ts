import { Works } from '@/types/worksTypes'
import { WorksFormValues } from '@/validation/works/WorksSchema';
type EditWorksParams = WorksFormValues & {
    updatedAt: string;
};

const EditWorks =　async (id: string,data: EditWorksParams) => {
    console.log("更新データ",data)
    const response = await fetch(`http://localhost:2004/works/${id}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    await new Promise((resolve) => setTimeout(resolve,500))
    if(!response.ok){
        throw new Error("制作実績の更新に失敗しました")
    }
}

export default EditWorks