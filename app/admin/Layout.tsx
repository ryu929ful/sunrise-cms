"use client"
import React, { ReactNode, useState } from 'react'
import {AppBar, Box, Drawer, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar, Typography} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link"
import { usePathname } from 'next/navigation';
const Layout = ({children}:{children:ReactNode}) => {
    const menuItems = [
        {label:"ダッシュボード",href:"/admin",icon:<DashboardIcon />},
        {label:"制作実績",href:"/admin/works",icon:<WorkOutlineIcon />},
        {label:"記事管理",href:"/admin/articles",icon:<ArticleIcon />},
        {label:"カテゴリ",href:"/admin/categories",icon:<FolderOutlinedIcon />},
        {label:"タグ",href:"/admin/tags",icon:<LocalOfferOutlinedIcon />},
        {label:"メディア",href:"/admin/media",icon:<PermMediaOutlinedIcon />},
        {label:"設定",href:"/admin/settings",icon:<SettingsOutlinedIcon />},
    ]
    const path = usePathname()
    const [searchKey,setSearchKey] = useState<string>("")
  return (
    <Box sx={{
        display:"flex",
        minHeight:"100vh",
        bgcolor:"#F5F7FC"
    }}>
        <AppBar position='fixed' elevation={0} sx={{
            color:"#000",
            bgcolor:"#fff",
        }}>
            <Box sx={{
                height:74,
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                ml:"256px",
                mr:"40px"
            }}>
                <TextField 
                variant='standard'
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                sx={{
                    width:580
                }}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                    ),
                },
                }}
                placeholder='記事・制作実績を検索...'
                />
                <Box>
                    <Typography sx={{
                        fontSize:"13px",
                        fontWeight:700
                    }}>
                        ●   管理者   ⌄
                    </Typography>
                </Box>

            </Box>

        </AppBar>
        <Drawer variant='permanent'
        sx={{
            flexShrink:0,
            height:"100vh",
            width:"235px",
            "& .MuiDrawer-paper":{
                bgcolor:"#111B36",
                width:"235px",
                boxSizing:"border-box"
            }
        }}
        >
            <Box sx={{
                height:"74px",
                color:"white",
            }}>
            <Typography variant='h6' sx={{
            }}>
                <Box component={"img"}
                src="/sunrise-icon.png"
                alt='sunrise-CMS-icon'
                sx={{
                    width:200,
                    height:"auto"
                }}
                >
                    

                </Box>
            </Typography>
            <List sx={{px:1.5}}>
                {
                    menuItems.map((item) => (
                <ListItemButton 
                key={item.href}
                component={Link}
                href={item.href}
                selected={path === item.href}
                sx={{
                "&.Mui-selected": {
                    backgroundColor: "#253A7F",
                    color: "#fff",
                    borderRadius:3,
                },
                "&.Mui-selected:hover": {
                    borderRadius:3,
                    backgroundColor: "#253A7F",
                },
                }}
                >
                    <ListItemIcon sx={{color:"white"}}>{item.icon}</ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                </ListItemButton>
                    ))
                }

            </List>
            </Box>

        </Drawer>
        <Box sx={{    
            flex: 1,
            minWidth: 0,
            p:"30px 40px"
    }}>
            <Toolbar />
        {children}
        </Box>
    </Box>
  )
}

export default Layout