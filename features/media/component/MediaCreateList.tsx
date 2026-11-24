import AddButton from '@/components/AddButton'
import MediaArea from '@/components/MediaArea'
import PageTitle from '@/components/PageTitle'
import fetchMediaList from '@/lib/media/fetchMediaList'
import { MediaFormValues, MediaSchema } from '@/validation/media/MediaSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, List, ListItem, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add';
import useSWR from "swr"
import { useState } from 'react'
import CreateMedia from '@/lib/media/CreateMedia'
import Loading from '@/components/Loading'
import { Media } from '@/types/MediaTypes'

const MediaCreateList = () => {
  const {data:mediaList,error,isLoading,mutate} = useSWR<Media[]>("media/",fetchMediaList)
  const [load,setLoad] = useState<boolean>(false)
  console.log(mediaList)
  const methods = useForm<MediaFormValues>({
    mode:"onBlur",
    resolver:zodResolver(MediaSchema),
    defaultValues:{
      file:undefined
    }
  })
  const onSubmit = (data:MediaFormValues) => {
    if(!(data.file instanceof File)){
      console.error("画像ファイルを登録してください")
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result
      if(typeof base64 !== "string") return
      try {
        setLoad(true)
        await CreateMedia({
            fileName: data.file.name,
            url: base64,
            mimeType: data.file.type,
            size: data.file.size,
            createdAt: new Date().toLocaleDateString("ja-JP"),
        })

        await new Promise((resolve) => setTimeout(resolve,500))
        console.log("登録完了")
        await mutate()
        methods.reset()
      } catch(err) {
        console.error(err)
      }
      finally{
        setLoad(false)
      }
    }

    reader.readAsDataURL(data.file)
  }
  if(isLoading){
    return (
      <Loading />
    )
  }
  if(!isLoading){
    return(
      <Box component={"form"} onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Box sx={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between"
    }}>
        <PageTitle title="メディア管理" subTitle="画像ファイルをアップロード・管理できます。" />
        <Button
          type='submit' 
          size='large'
          sx={{
              bgcolor:"#4354DC",
              color:"white",
              width:155,
              mr:"40px"
          }}>
              <AddIcon sx={{mr:1}}/>
              アップロード
          </Button>
    </Box>
    <Box sx={{mt:3}}>
      <MediaArea />
    </Box>
    <List
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    flexWrap: "wrap",
    gap: 2,
  }}
>
  {mediaList?.map((item) => (
    <ListItem
      key={item.id}
      sx={{
        width: 227,
        p: 0,
        display: "block",
      }}
    >
      <Stack direction="column" spacing={1}>
        <Box
          component="img"
          src={item.url}
          alt={item.fileName}
          sx={{
            width: "100%",
            height: 139,
            objectFit: "cover",
            borderRadius: 2,
            display: "block",
          }}
        />

        <Typography
          sx={{
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.fileName}
        </Typography>
      </Stack>
    </ListItem>
  ))}
</List>
      </FormProvider>
      </Box>
  
    )
  }
}

export default MediaCreateList