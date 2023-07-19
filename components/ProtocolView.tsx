'use client'

import Grid from "@mui/material/Grid/Grid";
import {FormControl, FormControlLabel, Paper, Radio, RadioGroup, Typography} from "@mui/material";
import {ModuleName, TimeSeriesEntry} from "@/util/db";
import dynamic from "next/dynamic";
import {DateRange, GenerateParams} from "@/components/types";
import {useEffect, useState} from "react";
import { FormLabel } from "@mui/material";

interface ProtocolViewProps {
    requester: string;
    clients: string[];
    providers: string[];
    dateRange: DateRange;
    module: ModuleName;
}

const LazyTimeSeries = dynamic(() => import('@/components/TimeSeries'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default function ProtocolView({requester, clients, providers, dateRange, module}: ProtocolViewProps) {
    const [rawDataPerClient, setRawDataPerClient] = useState<[string, TimeSeriesEntry[]][]>([]);
    const [rawDataPerProvider, setRawDataPerProvider] = useState<[string, TimeSeriesEntry[]][]>([]);
    const [client, setClient] = useState<string>('');
    const [provider, setProvider] = useState<string>('');

    useEffect(() => {
        if (clients.length === 0 && providers.length === 0) {
            return
        }
        fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, module))
            .then(res => res.json()).then((rawData: TimeSeriesEntry[]) => {
            const rawDataPerClient = new Map<string,TimeSeriesEntry[]>();
            const rawDataPerProvider = new Map<string,TimeSeriesEntry[]>();
            for (const data of rawData) {
                if (!rawDataPerClient.has(data.client)) {
                    rawDataPerClient.set(data.client, []);
                }
                if (!rawDataPerProvider.has(data.provider)) {
                    rawDataPerProvider.set(data.provider, []);
                }
                rawDataPerClient.get(data.client)!.push(data);
                rawDataPerProvider.get(data.provider)!.push(data);
            }
            setRawDataPerClient(Array.from(rawDataPerClient.entries()));
            setRawDataPerProvider(Array.from(rawDataPerProvider.entries()));
            if (rawData.length > 0) {
                setClient(rawData[0].client);
                setProvider(rawData[0].provider);
            } else {
                setClient('');
                setProvider('');
            }
        }).catch(console.error)
    }, [requester, clients, providers, dateRange, module])

    if (clients.length === 0 && providers.length === 0) {
        return (
            <Typography variant="body1">
                Please select at least one client or provider.
            </Typography>
        )
    }

    return (
        <div>
            <Grid container spacing={10} p={3}>
                <Grid item md={2}>
                    <FormControl>
                        <FormLabel>
                            Choose a provider:
                        </FormLabel>
                        <RadioGroup value={provider} onChange={(_event, value) => {setProvider(value)}}>
                            {
                                rawDataPerProvider.map(([provider, _], index) => (
                                    <FormControlLabel key={index} value={provider} control={<Radio />} label={provider} />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item md={5}>
                    <Typography variant="h6">
                        Provider {provider} Status Breakdown (Count)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawDataPerProvider.find(([providerName, _]) => providerName === provider)?.[1] ?? []}
                                dateRange={dateRange}
                                type={'status-count'}/>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={5}>
                    <Typography variant="h6">
                        Provider {provider} Status Breakdown (Ratio)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawDataPerProvider.find(([providerName, _]) => providerName === provider)?.[1] ?? []}
                                dateRange={dateRange}
                                type={'status'}/>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={10} p={3}>
                <Grid item md={2}>
                    <FormControl>
                        <FormLabel>
                            Choose a client:
                        </FormLabel>
                        <RadioGroup value={client} onChange={(_event, value) => {setClient(value)}}>
                            {
                                rawDataPerClient.map(([client, _], index) => (
                                    <FormControlLabel key={index} value={client} control={<Radio />} label={client} />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item md={5}>
                    <Typography variant="h6">
                        Client {client} Status Breakdown (Count)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawDataPerClient.find(([clientName, _]) => clientName === client)?.[1] ?? []}
                                dateRange={dateRange}
                                type={'status-count'}/>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={5}>
                    <Typography variant="h6">
                        Client {client} Status Breakdown (Ratio)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawDataPerClient.find(([clientName, _]) => clientName === client)?.[1] ?? []}
                                dateRange={dateRange}
                                type={'status'}/>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
