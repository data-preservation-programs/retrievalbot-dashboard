import {
    Box,
    CssBaseline,
} from "@mui/material";
import {ParsedParams} from "@/components/types";
import AppBar from "@/components/AppBar";
import SideBar from "@/components/SideBar";

export interface DashboardProps {
    params: ParsedParams
    children: React.ReactNode
}

export default async function Dashboard({
                                            params,
                                            children,
                                        }: DashboardProps) {
    const drawerWidth = 200;
    return (
        <Box>
            <CssBaseline/>
            <AppBar
                params={params}
                drawerWidth={drawerWidth}
            />
            <SideBar
                drawerWidth={drawerWidth}
                params={params}
            />
            <Box sx={{marginLeft: `${drawerWidth}px`}}>
                {children}
            </Box>
        </Box>
    )
}
