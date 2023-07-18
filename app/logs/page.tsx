import {ParseParams} from "@/components/types";
import Dashboard from "@/components/Dashboard";
import {Typography} from "@mui/material";
import { LogView } from "@/components/LogView";

export default async function Page({searchParams}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const parsedParams = ParseParams(searchParams)
    return (
        <main>
            <Dashboard
                params={parsedParams}
            >
                <Typography variant='h5'>
                    Logs
                </Typography>
                <LogView params={parsedParams} />
            </Dashboard>
        </main>
    )
}
