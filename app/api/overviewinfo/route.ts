import {NextResponse} from "next/server";
import {getOverviewInfo} from "@/util/retrieval";

export async function GET(): Promise<NextResponse> {
    const info = await getOverviewInfo()
    return NextResponse.json(info)
}
