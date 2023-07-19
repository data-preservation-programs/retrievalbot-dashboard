'use client'

import {useEffect, useState} from "react";
import {DateRange, GenerateParams, RankBarEntry} from "@/components/types";
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

const LazyRankBar = dynamic(() => import('@/components/RankBar'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default function Overview({requester, clients, providers, dateRange}: OverviewProps) {
    const rawDataList: {
        name: ModuleName,
        timeSeries: TimeSeriesEntry[],
        setTimeSeries: (_: TimeSeriesEntry[]) => void,
        rankEntries: RankBarEntry[],
        setRankEntries: (_: RankBarEntry[]) => void,
    }[] = []
    for (const name of ['http', 'graphsync', 'bitswap'] as ModuleName[]) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [timeSeries, setTimeSeries] = useState<TimeSeriesEntry[]>([])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [rankEntries, setRankEntries] = useState<RankBarEntry[]>([])
        rawDataList.push({
            name,
            timeSeries,
            setTimeSeries,
            rankEntries,
            setRankEntries
        })
    }

    useEffect(() => {
        if (clients.length === 0 && providers.length === 0) {
            return
        }
        for (const rawData of rawDataList) {
            fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, rawData.name))
                .then(res => res.json()).then((r: TimeSeriesEntry[]) => {
                rawData.setTimeSeries(r)
                const rankEntries: RankBarEntry[] = []
                const providerStats = new Map<string, [number, number]>()
                for (const entry of r) {
                    if (!providerStats.has(entry.provider)) {
                        providerStats.set(entry.provider, [0, 0])
                    }
                    if (entry.status === 'success') {
                        providerStats.get(entry.provider)![0]++
                    }
                    providerStats.get(entry.provider)![1]++
                }
                for (const [provider, [success, total]] of providerStats.entries()) {
                    rankEntries.push({
                        id: provider,
                        value: success / total
                    })
                }
                rawData.setRankEntries(rankEntries)
            }).catch(console.error)
        }
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
            {rawDataList.map(({name, timeSeries, rankEntries}, index) => (
                <Grid container spacing={10} key={index} p={3}>
                    <Grid item md={4}>
                        <Typography variant="h6">
                            {name.toUpperCase()} Retrieval Success Ratio Per Client
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={timeSeries}
                                    dateRange={dateRange}
                                    type={'client'}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={4}>
                        <Typography variant="h6">
                            {name.toUpperCase()} Retrieval Success Ratio Per Provider
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={timeSeries}
                                    dateRange={dateRange}
                                    type={'provider'}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={4}>
                        <Typography variant="h6">
                            {name.toUpperCase()} Provider Leaderboard
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyRankBar
                                    rawData={rankEntries}/>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            ))}
        </div>
    )
}
