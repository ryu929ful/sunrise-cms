import AddButton from '@/components/AddButton'
import Loading from '@/components/Loading'
import PageTitle from '@/components/PageTitle'
import FetchWorksList from '@/lib/works/FetchWorksList'
import { Alert, Box, Stack, Typography } from '@mui/material'
import useSWR from "swr"
import WorkListField from './WorkListField'
import fetchTechnologyList from '@/lib/technology/fetchTechnologyList'

const WorksList = () => {
    const {data:technologyList,error:techError,isLoading:TechIsLoading} = useSWR("/technologies",fetchTechnologyList)
    const {data:worksList,error,isLoading,mutate} = useSWR("/works",FetchWorksList)
    if(isLoading && TechIsLoading){
        return(
            <Loading />
        )
    }
    if(error || techError){
        return(
            <Alert severity='error'>一覧の読み込みに失敗しました</Alert>
        )
    }
    if(!isLoading && !TechIsLoading){
        return (
        <Stack spacing={4} direction="column">
            <Box sx={{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between"
            }}>
                <PageTitle title="制作実績一覧" subTitle="制作実績の登録・検索・公開状態を管理します。" />
                <AddButton name="新規登録" href='/admin/works/new'/>
            </Box>
            <WorkListField mutate={mutate} worksList={worksList} technologyList={technologyList}/>
        </Stack>
        )
    }
}

export default WorksList