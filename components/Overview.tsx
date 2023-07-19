'use client'

import {useEffect, useState} from "react";
import {DateRange, GenerateParams} from "@/components/types";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {ModuleName, TimeSeriesEntry} from "@/util/db";
import dynamic from "next/dynamic";

interface OverviewProps {
    requester: string;
    clients: string[];
    providers: string[];
    dateRange: DateRange;
}

const LazyTimeSeries = dynamic(() => import('@/components/TimeSeries'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default function Overview({requester, clients, providers, dateRange}: OverviewProps) {
    const rawDataList: [ModuleName, [TimeSeriesEntry[], (_: TimeSeriesEntry[]) => void]][] = [
        ['http', useState<TimeSeriesEntry[]>([])],
        ['graphsync', useState<TimeSeriesEntry[]>([])],
        ['bitswap', useState<TimeSeriesEntry[]>([])],
    ]

    useEffect(() => {
        if (clients.length === 0 && providers.length === 0) {
            return
        }
        fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, 'http'))
            .then(res => res.json()).then(rawData => {
            rawDataList[0][1][1](rawData)
        }).catch(console.error)
        fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, 'graphsync'))
            .then(res => res.json()).then(rawData => {
            rawDataList[1][1][1](rawData)
        }).catch(console.error)
        fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, 'bitswap'))
            .then(res => res.json()).then(rawData => {
            rawDataList[2][1][1](rawData)
        }).catch(console.error)
    }, [requester, clients, providers, dateRange])

    if (clients.length === 0 && providers.length === 0) {
        return (
            <Typography variant="body1">
                Please select at least one client or provider.
            </Typography>
        )
    }

    return (
        <div>
            {rawDataList.map((module, index) => (
                <Grid container spacing={10} key={index} p={3}>
                    <Grid item md={6}>
                        <Typography variant="h6">
                            {module[0].toUpperCase()} Retrieval Success Ratio Per Client
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={module[1][0]}
                                    dateRange={dateRange}
                                    type={'client'}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={6}>
                        <Typography variant="h6">
                            {module[0].toUpperCase()} Retrieval Success Ratio Per Provider
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={module[1][0]}
                                    dateRange={dateRange}
                                    type={'provider'}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            ))}
        </div>
    )
}
