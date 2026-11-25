import { WorksFormValues, worksSchema } from "@/validation/works/WorksSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import WorksBasicField from "./WorksBasicField"
import WorksSettingField from "./WorksSettingField"
import PageTitle from "@/components/PageTitle"
import fetchTechnologyList from "@/lib/technology/fetchTechnologyList"
import  useSWR  from "swr"
import { Technologies } from "@/types/technologyTypes"
import Loading from "@/components/Loading"
import AddButton from "@/components/AddButton"
import CreateWorks, { WorkFormInput } from "@/lib/works/CreateWorks"
import Notice from "@/components/Notice"

type Props = {
    isEdit?:string,
    editValue?:WorksFormValues
}

const WorksCreate = ({isEdit,editValue}:Props) => {
    const {data:technologiesList,isLoading,error,mutate} = useSWR<Technologies[]>("/technologies",fetchTechnologyList)
    const [load,setLoad] = useState<boolean>(false)
      const [notice, setNotice] = useState({
      open: false,
      message: "",
      status: "success" as "success" | "error" | "warning" | "info",
    });
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
    const onSubmit = async (data:WorksFormValues) => {
        console.log(data)
        const now = new Date().toISOString()
        const postParam:WorkFormInput = {
            ...data,
            thumbnail:null,
            createdAt: now,
            updatedAt: now,
        }
        console.log("送信パラメタ",postParam)

        try {
            await CreateWorks(postParam)
            setLoad(true)
            setNotice({
            open: true,
            message: "制作実績のアップロードが完了しました。",
            status: "success",
        });
            window.location.reload()
        } catch(err){
            setNotice({
            open: true,
            message: "制作実績のアップロードに失敗しました。",
            status: "error",
        });
        console.error(err)
        } finally {
            setLoad(false)
        }
    }
    useEffect(() => {
        if(isEdit && editValue){
            methods.reset(editValue)
        }
    },[methods.reset,isEdit,editValue])
    if(!technologiesList) return
    if(isLoading || load){
        return (
            <Loading />
        )
    }
    if(error){
        <Alert severity="error">データの読み込みに失敗しました</Alert>
    }
  return (
    <FormProvider {...methods}>
        <PageTitle title="製作実績を登録" subTitle="制作実績を入力して保存します。" />
    <Box 
    component={"form"}
    onSubmit={methods.handleSubmit(onSubmit)}
    >
    <Notice
    open={notice.open}
    setOpen={(open) =>
    setNotice((prev) => ({
        ...prev,
        open: typeof open === "function" ? open(prev.open) : open,
    }))
    }
    message={notice.message}
    status={notice.status}
    />
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