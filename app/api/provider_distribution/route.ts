import {NextRequest, NextResponse} from "next/server";
import {getProviderDistribution} from "@/util/statemarket";

export async function GET(request: NextRequest): Promise<NextResponse>{
    console.log(request.url)
    const clientsParam = request.nextUrl.searchParams.get('clients')
    const clients = clientsParam == null || clientsParam == '' ? [] : clientsParam.split(' ')
    if (clients.length == 0) {
        return NextResponse.json({
            error: "No clients specified"
        }, {status: 400})
    }
    const distribution = await getProviderDistribution(clients)
    console.log("Got provider distribution", distribution.length)
    return NextResponse.json(distribution)
}
