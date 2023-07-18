import {ParseParams} from "@/components/types";
import Dashboard from "@/components/Dashboard";
import ProtocolView from "@/components/ProtocolView";
import {Typography} from "@mui/material";

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
                    Bitswap retrieval
                </Typography>
                <ProtocolView params={parsedParams} module='bitswap'/>
            </Dashboard>
        </main>
    )
}
