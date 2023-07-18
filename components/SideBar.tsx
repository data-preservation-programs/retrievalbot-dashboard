import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from '@mui/icons-material/Public';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SyncIcon from '@mui/icons-material/Sync';
import DescriptionIcon from '@mui/icons-material/Description';
import {GenerateParams, ParsedParams} from "@/components/types";
import Link from "next/link";

interface SideBarProps {
    drawerWidth: number
    params: ParsedParams
}

export default function SideBar({params, drawerWidth}: SideBarProps) {
    const paramsString = GenerateParams(params)

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
                <ListItem key='overview' disablePadding >
                    <Link href={"/?" + paramsString} passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Overview'}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem key='http' disablePadding >
                    <Link href={"/http?" + paramsString} passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <PublicIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'HTTP'}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem key='graphsync' disablePadding >
                    <Link href={"/graphsync?" + paramsString} passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <SyncIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Graphsync'}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem key='bitswap' disablePadding >
                    <Link href={"/bitswap?" + paramsString} passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <SwapHorizIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Bitswap'}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem key='logs' disablePadding >
                    <Link href={"/logs?" + paramsString} passHref legacyBehavior>
                        <ListItemButton component="a">
                            <ListItemIcon>
                                <DescriptionIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Logs'}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
            </List>
        </Drawer>
    )
}
