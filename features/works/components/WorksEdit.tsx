import React from 'react'
import WorksCreate from './WorksCreate'
import { useSearchParams } from 'next/navigation'
import  useSWR  from 'swr'
import FetchWorksList from '@/lib/works/FetchWorksList'
import { Works } from '@/types/worksTypes'
import Loading from '@/components/Loading'

const WorksEdit = () => {
    const {data,error,isLoading} = useSWR<Works[]>("works/",FetchWorksList)
    const param = useSearchParams()
    const targetId = param.get("id")
    const targetData = data?.find((item) => {
        return item.id === targetId
    })
    if(isLoading){
        return(
            <Loading />
        )
    }
    return (
        <WorksCreate editValue={targetData} isEdit={true}/>
    )
}

export default WorksEdit