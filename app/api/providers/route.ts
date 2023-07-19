import {NextRequest, NextResponse} from "next/server";
import {getProvidersCached} from "@/util/db";
import {ExtractSearchParams} from "@/app/api/util";

export async function GET(request: NextRequest): Promise<NextResponse>{
    console.log(request.url)
    const {clients, requester} = ExtractSearchParams(request)
    const providers = await getProvidersCached(requester, clients)
    return NextResponse.json(providers)
}
