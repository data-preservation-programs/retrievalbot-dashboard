import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import Dropdown from "@/components/Dropdown";
import {DateRange} from "@/components/types";
import DateRangePicker from "@/components/DateRangePicker";
import ProtocolView from "@/components/ProtocolView";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SyncIcon from '@mui/icons-material/Sync';
import DescriptionIcon from '@mui/icons-material/Description';

export interface DashboardProps {
    dateRange: DateRange
    requester: string
    clients: string[]
    providers: string[]
    clientOptions: string[]
    providerOptions: string[]
}

export default async function Dashboard({
                                            dateRange,
                                            requester,
                                            clients,
                                            providers,
                                            clientOptions,
                                            providerOptions
                                        }: DashboardProps) {
    const drawerWidth = 200;
    return (
        <Box>
            <CssBaseline/>
            <AppBar position="sticky" sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontFamily: 'monospace',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: 1
                        }}
                    >
                        Retrieval Bot
                    </Typography>
                    <Typography
                        sx={{color: 'inherit'}}>
                        Choose a filter to get started:
                    </Typography>
                    <Box m={2}/>
                    <Dropdown id='client' selected={clients} options={clientOptions}/>
                    <Box m={2}/>
                    <Dropdown id='provider' selected={providers} options={providerOptions}/>
                    <Box m={4}/>
                    <DateRangePicker selected={dateRange}/>
                </Toolbar>
            </AppBar>
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
                    <ListItem key='overview' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Overview'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='http' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <PublicIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'HTTP'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='graphsync' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SyncIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Graphsync'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='bitswap' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SwapHorizIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Bitswap'}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='logs' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <DescriptionIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Logs'}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box sx={{marginLeft: `${drawerWidth}px`}}>
                <ProtocolView
                    requester={requester}
                    clients={['f01074655']}
                    providers={[]}
                    dateRange={dateRange}
                    module={'graphsync'}
                />
            </Box>
        </Box>
    )
}
