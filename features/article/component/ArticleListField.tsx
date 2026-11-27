import { status } from '@/lib/status/status';
import { Articles } from '@/types/articleTypes'
import { Categories } from '@/types/categoryTypes'
import { Tags } from '@/types/tagTypes'
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment,MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import DeleteArticles from '@/lib/articles/DeleteArticles';
import { KeyedMutator } from 'swr';
import Loading from '@/components/Loading';

type Props = {
     articleList:Articles[],
     CategoryList:Categories[],
     tagsList:Tags[],
     mutate:KeyedMutator<Articles[]>
}
const ArticleListField = ({mutate,articleList,CategoryList,tagsList}:Props) => {
    const [stateKey,setStateKey] = useState<string>("")
    const [titleKey,setTitleKey] = useState<string>("")
    const [catKey,setCatKey] = useState<string>("")
    const router = useRouter();
    const [load,setLoad] = useState<boolean>(false)

    const filteredArticleList = articleList.filter((item) => {
        const cat = !catKey || item.categoryIds.some((c) => {
            return c === catKey
        })
        const title = !titleKey || item.title.includes(titleKey)
        const status = !stateKey || item.status.includes(stateKey)
        return cat && title && status
    })
    const deleteArticle = async (id:string) => {
        const ok = window.confirm("記事を削除してもよろしいでしょうか？")
        if(ok){
            try{
                setLoad(true)
                await DeleteArticles(id)
                await mutate()
            } catch(err){
                console.error(err)
            } finally {
                setLoad(false)
            }

        }

    }
    console.log(filteredArticleList)
    if(load){
        return (
            <Loading />
        )
    }
  return (
        <Paper elevation={1} sx={{p:3}}>
            <Box sx={{
                display:"flex",
                alignItems:"center",
                justifyContent:"left",
                gap:"20px"
            }}>
                <TextField
                slotProps={{
                    input: {
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        ),
                    },
                }}
                variant='outlined'
                value={titleKey}
                placeholder='タイトルで検索...'
                onChange={(e) => setTitleKey(e.target.value)}
                sx={{
                    width:400,
                    borderRadius:3,
                    bgcolor:"#F5F7FC",
                        "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                }}
                />
                <TextField
                select
                value={stateKey}
                onChange={(e) => setStateKey(e.target.value)}
                label="ステータス"
                sx={{
                    width:260,
                    borderRadius:3,
                    bgcolor:"#F5F7FC",
                        "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                }}
                >
                    <MenuItem value="">すべてのステータス</MenuItem>
                    <MenuItem value="published">公開済み</MenuItem>
                    <MenuItem value="draft">非公開</MenuItem>
                </TextField>
                <TextField
                select
                value={catKey}
                onChange={(e) => setCatKey(e.target.value)}
                label="カテゴリ"
                sx={{
                    width:260,
                    borderRadius:3,
                    bgcolor:"#F5F7FC",
                        "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                }}
                >
                    <MenuItem value="">すべてのカテゴリ</MenuItem>
                    {
                        CategoryList.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))
                    }
                </TextField>
            </Box>
            <Table　sx={{
                mt:4
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell>タイトル</TableCell>
                        <TableCell>カテゴリ&タグ</TableCell>
                        <TableCell>ステータス</TableCell>
                        <TableCell>更新日</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        {
                            filteredArticleList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"left",
                                        gap:"2px"
                                    }}>
                                        <Stack spacing={1}>
                                            <Box sx={{
                                                display:"flex",
                                                gap:.5
                                            }}>
                                            {
                                            item.tagIds.map((t,i) => {
                                                const tagName = tagsList.find((tName) => {
                                                    return tName.id === t
                                                })?.name
                                                return <Typography color='secondary' sx={{fontSize:"12px"}} key={t}>{tagName}{i !== item.tagIds.length - 1 && ("　/")}</Typography>
                                            })
                                            }
                                            </Box>
                                            <Box sx={{
                                                display:"flex",
                                                gap:.5
                                            }}>
                                                {
                                                item.categoryIds.map((c,i) => {
                                                const tName = CategoryList.find((cName) => {
                                                    return cName.id === c
                                                })?.name
                
                                                return <Typography color='secondary' sx={{fontSize:"12px"}} key={c}>{tName} {i !== item.categoryIds.length - 1 && ("/")} </Typography>
                                                })
                                                
                                                }
                                            </Box>
                                        </Stack>
                                </Box>
                                </TableCell>
                                <TableCell>{status.find((s) => {
                                    return s.code === item.status
                                })?.label}</TableCell>
                                <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ja-JP") : new Date(item.createdAt).toLocaleDateString("ja-JP")}</TableCell>
                                <TableCell>
                                    <IconButton
                                    onClick={() => router.push(`articles/edit?id=${item.id}`)}
                                    color='primary'>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteArticle(item.id)} color='error'>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            ))
                        }
                </TableBody>
            </Table>
    
        </Paper>
  )
}

export default ArticleListField