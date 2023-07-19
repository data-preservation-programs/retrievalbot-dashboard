import {NextRequest} from "next/server";
import {DateRange} from "@/components/types";
import {ModuleName} from "@/util/retrieval";

export interface ExtractedSearchParams {
    requester: string
    providers: string[]
    clients: string[]
    dateRange: DateRange
    moduleName: ModuleName
}

export function ExtractSearchParams(request: NextRequest): ExtractedSearchParams {
    const requester = request.nextUrl.searchParams.get('requester')!
    const providersParam = request.nextUrl.searchParams.get('providers')
    const providers = providersParam == null || providersParam == '' ? [] : providersParam.split(' ')
    const clientsParam = request.nextUrl.searchParams.get('clients')
    const clients = clientsParam == null || clientsParam == '' ? [] : clientsParam.split(' ')
    const dateRange: DateRange = (request.nextUrl.searchParams.get('dateRange')) as DateRange
    const moduleName: ModuleName = request.nextUrl.searchParams.get('module') as ModuleName
    return {requester, providers, clients, dateRange, moduleName}
}
