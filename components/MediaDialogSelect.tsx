"use client"
import fetchMediaList from '@/lib/media/fetchMediaList';
import { Media } from '@/types/MediaTypes';
import { Box, Dialog, DialogContent, DialogTitle, ImageList, ImageListItem, Typography } from '@mui/material';
import  useSWR  from 'swr';
type Props = {
    open:boolean,
    onClose:() => void;
    onSelect:(media:Media) => void
}

const MediaDialogSelect = ({open,onClose,onSelect}:Props) => {
    const {data:mediaList,error,isLoading} = useSWR<Media[]>(open ?"media/" : null,fetchMediaList)
  return (
    <Dialog
    open={open}
    fullWidth
    onClose={onClose}
    maxWidth="md"
    >
        <DialogTitle>メディアを選択</DialogTitle>
        <DialogContent>
            {
                isLoading && (
                    <Typography>画像読み込み中...</Typography>
                )
            }
            {
                error && (
                    <Typography>画像の読み込みに失敗しました</Typography>
                )
            }
            {
                !isLoading && !error && (
                    <ImageList cols={3} gap={12}>
                        {
                            (mediaList ?? []).map((item) => (
                                <ImageListItem key={item.id}>
                                    <Box
                                    component="button"
                                    type='button'
                                    onClick={() => {
                                        onSelect(item)
                                        onClose()
                                    }}
                                    sx={{
                                        border:"none",
                                        p:0,
                                        bgcolor:"transpalent",
                                        cursor:"pointer",
                                        textAlign:"left"
                                    }}
                                    >
                                        <Box
                                        component="img"
                                        src={item.url}
                                        alt={item.fileName}
                                        sx={{
                                            width:"100%",
                                            height:"140px",
                                            objectFit:"cover",
                                            borderRadius:2
                                        }}
                                        />
                                        <Typography
                                        sx={{
                                            fontSize:"12px"
                                        }}
                                        noWrap
                                        >{item.fileName}</Typography>

                                    </Box>

                                </ImageListItem>
                            ))
                        }
                    </ImageList>
                )
            }

        </DialogContent>


    </Dialog>
  )
}

export default MediaDialogSelect