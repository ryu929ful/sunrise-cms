import { Box, IconButton, InputAdornment,MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import type {  Works, WorkStatus } from '@/types/worksTypes';
import { Technologies } from '@/types/technologyTypes';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import DeleteWorks from '@/lib/works/DeleteWorks';
import { KeyedMutator } from 'swr';
type Props = {
    technologyList:Technologies[],
    worksList:Works[],
    mutate:KeyedMutator<Works[]>
}
const WorkListField = ({technologyList,worksList,mutate}:Props) => {
    const [titleKey,setTitleKey] = useState<string>("")
    const [statusKey,setStatusKey] = useState<string>("")
    const [techKey,setTechKey] = useState<string>("")

    const status = [
        {
            id:"draft" as WorkStatus,
            name:"非公開"
        },
        {
            id:"published" as WorkStatus,
            name:"公開済み"
        }
    ]
    const deleteWorks = async (id:string) => {
        const ok = window.confirm("制作実績を削除しますか？")
        if(ok){
            try {
                await DeleteWorks(id)
                await mutate()
            } catch (err){
                console.error(err)
            }
        }
    }

    const filterdWorksList = worksList.filter((item) => {
        const title = !titleKey || item.title.includes(titleKey)
        const status = !statusKey || statusKey === item.status
        const technology = !techKey || item.technologyIds.some((t:string) => {
            return t === techKey
        })
        return title && status && technology
    })


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
            value={statusKey}
            onChange={(e) => setStatusKey(e.target.value)}
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
            value={techKey}
            onChange={(e) => setTechKey(e.target.value)}
            label="技術"
            sx={{
                width:260,
                borderRadius:3,
                bgcolor:"#F5F7FC",
                    "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                },
            }}
            >
                <MenuItem value="">すべての技術</MenuItem>
                {
                    technologyList.map((item) => (
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
                    <TableCell>技術スタック</TableCell>
                    <TableCell>ステータス</TableCell>
                    <TableCell>更新日</TableCell>
                    <TableCell>操作</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                    {
                        filterdWorksList.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>
                                <Box sx={{
                                    display:"flex",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    gap:"2px"
                                }}>
                                {
                                item.technologyIds.map((t,i) => {
                                const tName = technologyList.find((tname) => {
                                    return tname.id === t
                                })?.name

                                return <Typography color='secondary' sx={{fontSize:"12px"}} key={t}>{tName} {i !== item.technologyIds.length - 1 && ("/")} </Typography>
                            })
                            }
                            </Box>
                            </TableCell>
                            <TableCell>{status.find((s) => {
                                return s.id === item.status
                            })?.name}</TableCell>
                            <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ja-JP") : new Date(item.createdAt).toLocaleDateString("ja-JP")}</TableCell>
                            <TableCell>
                                <IconButton color='primary'>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => deleteWorks(item.id)} color='error'>
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

export default WorkListField