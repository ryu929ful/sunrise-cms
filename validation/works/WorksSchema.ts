import { z } from "zod";

export const worksSchema = z.object({
    title:z.string().trim().min(1,"タイトルを入力してください").max(100,"100文字以下で入力してください"),
    slug:z.string().trim().min(1,"スラッグを入力してください").regex( /^[a-z0-9]+(?:-[a-z0-9]+)*$/,"半数英子文字・数字・ハイフンで入力してください"),
    description:z.string().trim().nonempty("概要を入力してください").max(300,"300文字以下で入力してください"),
    content:z.string().nonempty("記事本文を入力してください"),
    technologyIds:z.array(z.string()).min(1,"技術スタックを１つ以上選択してください"),
    thumbnailId:z.string().nullable(),
    githubUrl:z.union([z.literal(""),z.url()]).nullable(),
    demoUrl:z.union([z.literal(""),z.url()]).nullable(),
    status:z.enum(["draft","published"])
})

export type WorksFormValues = z.infer<typeof worksSchema>