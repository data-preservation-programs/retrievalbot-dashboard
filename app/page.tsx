'use client'
import {DateRange, ViewType} from "@/components/types";
import {Box, CssBaseline} from "@mui/material";
import AppBar from "@/components/AppBar";
import SideBar from "@/components/SideBar";
import {useSearchParams} from "next/navigation";
import {useState} from "react";
import Dashboard from "@/components/Dashboard";

export default function Page({}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const drawerWidth = 200;
    const searchParams = useSearchParams();
    const requester = searchParams.get('requester') || 'filplus'
    const defaultClients = searchParams.get('clients')?.split(' ') || []
    const defaultProviders = searchParams.get('providers')?.split(' ') || []
    const defaultDateRange = (searchParams.get('dateRange') || '14d') as DateRange
    const defaultView = (searchParams.get('view') || 'overview') as ViewType
    const [clients, setClients] = useState<string[]>(defaultClients)
    const [providers, setProviders] = useState<string[]>(defaultProviders)
    const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
    const [view, setView] = useState<ViewType>(defaultView)
    return (
        <main>
            <Box>
                <CssBaseline/>
                <AppBar
                    requester={requester}
                    clients={clients}
                    providers={providers}
                    dateRange={dateRange}
                    setClients={setClients}
                    setProviders={setProviders}
                    setDateRange={setDateRange}
                    drawerWidth={drawerWidth}
                />
                <SideBar
                    view={view}
                    setView={setView}
                    drawerWidth={drawerWidth}
                />
                <Box sx={{marginLeft: `${drawerWidth}px`}}>
                    <Dashboard
                        requester={requester}
                        clients={clients}
                        providers={providers}
                        dateRange={dateRange}
                        view={view}
                    />
                </Box>
            </Box>
        </main>
    )
}
