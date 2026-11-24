import z from "zod";

export const MediaSchema = z.object({
    file:z.instanceof(File,{error:"画像を選択してください"})
    .refine((file) => file.type.startsWith("image/"),"画像ファイルを選択してください")

})

export type MediaFormValues = z.infer<typeof MediaSchema>