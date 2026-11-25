"use client"
import { LexicalExtensionComposer } from
  "@lexical/react/LexicalExtensionComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { $createParagraphNode, $getSelection, $isRangeSelection, defineExtension, FORMAT_ELEMENT_COMMAND } from "lexical";
import { Box, MenuItem, TextField } from "@mui/material";
import { RichTextExtension } from "@lexical/rich-text";
import { useLexicalComposerContext } from
  "@lexical/react/LexicalComposerContext";
import {
    ListExtension,
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND
} from "@lexical/list";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import {LinkExtension,TOGGLE_LINK_COMMAND} from "@lexical/link"
import LinkIcon from "@mui/icons-material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { FORMAT_TEXT_COMMAND,UNDO_COMMAND,REDO_COMMAND} from "lexical";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryExtension } from "@lexical/history";
import { useEffect, useState } from "react";
import {$createHeadingNode} from "@lexical/rich-text"
import {$setBlocksType} from "@lexical/selection";
type Prosp = {
    value?:string,
    onChange:(value:string) => void
}

const ToolBarPlugin = () => {
    const [isBold,setIsBold] = useState<boolean>(false)
    const [isItalic, setIsItalic] = useState<boolean>(false);
    const [isUnderline, setIsUnderline] = useState<boolean>(false);
    const [blockType,setBlockType] = useState<string>("paragraph")
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                const section = $getSelection();
                if($isRangeSelection(section)){
                    setIsBold(section.hasFormat("bold"))
                    setIsItalic(section.hasFormat("italic"))
                    setIsUnderline(section.hasFormat("underline"))
                }
            })
        })

    },[editor])
    const handleUnLink = () => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND,null)
    }
    const handleLink = () => {
        const url = window.prompt("リンク先のURLを入力してください")
        if(!url) return
        
        try{
            const parsedUrl = new URL(url)
            if(!["http:","https:"].includes(parsedUrl.protocol)){
                alert("httpまたはhttpsのURLを入力してください")
                return;
            }
            editor.dispatchCommand(TOGGLE_LINK_COMMAND,parsedUrl.href)
        } catch {
            alert("正しいURLを入力してください")
        }
    }
    const handleBold = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"bold")
    }
    const handleItalic = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"italic")
    }
    const handleBorderline = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"underline")
    }
    const handleBlockType = (type:string) => {
        editor.update(() => {
            const section = $getSelection();
            if(!$isRangeSelection(section)) return;
            $setBlocksType(section,() => {
                if(type === "paragraph"){
                    return $createParagraphNode();
                }
                return $createHeadingNode(type as "h1" | "h2" | "h3")
            })
        })
        setBlockType(type)
    }

    return (
        <Box
        sx={{
            display:"flex",
            alignItems:"center",
            borderBottom:"1px solid #ddd",
            pb:1,
            mb:2
        }}
        >
            <IconButton
            type="button"
            aria-label="元に戻す"
            onClick={() => editor.dispatchCommand(UNDO_COMMAND,undefined)}
            >
                <UndoIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="やり直し"
            onClick={() => editor.dispatchCommand(REDO_COMMAND,undefined)}
            >
                <RedoIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="太字"
            onClick={handleBold}
            color={isBold ? "primary" : "default"}
            >
            <FormatBoldIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="イタリック"
            onClick={handleItalic}
            color={isItalic ? "primary" : "default"}
            >
            <FormatItalicIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="アンダーライン"
            onClick={handleBorderline}
            color={isUnderline ? "primary" : "default"}
            >
            <FormatUnderlinedIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="箇条書き"
            onClick={() => {
                editor.dispatchCommand(
                    INSERT_UNORDERED_LIST_COMMAND,
                    undefined
                )
            }}
            >
                <FormatListBulletedIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="番号付きリスト"
            onClick={() => {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND,undefined)
            }}
            >
                <FormatListNumberedIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="リンク挿入"
            onClick={handleLink}
            >
            <LinkIcon />

            </IconButton>
            <IconButton
            type="button"
            aria-label="リンク解除"
            onClick={handleUnLink}
            >
                <LinkOffIcon />
            </IconButton>
            <TextField
            select
            size="small"
            value={blockType}
            onChange={(e) => handleBlockType(e.target.value)}
            sx={{width:150,ml:2}}
            >
                <MenuItem value="paragraph">通常テキスト</MenuItem>
                <MenuItem value="h1">見出し１</MenuItem>
                <MenuItem value="h2">見出し２</MenuItem>
                <MenuItem value="h3">見出し３</MenuItem>
            </TextField>

        </Box>

    )
}

const editorExtension = defineExtension({
    name:"sunriseEditor",
    namespace:"SunriseEditor",
    dependencies:[
        RichTextExtension,
        HistoryExtension,
        ListExtension,
        LinkExtension
    ],
    editable:true,
    theme:{
        text:{
            bold:"editor-bold",
            italic:"editor-italic",
            underline:"editor-underline"
        },
        heading:{
            h1:"editor-h1",
            h2:"editor-h2",
            h3:"editor-h3",
        }
    }
})
const LexicalEditor = ({onChange}:Prosp) => {
  return (
    <LexicalExtensionComposer 
    extension={editorExtension}
     contentEditable={null}>
        <Box
        sx={{
            mt:2,
            border:"1px solid #ddd",
            borderRadius:2,
            p:2,
            position:"relative",
            "& .editor-italic": {
                fontStyle: "italic",
            },
            "& .editor-underline": {
            textDecoration: "underline",
            },
            "& .editor-h1": {
            fontSize: "32px",
            fontWeight: 700,
            margin: "16px 0"
        },
        "& .editor-h2": {
            fontSize: "26px",
            fontWeight: 700,
            margin: "14px 0"
        },
        "& .editor-h3": {
            fontSize: "20px",
            fontWeight: 700,
            margin: "12px 0"
        }
        }}
        >
            <ToolBarPlugin />
            <ContentEditable
            aria-placeholder="本文を入力してください"
            style={{
                minHeight:150,
                outline:"none"
            }}
            placeholder={
                <Box sx={{color:"#999"}}>
                    本文を入力してください
                </Box>
            }
            />
            <OnChangePlugin
            onChange={(editorState) => {
                const json = JSON.stringify(editorState.toJSON())
                onChange(json)
            }}
            />
        </Box>
    </LexicalExtensionComposer>
  )
}

export default LexicalEditor