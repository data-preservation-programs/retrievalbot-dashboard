export type DateRange = '30d' | '14d' | '3d' | '24h' | '1h'

export const AxisFormatMap = {
    '30d': '%m-%d',
    '3d': '%m-%d %H:%M',
    '24h': '%H:%M',
    '1h': '%H:%M',
    '14d': '%m-%d',
}

export const DateFormatMap = {
    '30d': '%Y-%m-%d',
    '3d': '%Y-%m-%dT%H',
    '24h': '%Y-%m-%dT%H',
    '1h': '%Y-%m-%dT%H:%M',
    '14d': '%Y-%m-%d',
}

export const DateRangeFuncMap = {
    '30d': (date: Date) => {
        const d = new Date()
        d.setDate(date.getDate() - 30)
        return d
    },
    '3d': (date: Date) => {
        const d = new Date()
        d.setDate(date.getDate() - 3)
        return d
    },
    '24h': (date: Date) => {
        const d = new Date()
        d.setDate(date.getDate() - 1)
        return d
    },
    '1h': (date: Date) => {
        const d = new Date()
        d.setHours(date.getHours() - 1)
        return d
    },
    '14d': (date: Date) => {
        const d = new Date()
        d.setDate(date.getDate() - 14)
        return d
    }
}

export interface ParsedParams {
    requester: string;
    client: string[];
    provider: string[];
    dateRange: DateRange;
}

function isEmpty(obj: string | string[] | undefined): boolean {
    if (obj === undefined) {
        return true
    }
    if (typeof obj === 'string') {
        return obj === ''
    }
    if (Array.isArray(obj)) {
        return obj.length === 0
    }
    return true
}

export function ParseParams(searchParams: { [key: string]: string | string[] | undefined }): ParsedParams {
    const dateRange = isEmpty(searchParams['dateRange']) ? '14d' : searchParams['dateRange'] as DateRange
    const client = isEmpty(searchParams['client']) ? [] : (searchParams['client'] as string).split(',')
    const provider = isEmpty(searchParams['provider']) ? [] : (searchParams['provider'] as string).split(',')
    const requester = isEmpty(searchParams['requester']) ? 'filplus' : searchParams['requester'] as string
    return {
        requester,
        client,
        provider,
        dateRange,
    }
}

export function GenerateParams(result: ParsedParams): string {
    const {requester, client, provider, dateRange} = result
    const params = new URLSearchParams()
    if (requester !== '' && requester !== 'filplus') {
        params.set('requester', requester)
    }
    if (client.length > 0) {
        params.set('client', client.join(','))
    }
    if (provider.length > 0) {
        params.set('provider', provider.join(','))
    }
    params.set('dateRange', dateRange)
    return params.toString()
}
