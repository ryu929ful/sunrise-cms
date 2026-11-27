import z from "zod";

export const articleSchema = z.object({
    title:z.string().nonempty("タイトルを入力してください"),
    slug:z.string().nonempty("スラッグを入力してください"),
    content:z.string().nonempty("記事本文を入力してください"),
    categoryIds:z.array(z.string()).min(1,"カテゴリを一つ以上選択してください"),
    tagIds:z.array(z.string()).min(1,"一つ以上のタグを選択してください"),
    description:z.string().nonempty("概要を入力してください"),
    thumbnailId: z.string().nullable(),
    status: z.enum(["draft","published"]),

})

export type ArticleFormValues = z.infer<typeof articleSchema>