"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import { Box, IconButton, MenuItem, TextField } from "@mui/material";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    $getSelection,
    $isRangeSelection,
    defineExtension,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
} from "lexical";

import {
    RichTextExtension,
    $createHeadingNode,
} from "@lexical/rich-text";

import {
    ListExtension,
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";

import {
    LinkExtension,
    TOGGLE_LINK_COMMAND,
} from "@lexical/link";

import { HistoryExtension } from "@lexical/history";
import { $setBlocksType } from "@lexical/selection";

// MUI Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";


// ========================================
// Types
// ========================================

type Props = {
    value?: string;
    onChange: (value: string) => void;
};

type LoadContentProps = {
    value?: string;
    lastEditedValue: RefObject<string | null>;
};


// ========================================
// 保存済み本文の復元
// ========================================

const LoadContentPlugin = ({
    value,
    lastEditedValue,
}: LoadContentProps) => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        if (!value) return;

        // Lexical自身が変更した内容なら復元しない
        if (value === lastEditedValue.current) {
            return;
        }

        // 現在のLexicalの内容
        const currentValue = JSON.stringify(
            editor.getEditorState().toJSON()
        );

        // すでに同じ内容なら復元不要
        if (currentValue === value) {
            return;
        }

        try {

            const parsed = JSON.parse(value);

            // Lexical JSON形式
            if (parsed?.root) {

                const editorState = editor.parseEditorState(value);

                editor.setEditorState(editorState);

                return;
            }

            console.warn("対応していないJSON形式です");

        } catch {

            // Markdown・通常テキスト形式
            editor.update(() => {

                const root = $getRoot();

                root.clear();

                const lines = value.split(/\r?\n/);

                lines.forEach((line) => {

                    const paragraph = $createParagraphNode();

                    if (line) {
                        paragraph.append(
                            $createTextNode(line)
                        );
                    }

                    root.append(paragraph);

                });

            });

        }

    }, [editor, value, lastEditedValue]);

    return null;
};


// ========================================
// ツールバー
// ========================================

const ToolBarPlugin = () => {

    const [editor] = useLexicalComposerContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const [blockType, setBlockType] = useState("paragraph");


    // ========================================
    // 選択中の文字装飾状態を取得
    // ========================================

    useEffect(() => {

        return editor.registerUpdateListener(({ editorState }) => {

            editorState.read(() => {

                const selection = $getSelection();

                if (!$isRangeSelection(selection)) return;

                setIsBold(selection.hasFormat("bold"));

                setIsItalic(selection.hasFormat("italic"));

                setIsUnderline(selection.hasFormat("underline"));

            });

        });

    }, [editor]);


    // ========================================
    // 文字装飾
    // ========================================

    const handleBold = () => {

        editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "bold"
        );

    };

    const handleItalic = () => {

        editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "italic"
        );

    };

    const handleUnderline = () => {

        editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "underline"
        );

    };


    // ========================================
    // 見出し変更
    // ========================================

    const handleBlockType = (type: string) => {

        editor.update(() => {

            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            $setBlocksType(selection, () => {

                if (type === "paragraph") {

                    return $createParagraphNode();

                }

                return $createHeadingNode(
                    type as "h1" | "h2" | "h3"
                );

            });

        });

        setBlockType(type);

    };


    // ========================================
    // リンク挿入
    // ========================================

    const handleLink = () => {

        const url = window.prompt(
            "リンク先のURLを入力してください"
        );

        if (!url) return;

        try {

            const parsedUrl = new URL(url);

            if (
                !["http:", "https:"].includes(
                    parsedUrl.protocol
                )
            ) {

                alert(
                    "httpまたはhttpsのURLを入力してください"
                );

                return;

            }

            editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                parsedUrl.href
            );

        } catch {

            alert("正しいURLを入力してください");

        }

    };


    // ========================================
    // リンク解除
    // ========================================

    const handleUnLink = () => {

        editor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            null
        );

    };


    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.5,
                borderBottom: "1px solid #ddd",
                pb: 1,
                mb: 2,
            }}
        >

            {/* 元に戻す */}

            <IconButton
                type="button"
                aria-label="元に戻す"
                onClick={() =>
                    editor.dispatchCommand(
                        UNDO_COMMAND,
                        undefined
                    )
                }
            >
                <UndoIcon />
            </IconButton>


            {/* やり直し */}

            <IconButton
                type="button"
                aria-label="やり直し"
                onClick={() =>
                    editor.dispatchCommand(
                        REDO_COMMAND,
                        undefined
                    )
                }
            >
                <RedoIcon />
            </IconButton>


            {/* 太字 */}

            <IconButton
                type="button"
                aria-label="太字"
                onClick={handleBold}
                color={isBold ? "primary" : "default"}
            >
                <FormatBoldIcon />
            </IconButton>


            {/* イタリック */}

            <IconButton
                type="button"
                aria-label="イタリック"
                onClick={handleItalic}
                color={isItalic ? "primary" : "default"}
            >
                <FormatItalicIcon />
            </IconButton>


            {/* 下線 */}

            <IconButton
                type="button"
                aria-label="下線"
                onClick={handleUnderline}
                color={isUnderline ? "primary" : "default"}
            >
                <FormatUnderlinedIcon />
            </IconButton>


            {/* 箇条書き */}

            <IconButton
                type="button"
                aria-label="箇条書き"
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_UNORDERED_LIST_COMMAND,
                        undefined
                    )
                }
            >
                <FormatListBulletedIcon />
            </IconButton>


            {/* 番号付きリスト */}

            <IconButton
                type="button"
                aria-label="番号付きリスト"
                onClick={() =>
                    editor.dispatchCommand(
                        INSERT_ORDERED_LIST_COMMAND,
                        undefined
                    )
                }
            >
                <FormatListNumberedIcon />
            </IconButton>


            {/* リンク挿入 */}

            <IconButton
                type="button"
                aria-label="リンク挿入"
                onClick={handleLink}
            >
                <LinkIcon />
            </IconButton>


            {/* リンク解除 */}

            <IconButton
                type="button"
                aria-label="リンク解除"
                onClick={handleUnLink}
            >
                <LinkOffIcon />
            </IconButton>


            {/* 見出し */}

            <TextField
                select
                size="small"
                value={blockType}
                onChange={(e) =>
                    handleBlockType(e.target.value)
                }
                sx={{
                    width: 150,
                    ml: 2,
                }}
            >

                <MenuItem value="paragraph">
                    通常テキスト
                </MenuItem>

                <MenuItem value="h1">
                    見出し1
                </MenuItem>

                <MenuItem value="h2">
                    見出し2
                </MenuItem>

                <MenuItem value="h3">
                    見出し3
                </MenuItem>

            </TextField>

        </Box>

    );

};


