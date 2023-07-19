'use client'

import {useEffect, useState} from "react";
import {DateRange, GenerateParams, RankBarEntry} from "@/components/types";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {ModuleName, TimeSeriesEntry} from "@/util/retrieval";
import dynamic from "next/dynamic";
import {TimeSeriesRawData} from "@/components/TimeSeries";

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
        timeSeries: TimeSeriesRawData,
        setTimeSeries: (_: TimeSeriesRawData) => void,
        rankEntries: RankBarEntry[],
        setRankEntries: (_: RankBarEntry[]) => void,
        percentage: number,
        setPercentage: (_: number) => void
    }[] = []
    for (const name of ['http', 'graphsync', 'bitswap'] as ModuleName[]) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [timeSeries, setTimeSeries] = useState<TimeSeriesRawData>([dateRange, []])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [rankEntries, setRankEntries] = useState<RankBarEntry[]>([])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [percentage, setPercentage] = useState<number>(0)
        rawDataList.push({
            name,
            timeSeries,
            setTimeSeries,
            rankEntries,
            setRankEntries,
            percentage,
            setPercentage
        })
    }

    useEffect(() => {
        if (clients.length === 0 && providers.length === 0) {
            return
        }
        for (const rawData of rawDataList) {
            fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, rawData.name))
                .then(res => res.json()).then((r: TimeSeriesEntry[]) => {
                rawData.setTimeSeries([dateRange, r])
                let success = 0
                let total = 0
                const rankEntries: RankBarEntry[] = []
                const providerStats = new Map<string, [number, number]>()
                for (const entry of r) {
                    if (!providerStats.has(entry.provider)) {
                        providerStats.set(entry.provider, [0, 0])
                    }
                    if (entry.status === 'success') {
                        providerStats.get(entry.provider)![0]++
                        success++
                    }
                    providerStats.get(entry.provider)![1]++
                    total++
                }
                for (const [provider, [success, total]] of providerStats.entries()) {
                    rankEntries.push({
                        id: provider,
                        value: success / total
                    })
                }
                rawData.setRankEntries(rankEntries)
                rawData.setPercentage(success / total)
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
            <Grid container spacing={10} key={0} p={3}>
                {rawDataList.map(({name, percentage}, index) => (
                    <Grid item md={2} key={index}>
                        <Paper elevation={12} >
                            <Typography variant="subtitle1" align={'center'}>
                                {name.toUpperCase()} Total Success Rate
                            </Typography>
                            <Typography variant="h4" align={'center'}>
                                {(percentage * 100).toFixed(2)} %
                            </Typography>
                        </Paper>
                    </Grid>))
                }
            </Grid>
            {rawDataList.map(({name, timeSeries, rankEntries}, index) => (
                <Grid container spacing={10} key={index+1} p={3}>
                    <Grid item md={4}>
                        <Typography variant="h6">
                            {name.toUpperCase()} Retrieval Success Ratio Per Client
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={timeSeries}
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
