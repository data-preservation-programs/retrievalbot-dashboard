import {ModuleName} from "@/util/db";

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

export function GenerateParams(requester?: string, clients?: string[], providers?: string[], dateRange?: DateRange, moduleName?: ModuleName): string {
    const params = new URLSearchParams()
    if (requester !== undefined)
    {
        params.set('requester', requester)
    }
    if (clients !== undefined && clients.length > 0) {
        params.set('clients', clients.join(' '))
    }
    if (providers !== undefined && providers.length > 0) {
        params.set('providers', providers.join(' '))
    }
    if (dateRange !== undefined) {
        params.set('dateRange', dateRange)
    }
    if (moduleName !== undefined) {
        params.set('module', moduleName)
    }
    return params.toString()
}


export type ViewType = 'overview' | 'http' | 'graphsync' | 'bitswap' | 'logs'

export interface RankBarEntry {
    id: string,
    value: number,
}
