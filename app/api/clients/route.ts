import {NextRequest, NextResponse} from "next/server";
import {getClientsCached} from "@/util/db";
import {ExtractSearchParams} from "@/app/api/util";

export async function GET(request: NextRequest): Promise<NextResponse>{
    console.log(request.url)
    const {providers, requester} = ExtractSearchParams(request)
    const clients = await getClientsCached(requester, providers)
    return NextResponse.json(clients)
}
