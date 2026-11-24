import { WorksFormValues } from '@/validation/works/WorksSchema'
import { Box, Icon, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from "react-dropzone"
import { useFormContext } from 'react-hook-form'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type MediaInput = {
    file:File
}

const MediaArea = () => {
    const [previewUrl,setPreviewUrl] = useState<string | null>(null)
    const previewUrlRef = useRef<string | null>(null)
    const {setValue,resetField,watch} = useFormContext<MediaInput>()
    const [selectedFile,setSelectedFile] = useState<File | null>(null)
    const {getInputProps,getRootProps,isDragActive} = useDropzone({
        accept:{
            "image/*":[]
        },
        multiple:false,
        onDrop: ((item) => {
            const chosedFile = item[0]
            if(!chosedFile) return
            if(previewUrlRef.current){
                URL.revokeObjectURL(previewUrlRef.current)
            }
            const url = URL.createObjectURL(chosedFile)
            setPreviewUrl(url)
            previewUrlRef.current = url
            setSelectedFile(chosedFile)

            setValue("file",chosedFile,{
                shouldValidate:true,
                shouldDirty:true
            })
        })
    })
    const file = watch("file")
    useEffect(() => {
        return () => {
            if(previewUrlRef.current){
                URL.revokeObjectURL(previewUrlRef.current)
            }
        }
    },[])
    const handleRemove = () => {
        const ok = window.confirm("画像の選択をキャンセルしてもよろしいでしょうか？")
        if(ok){
            setPreviewUrl(null)
            if(previewUrlRef.current){
                URL.revokeObjectURL(previewUrlRef.current)
            }
            previewUrlRef.current = null
            resetField("file")
        }
    }
  return (
    <Box>
        <Box {...getRootProps()} sx={{
            fontSize:"14px",
            color:"#4354DC",
            bgcolor:"#EDF1FF",
            p:5,
            mt:1.5,
            mb:2,
            borderRadius:3,
            border:"1px dashed #4354DC",
            textAlign:"center"
        }}>
            <input {...getInputProps()} />
            {!isDragActive ? ("画像をドラッグ＆ドロップ、またはファイルを選択") : ("ドロップ")}
        </Box>
        {
            previewUrl && file && (
                <Box sx={{
                    display:"inline-block",
                    position:"relative"
                }}>
                    <IconButton
                    color='error'
                    onClick={() => handleRemove()}
                    sx={{
                        position:"absolute",
                        top:0,
                        right:"-10%",
                        transform: "translate(0%, -50%)"
                    }}>
                        <HighlightOffIcon />
                    </IconButton>
                    <Box
                    sx={{
                        width:200,
                    }}
                    component={"img"}
                    src={previewUrl}
                    alt={file.name}
                    >
                    </Box>
                    <Typography>ファイル名：<strong>{file.name}</strong></Typography>
                </Box>
            )
        }
    </Box>
  )
}

export default MediaArea