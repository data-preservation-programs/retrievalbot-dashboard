import {DateRange} from "@/components/types";
import Dashboard from "@/components/Dashboard";
import {getClients, getProviders} from "@/util/db";

export default async function Page({searchParams}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const dateRange = searchParams['dateRange'] as DateRange || '14d'
    const requester = searchParams['requester'] as string || 'filplus'
    const clients = searchParams['client'] == null || searchParams['client'] == '' ? [] : (searchParams['client'] as string).split(',')
    const providers = searchParams['provider'] == null || searchParams['provider'] == '' ? [] : (searchParams['provider'] as string).split(',')
    const clientOptions = await getClients(requester, providers)
    const providerOptions = await getProviders(requester, clients)
    return (
        <main>
            <Dashboard requester={requester}
                       dateRange={dateRange}
                       clients={clients}
                       providers={providers}
                       clientOptions={clientOptions}
                       providerOptions={providerOptions}/>
        </main>
    )
}
