import {NextRequest, NextResponse} from "next/server";
import { getProviderLocation} from "@/util/statemarket";

export async function GET(request: NextRequest): Promise<NextResponse>{
    console.log(request.url)
    const providersParam = request.nextUrl.searchParams.get('providers')
    const providers = providersParam == null || providersParam == '' ? [] : providersParam.split(' ')
    const locations = await getProviderLocation(providers)
    console.log("Got provider location", locations.length)
    return NextResponse.json(locations)
}
