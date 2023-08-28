'use client'

import Grid from "@mui/material/Grid/Grid";
import {FormControl, FormControlLabel, Paper, Radio, RadioGroup, Typography} from "@mui/material";
import {ModuleName,  Results, TimeSeriesEntry, Error, OverviewTimeSeriesEntry} from "@/util/retrieval";
import dynamic from "next/dynamic";
import {DateRange, GenerateParams} from "@/components/types";
import {useEffect, useState} from "react";
import { FormLabel } from "@mui/material";
import {OverviewTimeSeriesRawData, TimeSeriesRawData} from "@/components/TimeSeries";
import { totalErrorBreakdownByDayOverViewInfo, totalSuccessVsFAilureOverViewInfo } from "./Overview";
import StackedApacheEchart from "./ApacheStackedBar";
import PercentStackedApacheEchart from "./ApacheStackedBarPercent";

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
    const [rawDataPerClient, setRawDataPerClient] = useState<[string, TimeSeriesRawData][]>([]);
    const [rawDataPerProvider, setRawDataPerProvider] = useState<[string, TimeSeriesRawData][]>([]);
    const [client, setClient] = useState<string>('');
    const [provider, setProvider] = useState<string>('');
    const overviewDataList: {
        overviewTimeSeries: OverviewTimeSeriesRawData,
        setOverviewTimeSeries: (_: OverviewTimeSeriesRawData) => void,
    }[] = []
    const [overviewTimeSeries, setOverviewTimeSeries] = useState<OverviewTimeSeriesRawData>([dateRange, []])
    overviewDataList.push({overviewTimeSeries, setOverviewTimeSeries})

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
        fetch('/api/series?' + GenerateParams(requester, clients, providers, dateRange, module))
            .then(res => res.json()).then((rawData: TimeSeriesEntry[]) => {
            const rawDataPerClient = new Map<string,TimeSeriesRawData>();
            const rawDataPerProvider = new Map<string,TimeSeriesRawData>();
            for (const data of rawData) {
                if (!rawDataPerClient.has(data.client)) {
                    rawDataPerClient.set(data.client, [dateRange, []]);
                }
                if (!rawDataPerProvider.has(data.provider)) {
                    rawDataPerProvider.set(data.provider, [dateRange, []]);
                }
                rawDataPerClient.get(data.client)![1].push(data);
                rawDataPerProvider.get(data.provider)![1].push(data);
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
        return overviewInfoView(overviewDataList, module);
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
                                rawData={rawDataPerProvider.find(([providerName, _]) => providerName === provider)?.[1] ?? ['14d', []]}
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
                                rawData={rawDataPerProvider.find(([providerName, _]) => providerName === provider)?.[1] ?? ['14d', []]}
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
                                rawData={rawDataPerClient.find(([clientName, _]) => clientName === client)?.[1] ?? ['14d', []]}
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
                                rawData={rawDataPerClient.find(([clientName, _]) => clientName === client)?.[1] ?? ['14d', []]}
                                type={'status'}/>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

function overviewInfoView(overviewDataList: { overviewTimeSeries: OverviewTimeSeriesRawData; setOverviewTimeSeries: (_: OverviewTimeSeriesRawData) => void; }[], module: string) {
    if (overviewDataList.length == 0) {
        return;
    }
    var totalCalls = new Map([
        [module, 0],
    ]);

    var totalErrorBreakdownByDayOverViewInfoData: any[] = [];
    var totalSuccessVsFailureByDayOverViewInfoData: any[] = [];

    // remove the first day because it don't have a full days worth of data.
    overviewDataList[0].overviewTimeSeries[1].forEach(function (day : any) {
        var successCount = 0;
        var failureCount = 0;
        const errors = new Map<string, Error>();
        day.results.forEach(function (r: Results) {
            if (r.module === module) {
                const count = totalCalls.get(r.module) as number;
                totalCalls.set(r.module, count + Number(r.total));
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
            }
        });
        totalErrorBreakdownByDayOverViewInfoData.push(totalErrorBreakdownByDayOverViewInfo(day._id, { id: day._id, errors: Array.from(errors.values()) }))
        totalSuccessVsFailureByDayOverViewInfoData.push(totalSuccessVsFAilureOverViewInfo(day._id, {success: successCount, failure: failureCount }));
    });

    const totalCallsData = [
        { id: module, value: totalCalls.get(module) },
    ];

    var overviewInfoPercentData:{title: string, data: any[]}[] = []
    overviewInfoPercentData.push({title: "Total Calls Success VS Failure Per Day", data: totalSuccessVsFailureByDayOverViewInfoData})
    var overviewInfoData:{title: string, data: any[]}[] = []
    overviewInfoData.push({title: "Total Errors Per Day", data: totalErrorBreakdownByDayOverViewInfoData})
    return (<div>
        <Grid container spacing={10} key={0} p={3}> 
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
