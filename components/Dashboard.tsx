'use client'

import {DateRange, ViewType} from "@/components/types";
import Overview from "@/components/Overview";
import ProtocolView from "@/components/ProtocolView";
import {LogView} from "@/components/LogView";
import Distribution from "@/components/Distribution";

export interface DashboardProps {
    requester: string
    clients: string[]
    providers: string[]
    dateRange: DateRange
    view: ViewType
}

export default function Dashboard({
                                            requester,
                                            clients,
                                            providers,
                                            dateRange,
                                            view,
                                        }: DashboardProps) {

    switch(view) {
        case 'overview':
            return (
                <Overview
                    requester={requester}
                    clients={clients}
                    providers={providers}
                    dateRange={dateRange}
                />
            )
        case 'http':
            return (
                <ProtocolView
                    requester={requester}
                    clients={clients}
                    providers={providers}
                    dateRange={dateRange}
                    module={'http'}
                />
            )
        case 'graphsync':
            return (
                <ProtocolView
                    requester={requester}
                    clients={clients}
                    providers={providers}
                    dateRange={dateRange}
                    module={'graphsync'}
                />
            )
        case 'bitswap':
            return (
                <ProtocolView
                    requester={requester}
                    clients={clients}
                    providers={providers}
                    dateRange={dateRange}
                    module={'bitswap'}
                />
            )
        case 'logs':
            return (
                <LogView
                    requester={requester}
                    clients={clients}
                    providers={providers}
                />
            )
        case 'distribution':
            return <Distribution clients={clients} />
    }
    return (
        <></>
    )
}
