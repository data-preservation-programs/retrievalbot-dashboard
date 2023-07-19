import {NextRequest, NextResponse} from "next/server";
import {getTimeSeries} from "@/util/retrieval";
import {ExtractSearchParams} from "@/app/api/util";

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(request.url)
    const {providers, requester, clients, moduleName, dateRange} = ExtractSearchParams(request)
    if (clients.length === 0 && providers.length === 0) {
        return NextResponse.json({
            error: "Must specify at least one client or provider"
        }, {
            status: 400,
        })
    }
    const timeSeries = await getTimeSeries(requester, clients, providers, moduleName, dateRange)
    return NextResponse.json(timeSeries)
}
