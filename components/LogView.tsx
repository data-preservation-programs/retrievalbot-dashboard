'use client'

import {
    Box, Checkbox, FormControlLabel,
    FormGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {ModuleName} from "@/util/db";

interface LogViewProps {
    requester: string;
    clients: string[];
    providers: string[];
}

interface TaskResult {
    _id: string;
    created_at: Date;
    result: {
        downloaded: number
        duration: number
        error_code: string
        error_message: string
        speed: number
        success: boolean
        ttfb: number
    };
    task: {
        content: {
            cid: string
        }
        metadata: {
            deal_id: string
        }
        module: string
        provider: {
            id: string
        }
    }
    retriever: {
        isp: string
        city: string
        country: string
    }
}

function GenerateLogParams(requester: string, clients: string[], providers: string[], modules: ModuleName[], errorOnly: boolean): string {
    const params = new URLSearchParams()
    params.set('requester', requester)
    params.set('clients', clients.join(' '))
    params.set('providers', providers.join(' '))
    params.set('modules', modules.join(' '))
    params.set('errorOnly', errorOnly.toString())
    return params.toString()
}

export function LogView({requester, clients, providers}: LogViewProps) {
    const [logs, setLogs] = useState<TaskResult[]>([]);
    const [errorOnly, setErrorOnly] = useState<boolean>(false);
    const [modules, setModules] = useState<ModuleName[]>(['http', 'graphsync', 'bitswap']);

    useEffect(() => {
        if (clients.length === 0 && providers.length === 0) {
            return
        }
        fetch('/api/logs?' + GenerateLogParams(requester, clients, providers, modules, errorOnly))
            .then(res => res.json()).then(setLogs).catch(console.error)
    }, [requester, clients, providers, errorOnly, modules])

    if (clients.length === 0 && providers.length === 0) {
        return (
            <Typography variant="body1">
                Please select at least one client or provider.
            </Typography>
        )
    }

    return (
        <Box>
            <FormGroup row={true}>
                <FormControlLabel control={<Checkbox/>} label={"Error only"} onChange={(_event, checked) => {
                    setErrorOnly(checked)
                }} />
                <FormControlLabel control={<Checkbox defaultChecked/>} label={"HTTP"} onChange={(_event, checked) => {
                    if (checked) {
                        setModules([...modules, 'http'])
                    } else {
                        setModules(modules.filter(m => m !== 'http'))
                    }
                }}/>
                <FormControlLabel control={<Checkbox defaultChecked/>} label={"Graphsync"} onChange={(_event, checked) => {
                    if (checked) {
                        setModules([...modules, 'graphsync'])
                    } else {
                        setModules(modules.filter(m => m !== 'graphsync'))
                    }
                }}/>
                <FormControlLabel control={<Checkbox defaultChecked/>} label={"Bitswap"} onChange={(_event, checked) => {
                    if (checked) {
                        setModules([...modules, 'bitswap'])
                    } else {
                        setModules(modules.filter(m => m !== 'bitswap'))
                    }
                }}/>
            </FormGroup>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Created At</TableCell>
                            <TableCell align="right">Deal ID</TableCell>
                            <TableCell align="right">Provider</TableCell>
                            <TableCell align="right">Retriever</TableCell>
                            <TableCell align="right">Protocol</TableCell>
                            <TableCell align="right">Result</TableCell>
                            <TableCell align="right">Error Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component='th' scope='row'>{log.created_at.toLocaleString()}</TableCell>
                                <TableCell align='right'>{log.task.metadata.deal_id}</TableCell>
                                <TableCell align='right'>{log.task.provider.id}</TableCell>
                                <TableCell align='right'>{log.retriever.isp}</TableCell>
                                <TableCell align='right'>{log.task.module}</TableCell>
                                <TableCell align='right'>{log.result.success ? 'success' : log.result.error_code}</TableCell>
                                <TableCell align='right' sx={{
                                    wordBreak: 'break-all',
                                    maxWidth: '30%',
                                    width: '30%',
                                    whiteSpace: 'normal',
                                }}>{log.result.error_message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
