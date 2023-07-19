'use client'

import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from '@mui/icons-material/Public';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SyncIcon from '@mui/icons-material/Sync';
import DescriptionIcon from '@mui/icons-material/Description';
import MapIcon from '@mui/icons-material/Map';
import {ViewType} from "@/components/types";

interface SideBarProps {
    drawerWidth: number
    view: ViewType
    setView: (view: ViewType) => void
}

export default function SideBar({drawerWidth, view, setView}: SideBarProps) {
    const views = [
        {
            id: 'overview',
            label: 'Overview',
            icon: (<DashboardIcon/>),
        },
        {
            id: 'http',
            label: 'HTTP',
            icon: (<PublicIcon/>),
        },
        {
            id: 'graphsync',
            label: 'Graphsync',
            icon: (<SyncIcon/>),
        },
        {
            id: 'bitswap',
            label: 'Bitswap',
            icon: (<SwapHorizIcon/>),
        },
        {
            id: 'logs',
            label: 'Logs',
            icon: (<DescriptionIcon/>),
        },
        {
            id: 'distribution',
            label: 'Distribution',
            icon: (<MapIcon/>),
        }
    ]
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
        >
            <Toolbar/>
            <List>
                {
                    views.map(({id, label, icon}) => (
                        <ListItem key={id} disablePadding >
                            <ListItemButton onClick={() => setView(id as ViewType)} selected={id === view}>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={label}/>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </Drawer>
    )
}
