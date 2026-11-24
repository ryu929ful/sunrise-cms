import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import AddIcon from '@mui/icons-material/Add';

type Props = {
    name:string,
    href?:string,
}

const AddButton = ({name,href}:Props) => {
    const router = useRouter()

    if(href){
        return (
            <Button 
        type='button' 
        size='large'
        onClick={() =>{
            router.push(href)
        }}
        sx={{
            bgcolor:"#4354DC",
            color:"white",
            width:155,
            mr:"40px"
        }}>
            <AddIcon sx={{mr:1}}/>
            {name}
        </Button>
        )
    }
}

export default AddButton