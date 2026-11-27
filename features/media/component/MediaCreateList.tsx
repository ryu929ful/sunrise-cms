import MediaArea from '@/components/MediaArea'
import PageTitle from '@/components/PageTitle'
import fetchMediaList from '@/lib/media/fetchMediaList'
import { MediaFormValues, MediaSchema } from '@/validation/media/MediaSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, IconButton, List, ListItem, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import AddIcon from '@mui/icons-material/Add';
import useSWR from "swr"
import { useState } from 'react'
import CreateMedia from '@/lib/media/CreateMedia'
import Loading from '@/components/Loading'
import { Media } from '@/types/MediaTypes'
import DeleteMedia from '@/lib/media/DeleteMedia'
import Notice from '@/components/Notice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MediaCreateList = () => {
  const {data:mediaList,isLoading,mutate} = useSWR<Media[]>("media/",fetchMediaList)
  const [load,setLoad] = useState<boolean>(false)
  const [notice, setNotice] = useState({
  open: false,
  message: "",
  status: "success" as "success" | "error" | "warning" | "info",
});
  console.log(mediaList)
  const methods = useForm<MediaFormValues>({
    mode:"onBlur",
    resolver:zodResolver(MediaSchema),
    defaultValues:{
      file:undefined
    }
  })
  const handleRemove = async (id:string) => {
    const ok = window.confirm("画像を削除しますか？")
    if(!ok) return
    try{
      setLoad(true)
      await DeleteMedia(id)
      await mutate()
              // 動作確認用：1秒待機
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
      setNotice({
        open: true,
        message: "画像を削除しました",
        status: "success",
      });
    } catch (err){
      setNotice({
        open: true,
        message: "画像の削除に失敗しました",
        status: "error",
      });
      console.error(err)
    } finally {
        setLoad(false)
      
    }
  }
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
        setNotice({
          open: true,
          message: "画像のアップロードが完了しました",
          status: "success",
      });
      } catch(err) {
        console.error(err)
      }
      finally{
        setLoad(false)
      }
    }
    reader.readAsDataURL(data.file)
  }
  if(isLoading || load){
    return (
      <Loading />
    )
  }
  if(!isLoading){
    return(
      <Box component={"form"} onSubmit={methods.handleSubmit(onSubmit)}>
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
      <Stack direction="column" spacing={1}　sx={{
        position:"relative"
      }}>
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
        <IconButton
        sx={{
          position: "absolute",
          top: -8,
          right: 0,
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": {
            bgcolor: "#fff",
          },
        }}
        color='error' onClick={() => handleRemove(item.id)}>
          <HighlightOffIcon />
        </IconButton>
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