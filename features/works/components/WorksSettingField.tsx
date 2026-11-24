import { WorksFormValues } from '@/validation/works/WorksSchema'
import { Box, FormHelperText, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import {status} from "../../../lib/status/status"
import MediaArea from '@/components/MediaArea'



const WorksSettingField = () => {
    console.log(status)
    const {control,formState:{errors}} = useFormContext<WorksFormValues>()
  return (
    <Paper elevation={1} sx={{p:3}}>
        <Typography sx={{fontWeight:700}}>公開設定</Typography>
        <Stack sx={{mt:2}}>
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
        <MediaArea />
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

    </Paper>
  )
}

export default WorksSettingField