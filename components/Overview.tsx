import { FilterProps} from "@/components/types";
import TimeSeries from "@/components/TimeSeries";
import Grid from "@mui/material/Grid/Grid";
import {Paper, Typography} from "@mui/material";
import {getTimeSeries, ModuleName} from "@/util/db";

interface OverviewProps extends FilterProps {
}

export default async function Overview({requester, clients, providers, dateRange}: OverviewProps) {
    const modules: ModuleName[] = ['http', 'graphsync', 'bitswap'];
    const rawDataList = await Promise.all(modules.map((module) => getTimeSeries(requester, clients, providers, module, dateRange)))
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
                                <TimeSeries
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
                                <TimeSeries
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