// ========================================
// Lexical設定
// ========================================

const editorExtension = defineExtension({

    name: "sunriseEditor",

    namespace: "SunriseEditor",

    dependencies: [
        RichTextExtension,
        HistoryExtension,
        ListExtension,
        LinkExtension,
    ],

    editable: true,

    theme: {

        text: {
            bold: "editor-bold",
            italic: "editor-italic",
            underline: "editor-underline",
        },

        heading: {
            h1: "editor-h1",
            h2: "editor-h2",
            h3: "editor-h3",
        },

    },

});


// ========================================
// LexicalEditor
// ========================================

const LexicalEditor = ({
    value,
    onChange,
}: Props) => {

    // 最後にLexical自身が編集した内容
    const lastEditedValue = useRef<string | null>(null);

    return (

        <LexicalExtensionComposer
            extension={editorExtension}
            contentEditable={null}
        >

            {/* 保存済み本文の復元 */}

            <LoadContentPlugin
                value={value}
                lastEditedValue={lastEditedValue}
            />


            <Box
                sx={{
                    mt: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    position: "relative",

                    "& .editor-bold": {
                        fontWeight: 700,
                    },

                    "& .editor-italic": {
                        fontStyle: "italic",
                    },

                    "& .editor-underline": {
                        textDecoration: "underline",
                    },

                    "& .editor-h1": {
                        fontSize: "32px",
                        fontWeight: 700,
                        margin: "16px 0",
                    },

                    "& .editor-h2": {
                        fontSize: "26px",
                        fontWeight: 700,
                        margin: "14px 0",
                    },

                    "& .editor-h3": {
                        fontSize: "20px",
                        fontWeight: 700,
                        margin: "12px 0",
                    },

                }}
            >

                {/* ツールバー */}

                <ToolBarPlugin />


                {/* 本文入力エリア */}

                <ContentEditable
                    aria-placeholder="本文を入力してください"
                    style={{
                        minHeight: 150,
                        outline: "none",
                    }}
                    placeholder={
                        <Box
                            sx={{
                                color: "#999",
                            }}
                        >
                            本文を入力してください
                        </Box>
                    }
                />


                {/* React Hook Formとの連携 */}

                <OnChangePlugin
                    onChange={(editorState) => {

                        const json = JSON.stringify(
                            editorState.toJSON()
                        );

                        // Lexical自身の変更を記録
                        lastEditedValue.current = json;

                        // React Hook Formに反映
                        onChange(json);

                    }}
                />

            </Box>

        </LexicalExtensionComposer>

    );

};

export default LexicalEditor;