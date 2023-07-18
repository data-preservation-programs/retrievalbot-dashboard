import {MongoClient} from 'mongodb';
import {DateFormatMap, DateRange, DateRangeFuncMap} from "@/components/types";

const client = new MongoClient(process.env.MONGO_URI!)
const taskResult = client.db('prod').collection('task_result')

export type ModuleName = 'graphsync' | 'http' | 'bitswap'

export type TimeSeriesEntry = {
    date: string,
    status: string,
    provider: string,
    client: string,
    count: number
}

export async function getClients(requester: string, providers: string[]) : Promise<string[]> {
    const match: any = {}
    match['task.requester'] = requester
    if (providers.length > 0) {
        match['task.provider.id'] = {$in: providers}
    }
    const documents = await taskResult.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$task.metadata.client",
            }
        },
        {
            $project: {
                _id: 0,
                client: "$_id"
            }
        }
    ]).toArray()
    return documents.map((doc: any) => doc.client)
}

export async function getProviders(requester: string, clients: string[]) : Promise<string[]> {
    const match: any = {}
    match['task.requester'] = requester
    if (clients.length > 0) {
        match['task.metadata.client'] = {$in: clients}
    }
    const documents = await taskResult.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: "$task.provider.id",
            }
        },
        {
            $project: {
                _id: 0,
                provider: "$_id"
            }
        }]).toArray()
    return documents.map((doc: any) => doc.provider)
}

export async function getTimeSeries(
    requester: string,
    clients: string[],
    providers: string[],
    module: ModuleName,
    dateRange: DateRange)
    : Promise<TimeSeriesEntry[]> {
    const dateFormat = DateFormatMap[dateRange]
    const today = new Date()
    const to = today
    const from = DateRangeFuncMap[dateRange](today)
    const match: any = {}
    match['task.requester'] = requester
    if (clients.length == 0 && providers.length == 0) {
        return []
    }
    if (clients.length > 0) {
        match['task.metadata.client'] = {$in: clients}
    }
    if (providers.length > 0) {
        match['task.provider.id'] = {$in: providers}
    }
    match['task.module'] = module
    match['created_at'] = {
        $gte: from,
        $lte: to
    }
    const documents = await taskResult.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: {
                    status: {
                        $cond: {
                            if: {$eq: ["$result.success", true]},
                            then: "success",
                            else: "$result.error_code"
                        }
                    },
                    date: {
                        $dateToString: {
                            format: dateFormat,
                            date: "$created_at",
                            timezone: "UTC",
                        }
                    },
                    provider: "$task.provider.id",
                    client: "$task.metadata.client"
                },
                count: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id.date",
                status: "$_id.status",
                provider: "$_id.provider",
                client: "$_id.client",
                count: 1,
            }
        },
        {
            $sort: {
                date: 1
            }
        }
    ]).toArray()
    return documents as TimeSeriesEntry[]
}


