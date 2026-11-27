import z from "zod";

export const categorySchema = z.object({
    name: z.string().nonempty("カテゴリ名を入力してください"),
    slug: z.string().nonempty("スラッグ名を入力してください"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>