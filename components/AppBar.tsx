'use client'
import {AppBar as MuiAppBar, Box, Toolbar, Typography} from "@mui/material";
import Dropdown from "@/components/Dropdown";
import DateRangePicker from "@/components/DateRangePicker";
import {DateRange, GenerateParams} from "@/components/types";
import {useEffect, useState} from "react";

interface AppBarProps {
    requester: string
    clients: string[]
    providers: string[]
    dateRange: DateRange
    setClients: (clients: string[]) => void
    setProviders: (providers: string[]) => void
    setDateRange: (dateRange: DateRange) => void
    drawerWidth: number
}

export default function AppBar({
                                   requester,
                                   clients,
                                   providers,
                                   dateRange,
                                   setClients,
                                   setProviders,
                                   setDateRange,
                                   drawerWidth,
                               }: AppBarProps) {
    const [clientsOptions, setClientsOptions] = useState<string[]>([])
    const [providerOptions, setProviderOptions] = useState<string[]>([])
    const getClientsUrl = '/api/clients?' + GenerateParams(requester, undefined, providers, undefined)
    const getProvidersUrl = '/api/providers?' + GenerateParams(requester, clients, undefined, undefined)

    useEffect(() => {
        fetch(getClientsUrl).then(res => res.json()).then(setClientsOptions).catch(console.error)
    }, [getClientsUrl])

    useEffect(() => {
        fetch(getProvidersUrl).then(res => res.json()).then(setProviderOptions).catch(console.error)
    }, [getProvidersUrl])

    return (
        <MuiAppBar position="sticky" sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}>
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
                <Dropdown id='client' label='Client' options={clientsOptions} selected={clients}
                          setSelected={setClients}/>
                <Box m={2}/>
                <Dropdown id='provider' label='Provider' options={providerOptions} selected={providers}
                          setSelected={setProviders}/>
                <Box m={4}/>
                <DateRangePicker selected={dateRange} setSelected={setDateRange}/>
            </Toolbar>
        </MuiAppBar>)
}
