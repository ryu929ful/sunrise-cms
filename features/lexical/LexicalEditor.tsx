"use client"
import { LexicalExtensionComposer } from
  "@lexical/react/LexicalExtensionComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { defineExtension, FORMAT_ELEMENT_COMMAND } from "lexical";
import { Box } from "@mui/material";
import { RichTextExtension } from "@lexical/rich-text";
import { useLexicalComposerContext } from
  "@lexical/react/LexicalComposerContext";

import { FORMAT_TEXT_COMMAND , SELECTION_CHANGE_COMMAND,COMMAND_PRIORITY_LOW,} from "lexical";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryExtension } from "@lexical/history";

type Prosp = {
    value?:string,
    onChange:(value:string) => void
}

const ToolBarPlugin = () => {
    const [editor] = useLexicalComposerContext()
    const handleBold = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"bold")
    }
    const handleItalic = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"italic")
    }
    const handleBorderline = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND,"underline")
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
            aria-label="太字"
            onClick={handleBold}
            >
                <FormatBoldIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="イタリック"
            onClick={handleItalic}
            >
                <FormatItalicIcon />
            </IconButton>
            <IconButton
            type="button"
            aria-label="アンダーライン"
            onClick={handleBorderline}
            >
                <FormatUnderlinedIcon />
            </IconButton>

        </Box>

    )
}

const editorExtension = defineExtension({
    name:"sunriseEditor",
    namespace:"SunriseEditor",
    dependencies:[
        RichTextExtension,
        HistoryExtension
    ],
    editable:true,
    theme:{
        text:{
            bold:"editor-bold",
            italic:"editor-italic",
            underline:"editor-underline"
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