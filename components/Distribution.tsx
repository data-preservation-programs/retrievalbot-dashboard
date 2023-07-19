'use client'

import {GenerateParams, RankBarEntry} from "@/components/types";
import {useEffect, useState} from "react";
import {ProviderDistribution, ProviderLocation} from "@/util/statemarket";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DealRankBar from "@/components/DealRankBar";
import Grid from "@mui/material/Grid/Grid";

interface DistributionProps {
    clients: string[]
}

export default function Distribution({clients}: DistributionProps) {
    const [dealRank, setDealRank] = useState<RankBarEntry[]>([])
    const [location, setLocation] = useState<ProviderLocation[]>([])

    const getClientsUrl = '/api/provider_distribution?' + GenerateParams(undefined, clients, undefined, undefined)
    useEffect(() => {
        fetch(getClientsUrl).then(res => res.json()).then((data: ProviderDistribution[]) => {
            const rank: RankBarEntry[] = []
            data.forEach((entry: ProviderDistribution) => {
                rank.push({
                    id: entry.provider,
                    value: parseInt(entry.total_deal_size)
                })
            })
            setDealRank(rank)
            return data.map((entry: ProviderDistribution) => entry.provider)
        }).then(providers => fetch('/api/provider_location?' + GenerateParams(undefined, undefined, providers, undefined)))
            .then(res => res.json())
            .then(setLocation)
            .catch(console.error)
    }, [clients])

    if (clients.length === 0) {
        return (
            <h3>
                No clients selected
            </h3>
        )
    }
    return (
        <Box>
            <h2>Distribution</h2>
            <Grid container spacing={10} key={0} p={3}>
                <Grid item md={12}>
                    <div style={{height: 600}}>
                        <DealRankBar rawData={dealRank}/>
                    </div>
                </Grid>
                <Grid item md={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Provider ID</TableCell>
                                    <TableCell align="right">Location</TableCell>
                                    <TableCell align="right">Org</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {location.map((l) => (
                                    <TableRow key={l.minerId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component='th' scope='row'>{l.minerId}</TableCell>
                                        <TableCell align='right'>{`${l.ipinfoCity}, ${l.ipinfoRegion}, ${l.ipinfoCountry}`}</TableCell>
                                        <TableCell align='right'>{l.ipinfoOrg}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    )
}
