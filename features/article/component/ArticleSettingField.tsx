import Loading from '@/components/Loading'
import fetchMediaList from '@/lib/media/fetchMediaList'
import { status } from '@/lib/status/status'
import { Media } from '@/types/MediaTypes'
import { ArticleFormValues } from '@/validation/article/ArticleSchema'
import { Alert, Box, Button, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Controller, useFormContext } from 'react-hook-form'
import useSWR from 'swr'
import MediaDialogSelect from '@/components/MediaDialogSelect'

const ArticleSettingField = () => {
    const [open,setOpen] = useState<boolean>(false)
    const {
        data:mediaLIst,
        error:mediaError,
        isLoading:mediaLoad
    } = useSWR<Media[]>("media/",fetchMediaList)

    const {
        control,
        formState:{errors},
        setValue,
        watch
    } = useFormContext<ArticleFormValues>()
    const handleRemoveTn = () => {
        setValue("thumbnailId",null,{
            shouldDirty:true,
            shouldValidate:true
        })
    }
    const thumbailId = watch("thumbnailId")
    const selectedMedia = mediaLIst?.find((item) => {
        return item.id === thumbailId
    })
    if(mediaLoad){
        return (
            <Loading />
        )
    }
    if(mediaError){
        <Alert security='error'>メディアリストを読み込めませんでした</Alert>

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
                                onClick={handleRemoveTn}
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

export default ArticleSettingField