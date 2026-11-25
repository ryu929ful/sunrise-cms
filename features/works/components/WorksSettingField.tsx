import { WorksFormValues } from '@/validation/works/WorksSchema'
import { Box, Button, FormHelperText, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import {status} from "../../../lib/status/status"
import { useEffect, useState } from 'react'
import MediaDialogSelect from '@/components/MediaDialogSelect'
import { Media } from '@/types/MediaTypes'

const WorksSettingField = () => {
    console.log(status)
    const [selectedMedia,setSelectedMedia] = useState<Media | null>(null)
    const [open,setOpen] = useState<boolean>(false)
    const {control,formState:{errors},setValue} = useFormContext<WorksFormValues>()
  return (
    <Paper elevation={1} sx={{p:3}}>
        <Typography sx={{fontWeight:700}}>公開設定</Typography>
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
            <Typography　sx={{fontSize:"13",fontWeight:700}}>サムネイル画像</Typography>
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
                <Stack spacing={2} direction={"column"}>
                    <Box component={"img"}
                    src={selectedMedia.url}
                    alt={selectedMedia.fileName}
                    sx={{
                        height:140,
                        width:200,
                        borderRadius:3,
                        objectFit:"cover"
                    }}
                    />
                    <Typography sx={{fontSize:"12px",fontWeight:500}}>ファイル名：<strong>{selectedMedia.fileName}</strong></Typography>
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
            setSelectedMedia(media)
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