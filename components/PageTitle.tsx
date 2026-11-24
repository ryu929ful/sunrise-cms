import { Box, Typography } from '@mui/material'

type Props = {
    title:string,
    subTitle:string
}

const PageTitle = ({title,subTitle}:Props) => {
  return (
    <Box>
        <Typography 
        sx={{
            fontWeight:700,
            fontSize:"27px"
        }} 
        variant='h4'>
            {title}
        </Typography>
        <Typography
        color='textSecondary'
        sx={{
            fontSize:"14px",
            mt:"10px"
        }}
        >
            {subTitle}
        </Typography>
    </Box>
  )
}

export default PageTitle