import { CategoryFormValues, categorySchema } from '@/validation/categories/categoryTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';

const CategoryCreate = () => {
    const [notice, setNotice] = useState({
        open: false,
        message: "",
        status: "success" as "success" | "error" | "warning" | "info",
        });
        const [load,setLoad] = useState<boolean>(false)
        const router = useRouter()
        const defaultValues:CategoryFormValues = {
            name:"",
            slug:""
        }
        const methods = useForm<CategoryFormValues>({
            mode:"onBlur",
            resolver:zodResolver(categorySchema),
            defaultValues:defaultValues
        })
  return (
    <FormProvider {...methods}>
        <div>CategoryCreate</div>
    </FormProvider>
  )
}

export default CategoryCreate