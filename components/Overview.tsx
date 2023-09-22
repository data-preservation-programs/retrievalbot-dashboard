'use client'

import {useEffect, useState} from "react";
import {DateRange, GenerateParams, RankBarEntry} from "@/components/types";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {ModuleName, OverviewInfoErrorBreakdown, OverviewTimeSeriesEntry, Results, TimeSeriesEntry, Error,  ModuleDayCount} from "@/util/retrieval";
import dynamic from "next/dynamic";
import {OverviewTimeSeriesRawData, TimeSeriesRawData} from "@/components/TimeSeries";
import StackedApacheEchart from "./ApacheStackedBar";
import PercentStackedApacheEchart from "./ApacheStackedBarPercent";
import Alert from '@mui/material/Alert';

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
    const overviewDataList: {
        overviewTimeSeries: OverviewTimeSeriesRawData,
        setOverviewTimeSeries: (_: OverviewTimeSeriesRawData) => void,
    }[] = []
    const [overviewTimeSeries, setOverviewTimeSeries] = useState<OverviewTimeSeriesRawData>([dateRange, []])
    overviewDataList.push({overviewTimeSeries, setOverviewTimeSeries})
    for (const name of ['http', 'graphsync', 'bitswap'] as ModuleName[]) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [timeSeries, setTimeSeries] = useState<TimeSeriesRawData>([dateRange, []])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        
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
            fetch('/api/overviewinfo?' + 
            GenerateParams(dateRange))
            .then(res => res.json())
            .then((r: OverviewTimeSeriesEntry[]) => {
                overviewDataList[0].setOverviewTimeSeries([dateRange, r])
            }).catch(console.error)
            return;
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
        return overviewInfoView(overviewDataList);
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

function overviewInfoView(overviewDataList: { overviewTimeSeries: OverviewTimeSeriesRawData; setOverviewTimeSeries: (_: OverviewTimeSeriesRawData) => void; }[]) {
    var totalCalls = new Map([
        ["http", 0],
        ["graphsync", 0],
        ["bitswap", 0]
    ]);

    var totalRequestByDayOverViewInfoData: any[] = [];
    var totalErrorBreakdownByDayOverViewInfoData: any[] = [];
    var totalSuccessVsFailureByDayOverViewInfoData: any[] = [];

    // remove the first day because it don't have a full days worth of data.
    overviewDataList[0].overviewTimeSeries[1].forEach(function (day: any) {
        var successCount = 0;
        var failureCount = 0;
        var totalModuleRequestByDay: ModuleDayCount[] = [];
        const errors = new Map<string, Error>();
        day.results.forEach(function (r: Results) {
            const count = totalCalls.get(r.module) as number;
            totalCalls.set(r.module, count + Number(r.total));
            totalModuleRequestByDay.push({ module: r.module, total: Number(r.total) });
            r.result.forEach(function (e) {
                if (e.errors.success) {
                    successCount += Number(e.total);
                }
                else {
                    var err_code = e.errors.error_code as string;
                    if (!errors.has(err_code)) {
                        errors.set(err_code, { error_code: err_code, total: 0 });
                    }
 
                    var errorObject = errors.get(err_code) as Error;
                    errorObject.total += Number(e.total);
                    failureCount += Number(e.total);
                }
            });
        });
        totalErrorBreakdownByDayOverViewInfoData.push(totalErrorBreakdownByDayOverViewInfo(day._id, { id: day._id, errors: Array.from(errors.values()) }))
        totalRequestByDayOverViewInfoData.push(totalRequestByDayOverViewInfo(day._id, totalModuleRequestByDay));
        totalSuccessVsFailureByDayOverViewInfoData.push(totalSuccessVsFailureOverViewInfo(day._id, {success: successCount, failure: failureCount }));
    });

    const totalCallsData = [
        { id: "http", value: totalCalls.get("http") },
        { id: "bitswap", value: totalCalls.get("bitswap") },
        { id: "graphsync", value: totalCalls.get("graphsync") },
    ];

    var overviewInfoPercentData:{title: string, data: any[]}[] = []
    overviewInfoPercentData.push({title: "Total Calls Success VS Failure Per Day", data: totalSuccessVsFailureByDayOverViewInfoData})
    var overviewInfoData:{title: string, data: any[]}[] = []
    overviewInfoData.push({title: "Total Calls Per Module Per Day", data: totalRequestByDayOverViewInfoData})
    overviewInfoData.push({title: "Total Errors Per Day", data: totalErrorBreakdownByDayOverViewInfoData})

    //return <Echart></Echart>

    return (<div>
        <Grid item xs={12}>
            <Alert severity="info">
                Data has been collected from several Retrieval Bot instances run by <strong>Protocol Labs, Filecoin Foundation,</strong> and <strong>Slingshot</strong>.
            </Alert>
        </Grid>
        <Grid container spacing={12} key={0} p={3}>
            {totalCallsData.map(({ id, value }, index) => (
                <Grid item md={4} key={index}>
                    <Paper elevation={12}>
                        <Typography variant="subtitle1" align={'center'}>
                            {id.toUpperCase()} Total Call Count Last 30 days
                        </Typography>
                        <Typography variant="h4" align={'center'}>
                            {value}
                        </Typography>
                    </Paper>
                </Grid>))}
        </Grid>
        <Grid container spacing={12} p={3} key={0}>
        {overviewInfoPercentData.map(({ title, data }, index) => (
        <Grid item md={12} key={index}>
                <Typography variant="h6">
                {title}
                </Typography>
                <Paper elevation={12}>
                    <div>
                        <PercentStackedApacheEchart data={data}/>
                    </div>
                </Paper>
            </Grid>
        ))}
        </Grid>
        <Grid container spacing={12} p={3}>
        {overviewInfoData.map(({ title, data }, index) => (
        <Grid item md={12} key={index}>
                <Typography variant="h6">
                {title}
                </Typography>
                <Paper elevation={12}>
                    <div>
                        <StackedApacheEchart data={data}/>
                    </div>
                </Paper>
            </Grid>
        ))}
        </Grid>
    </div>);
}

export function totalRequestByDayOverViewInfo(day: string, totalPerModule: ModuleDayCount[]) {
    var object = {}
    // @ts-ignore
    object["id"] = day
    totalPerModule.forEach(e => {
        // @ts-ignore
        object[e.module] = e.total
    })

    return object
}

export function totalErrorBreakdownByDayOverViewInfo(day: string, totalErrors: OverviewInfoErrorBreakdown) {
    var object = {}
    // @ts-ignore
    object["id"] = day
    totalErrors.errors.forEach(e => {
        // @ts-ignore
        object[e.error_code] = e.total
    })

    return object
}

export function totalSuccessVsFailureOverViewInfo(day: string, successVsFailure: any) {
    var object = {}
    // @ts-ignore
    object["id"] = day
    // @ts-ignore
    object["success"] = successVsFailure["success"]
    // @ts-ignore
    object["failure"] = successVsFailure["failure"]

    return object
}

