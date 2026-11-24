import { WorksFormValues, worksSchema } from "@/validation/works/WorksSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Stack } from "@mui/material"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import WorksBasicField from "./WorksBasicField"
import WorksSettingField from "./WorksSettingField"
import PageTitle from "@/components/PageTitle"
import fetchTechnologyList from "@/lib/technology/fetchTechnologyList"
import  useSWR  from "swr"
import { Technologies } from "@/types/technologyTypes"
import Loading from "@/components/Loading"
import AddButton from "@/components/AddButton"

type Props = {
    isEdit?:string,
    editValue?:WorksFormValues
}

const WorksCreate = ({isEdit,editValue}:Props) => {
    const {data:technologiesList,isLoading,error} = useSWR<Technologies[]>("/technologies",fetchTechnologyList)

    const defaultValues:WorksFormValues = {
        title: "",
        slug: "",
        description: "",
        content: "",
        technologyIds: [""],
        thumbnailId: null,
        githubUrl: null,
        demoUrl: null,
        status: "draft",
    }
    const methods = useForm<WorksFormValues>({
        mode:"onBlur",
        resolver:zodResolver(worksSchema),
        defaultValues:defaultValues,
    })
    const onSubmit = (data:WorksFormValues) => {
        console.log(data)
    }
    useEffect(() => {
        if(isEdit && editValue){
            methods.reset(editValue)
        }
    },[methods.reset,isEdit,editValue])
    if(!technologiesList) return
    if(isLoading){
        return (
            <Loading />
        )
    }
  return (
    <FormProvider {...methods}>
        <PageTitle title="製作実績を登録" subTitle="制作実績を入力して保存します。" />
    <Box 
    component={"form"}
    onSubmit={methods.handleSubmit(onSubmit)}
    >
        <Stack direction="row" spacing={2} sx={{mt:4}}>
            <Box sx={{
                flex:1
            }}>
            <WorksBasicField technologiesList={technologiesList}/>
            </Box>
            <Box sx={{
                flex:.5
            }}>
            <WorksSettingField />
            </Box>
        </Stack>
        <Box sx={{
            display:"flex",
            alignItems:"center",
            justifyContent:"right",
            gap:2,
            mt:2
        }}>
        <Button type="submit" variant="outlined" size="large">
            下書き保存
        </Button>
        <AddButton name="保存して公開"/>
        </Box>
    </Box>
    </FormProvider>
  )
}

export default WorksCreate