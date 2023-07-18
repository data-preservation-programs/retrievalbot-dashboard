import {FilterProps} from "@/components/types";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {getTimeSeries, ModuleName} from "@/util/db";
import dynamic from "next/dynamic";

interface ProtocolViewProps extends FilterProps {
    module: ModuleName;
}

const LazyTimeSeries = dynamic(() => import('@/components/TimeSeries'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default async function ProtocolView({requester, clients, providers, module, dateRange}: ProtocolViewProps) {
    const rawData = await getTimeSeries(requester, clients, providers, module, dateRange)
    const clientSet = new Set<string>();
    const providerSet = new Set<string>();
    for (const data of rawData) {
        clientSet.add(data.client);
        providerSet.add(data.provider);
    }
    const clientList = Array.from(clientSet);
    const providerList = Array.from(providerSet);
    const rawDataPerClient = clientList.map((client) => rawData.filter((data) => data.client === client));
    const rawDataPerProvider = providerList.map((provider) => rawData.filter((data) => data.provider === provider));

    return (
        <div>
            <Grid container spacing={10} p={3}>
                <Grid item md={6}>
                    <Typography variant="h6">
                        Overall Status Breakdown (Count)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawData}
                                dateRange={dateRange}
                                type={'status-count'}/>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={6}>
                    <Typography variant="h6">
                        Overall Status Breakdown (Ratio)
                    </Typography>
                    <Paper elevation={12}>
                        <div style={{height: 400}}>
                            <LazyTimeSeries
                                rawData={rawData}
                                dateRange={dateRange}
                                type={'status'}/>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            {
                rawDataPerClient.length > 1 && rawDataPerClient.map((rawData, index) => (
                    <Grid container spacing={10} p={3} key={index}>
                        <Grid item md={6}>
                            <Typography variant="h6">
                                Client {clientList[index]} Status Breakdown (Count)
                            </Typography>
                            <Paper elevation={12}>
                                <div style={{height: 400}}>
                                    <LazyTimeSeries
                                        rawData={rawData}
                                        dateRange={dateRange}
                                        type={'status-count'}/>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant="h6">
                                Client {clientList[index]} Status Breakdown (Ratio)
                            </Typography>
                            <Paper elevation={12}>
                                <div style={{height: 400}}>
                                    <LazyTimeSeries
                                        rawData={rawData}
                                        dateRange={dateRange}
                                        type={'status'}/>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                ))
            }
            {
                rawDataPerProvider.length > 1 && rawDataPerProvider.map((rawData, index) => (
                    <Grid container spacing={10} p={3} key={index}>
                        <Grid item md={6}>
                            <Typography variant="h6">
                                Provider {providerList[index]} Status Breakdown (Count)
                            </Typography>
                            <Paper elevation={12}>
                                <div style={{height: 400}}>
                                    <LazyTimeSeries
                                        rawData={rawData}
                                        dateRange={dateRange}
                                        type={'status-count'}/>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant="h6">
                                Provider {providerList[index]} Status Breakdown (Ratio)
                            </Typography>
                            <Paper elevation={12}>
                                <div style={{height: 400}}>
                                    <LazyTimeSeries
                                        rawData={rawData}
                                        dateRange={dateRange}
                                        type={'status'}/>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                ))
            }
        </div>
    )
}
