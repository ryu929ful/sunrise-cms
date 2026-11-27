import { WorksFormValues } from "@/validation/works/WorksSchema"
import { Box,  FormHelperText, Paper, Stack, TextField, Typography } from "@mui/material"
import  LexicalEditor  from "@/features/lexical/LexicalEditor"
import { Controller, useFormContext } from "react-hook-form"
import { Technologies } from "@/types/technologyTypes"
import AutoCompleteCheckBox from "@/components/AutoCompleteCheckBox"
import {  useSearchParams } from "next/navigation"

type Props = {
    technologiesList:Technologies[]
}
const WorksBasicField = ({technologiesList}:Props) => {
    const param = useSearchParams()
    const workId = param.get("id")
    console.log(technologiesList)
    const {control,formState:{errors}} = useFormContext<WorksFormValues>()
    return(
        <Paper elevation={1} sx={{p:3}}>
            <Stack spacing={1.5}>
            <Controller
            control={control}
            name="title"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>タイトル *</Typography>
                    <TextField
                    error={!!errors.title}
                    {...field}
                    value={field.value ?? ""}
                    fullWidth
                    placeholder="タイトルを入力"
                    sx={{
                        mt:1,
                        borderRadius:3,
                        bgcolor:"#F5F7FC",
                            "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    />
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.title?.message}</FormHelperText>
                </Box>
            )}
            />
            <Controller
            control={control}
            name="slug"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>slug *</Typography>
                    <TextField
                    error={!!errors.slug}
                    {...field}
                    fullWidth
                    placeholder="article-cms"
                    sx={{
                        mt:1,
                        borderRadius:3,
                        bgcolor:"#F5F7FC",
                            "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    />
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.slug?.message}</FormHelperText>
                </Box>
            )}
            />
            <Controller
            control={control}
            name="description"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>概要 *</Typography>
                    <TextField
                    multiline
                    rows={2}
                    error={!!errors.description}
                    {...field}
                    fullWidth
                    placeholder="概要を入力してください"
                    sx={{
                        mt:1,
                        borderRadius:3,
                        bgcolor:"#F5F7FC",
                            "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    />
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.description?.message}</FormHelperText>
                </Box>
            )}
            />
            <Controller
            control={control}
            name="content"
            render={({field}) => (
                <Box>
                    <Typography sx={{fontSize:"13",fontWeight:700}}>詳細本文 *</Typography>
                    <LexicalEditor key={workId} value={field.value} onChange={field.onChange}/>
                    <FormHelperText sx={{mt:1,color:"red"}}>{errors.content?.message}</FormHelperText>
                </Box>
            )}
            />
            <Controller
                control={control}
                name="technologyIds"
                render={({field,fieldState}) => (
                    <Box>
                        <Typography sx={{fontSize:"13",fontWeight:700}}>技術スタック *</Typography>
                        <Box sx={{mt:1}}>
                        <AutoCompleteCheckBox
                        data={technologiesList}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        label="技術スタック"
                        error={fieldState.error?.message}
                        />
                        </Box>
                    </Box>
                )}
                />
            </Stack>
        </Paper>
    )
}

export default WorksBasicField