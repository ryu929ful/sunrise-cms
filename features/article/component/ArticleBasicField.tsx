import AutoCompleteCheckBox from '@/components/AutoCompleteCheckBox'
import { Categories } from '@/types/categoryTypes'
import { Tags } from '@/types/tagTypes'
import { ArticleFormValues } from '@/validation/article/ArticleSchema'
import { Box, FormHelperText, Paper, Stack, TextField, Typography } from '@mui/material'
import  LexicalEditor  from "@/features/lexical/LexicalEditor"
import { Controller, useFormContext } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
type Props = {
    categoryList:Categories[],
    tagList:Tags[]
}

const ArticleBasicField = ({categoryList,tagList}:Props) => {
    const {control,formState:{errors}} = useFormContext<ArticleFormValues>()
    const param = useSearchParams()
    const articleId = param.get("id")
    return (
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
                    name="categoryIds"
                    render={({field,fieldState}) => (
                        <Box>
                            <Typography sx={{fontSize:"13",fontWeight:700}}>記事カテゴリ *</Typography>
                            <Box sx={{mt:1}}>
                            <AutoCompleteCheckBox
                            data={categoryList}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            label="カテゴリ"
                            error={fieldState.error?.message}
                            />
                            </Box>
                        </Box>
                    )}
                    />
                <Controller
                    control={control}
                    name="tagIds"
                    render={({field,fieldState}) => (
                        <Box>
                            <Typography sx={{fontSize:"13",fontWeight:700}}>タグ *</Typography>
                            <Box sx={{mt:1}}>
                            <AutoCompleteCheckBox
                            data={tagList}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            label="タグ"
                            error={fieldState.error?.message}
                            />
                            </Box>
                        </Box>
                    )}
                    />
                <Controller
                control={control}
                name="content"
                render={({field}) => (
                    <Box>
                        <Typography sx={{fontSize:"13",fontWeight:700}}>詳細本文 *</Typography>
                        <LexicalEditor key={articleId} value={field.value} onChange={field.onChange}/>
                        <FormHelperText sx={{mt:1,color:"red"}}>{errors.content?.message}</FormHelperText>
                    </Box>
                )}
                />
                </Stack>
            </Paper>
  )
}

export default ArticleBasicField