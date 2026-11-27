import { WorksFormValues } from '@/validation/works/WorksSchema'
import { Alert, Box, Button, FormHelperText, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import {status} from "../../../lib/status/status"
import { useState } from 'react'
import MediaDialogSelect from '@/components/MediaDialogSelect'
import { Media } from '@/types/MediaTypes'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import fetchMediaList from '@/lib/media/fetchMediaList'
import useSWR from 'swr'
import Loading from '@/components/Loading'

const WorksSettingField = () => {
    console.log(status)
    const {data:mediaList,error,isLoading} = useSWR<Media[]>("media/" ,fetchMediaList)
    const [open,setOpen] = useState<boolean>(false)
    const {control,formState:{errors},setValue,watch} = useFormContext<WorksFormValues>()
    const handleRemove = () => {
        setValue("thumbnailId",null,{
            shouldDirty:true,
            shouldValidate:true
        })
    }
    const thumbnailId = watch("thumbnailId")
    const selectedMedia = mediaList?.find((item) => {
        return item.id === thumbnailId
    })
    if(isLoading){
        return (
            <Loading />
        )
    }
    if(error){
        return (
            <Alert>メディアリストが読み込めませんでした。エラー：{error}</Alert>
        )
    }
  return (
    <Paper elevation={1} sx={{p:3}}>
        <Typography variant='h6' sx={{fontWeight:700}}>公開設定</Typography>
        <Stack spacing={2} sx={{mt:2}}>
        <Controller
        control={control}
        name='status'
        render={({field}) => (
            <Box sx={{mt:1}}>
                <Typography sx={{fontSize:"13",fontWeight:700}}>公開ステータス</Typography>
            <TextField
            sx={{
                mt:1
            }}
            {...field}
            fullWidth
            select
            error={!!errors.status}
            helperText={errors.status?.message}
            >
                {
                    status.map((item) => (
                        <MenuItem value={item.code} key={item.code}>{item.label}</MenuItem>
                    ))
                }
            </TextField>
            </Box>
        )}
        />
        <Box>
            <Typography sx={{fontSize:"13",fontWeight:700}}>サムネイル画像</Typography>
        <Button
        sx={{
            mt:1,
            mb:1
        }}
        variant='outlined'
        type='button'
        size='medium'
        onClick={() => setOpen(true)}
        >
            メディアから選択
        </Button>
        {
            selectedMedia && (
                <Stack spacing={2} direction="column" sx={{ width: 200 }}>
                    <Box sx={{
                        position: "relative",
                        width: 200,
                        height: 140
                    }}>
                        <Box
                            component="img"
                            src={selectedMedia.url}
                            alt={selectedMedia.fileName}
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 3,
                                objectFit: "cover"
                            }}
                        />

                        <IconButton
                            type="button"
                            color="error"
                            onClick={handleRemove}
                            sx={{
                                position: "absolute",
                                top: -12,
                                right: -12,
                                bgcolor: "#fff",
                                p: 0.5,
                                "&:hover": {
                                    bgcolor: "#f5f5f5"
                                }
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            overflowWrap: "anywhere"
                        }}
                    >
                        ファイル名：<strong>{selectedMedia.fileName}</strong>
                    </Typography>
                </Stack>
            )
        }
        </Box>
        <Controller
            control={control}
            name="githubUrl"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>GitHub URL</Typography>
                    <TextField
                    error={!!errors.githubUrl}
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    placeholder="gitHub URL"
                    sx={{
                        mt:1,
                        borderRadius:3,
                        bgcolor:"#F5F7FC",
                            "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    />
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.githubUrl?.message}</FormHelperText>
                </Box>
            )}
            />
        <Controller
            control={control}
            name="demoUrl"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>公開URL</Typography>
                    <TextField
                    error={!!errors.demoUrl}
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    placeholder="公開URLを入力してください"
                    sx={{
                        mt:1,
                        borderRadius:3,
                        bgcolor:"#F5F7FC",
                            "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    />
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.demoUrl?.message}</FormHelperText>
                </Box>
            )}
            />
        </Stack>
        <MediaDialogSelect
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(media) => {
            setValue("thumbnailId",media.id,{
                shouldValidate:true,
                shouldDirty:true
            })
        }}
        />
    </Paper>
  )
}

export default WorksSettingField