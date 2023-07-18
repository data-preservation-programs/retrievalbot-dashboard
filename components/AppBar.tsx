import {AppBar as MuiAppBar, Box, Toolbar, Typography} from "@mui/material";
import Dropdown from "@/components/Dropdown";
import DateRangePicker from "@/components/DateRangePicker";
import {ParsedParams} from "@/components/types";
import {getClients, getProviders} from "@/util/db";
import {LRUCache} from 'lru-cache';

const cacheOptions: LRUCache.Options<string, string[], unknown> = {
    max: 1000,
    maxSize: 1000000,
    sizeCalculation: (value, _) => value.length + 1,
    allowStale: true,
    fetchMethod: (key: string) => {
        const [type, requester, values] = key.split('#')
        const split = values === '' ? [] : values.split(',')
        switch (type) {
            case 'client':
                return getClients(requester, split)
            case 'provider':
                return getProviders(requester, split)
        }
        return []
    },
}

const cache = new LRUCache<string, string[]>(cacheOptions)

interface AppBarProps {
    params: ParsedParams
    drawerWidth: number
}

export default async function AppBar({
                                         params,
                                         drawerWidth
                                     }: AppBarProps) {
    const {requester, client, provider} = params
    client.sort()
    provider.sort()
    const clientOptions = await cache.fetch('client#' + requester + '#' + provider.join(','))
    const providerOptions = await cache.fetch('provider#' + requester + '#' + client.join(','))
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
                <Dropdown id='client' options={clientOptions!} params={params}/>
                <Box m={2}/>
                <Dropdown id='provider' options={providerOptions!} params={params}/>
                <Box m={4}/>
                <DateRangePicker params={params}/>
            </Toolbar>
        </MuiAppBar>)
}
