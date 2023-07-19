import {NextRequest, NextResponse} from "next/server";
import {getLogs} from "@/util/retrieval";
import {ExtractSearchParams} from "@/app/api/util";

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(request.url)
    const {providers, requester, clients} = ExtractSearchParams(request)
    const modulesParam = request.nextUrl.searchParams.get('modules')
    const modules = modulesParam == null || modulesParam == '' ? [] : modulesParam.split(' ')
    const errorOnly = request.nextUrl.searchParams.get('errorOnly') === 'true'
    if (clients.length === 0 && providers.length === 0) {
        return NextResponse.json({
            error: "Must specify at least one client or provider"
        }, {
            status: 400,
        })
    }
    const logs = await getLogs(requester, clients, providers, modules, errorOnly, 50)
    return NextResponse.json(logs)
}
