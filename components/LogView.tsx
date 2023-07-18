import {ParsedParams} from "@/components/types";
import {getLogs} from "@/util/db";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

interface LogViewProps {
    params: ParsedParams;
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

export async function LogView({params}: LogViewProps) {
    const {requester, client, provider} = params;
    const logs: TaskResult[] = await getLogs(requester, provider, client);
    return (
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
    )
}
