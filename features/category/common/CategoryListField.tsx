import { Categories } from '@/types/categoryTypes'
import { Box, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import { useState } from 'react'
import { KeyedMutator } from 'swr'
import SearchIcon from "@mui/icons-material/Search";
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import DeleteCategory from '@/lib/categories/DeleteCategory';
import Loading from '@/components/Loading';
type Props = {
    categoryList:Categories[],
    mutate:KeyedMutator<any>
}
const CategoryListField = ({categoryList,mutate}:Props) => {
  const router = useRouter()
  const [titleKey,setTitleKey] = useState<string>("")
  const filteredCategoryList = categoryList.filter((item) => {
    return item.name.includes(titleKey)
  })
  const [load,setLoad] = useState<boolean>(false)
  const deleteCategory = async (id:string) => {
    const ok = window.confirm("カテゴリを削除しますか？")
    if(ok){
      try{
        setLoad(true)
        await DeleteCategory(id)
        await mutate()
        
      } catch(err){
        console.error(err)
      } finally {
        setLoad(false)
      }
    }

    
  }
  console.log(filteredCategoryList)
  if(load){
    return(
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
    </Box>
    <Table sx={{
        mt:4
    }}>
        <TableHead>
            <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>スラッグ</TableCell>
                <TableCell>更新日</TableCell>
                <TableCell>操作</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
                {
                    filteredCategoryList.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.slug}</TableCell>
                        <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("ja-JP") : new Date(item.createdAt).toLocaleDateString("ja-JP")}</TableCell>
                        <TableCell>
                            <IconButton
                            onClick={() => router.push(`articles/edit?id=${item.id}`)}
                            color='primary'>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteCategory(item.id)} color='error'>
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

export default CategoryListField