import {ParsedParams} from "@/components/types";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {getTimeSeries, ModuleName} from "@/util/db";
import dynamic from "next/dynamic";

interface OverviewProps {
    params: ParsedParams
}

const LazyTimeSeries = dynamic(() => import('@/components/TimeSeries'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default async function Overview({params}: OverviewProps) {
    const {requester, client, provider, dateRange} = params
    const modules: ModuleName[] = ['http', 'graphsync', 'bitswap'];
    const rawDataList = await Promise.all(modules.map((module) => getTimeSeries(requester, client, provider, module, dateRange)))
    return (
        <div>
            {modules.map((module, index) => (
                <Grid container spacing={10} key={index} p={3}>
                    <Grid item md={6}>
                        <Typography variant="h6">
                            {module.charAt(0).toUpperCase() + module.slice(1)} Retrieval Success Ratio Overall
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={rawDataList[index]}
                                    dateRange={dateRange}
                                    type={'total'}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md={6} >
                        <Typography variant="h6">
                            {module.charAt(0).toUpperCase() + module.slice(1)} Retrieval Success Ratio Per Provider
                        </Typography>
                        <Paper elevation={12}>
                            <div style={{height: 400}}>
                                <LazyTimeSeries
                                    rawData={rawDataList[index]}
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
