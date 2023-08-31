'use client'
import {OverviewTimeSeriesEntry, TimeSeriesEntry} from "@/util/retrieval";
import {AxisFormatMap, DateFormatMap, DateRange} from "@/components/types";
import {ResponsiveLine} from "@nivo/line";

interface TimeSeriesProps {
    type: 'client' // Per client success ratio
        | 'provider' // Per provider success ratio
        | 'status-count' // Per status count
        | 'status' // Per status ratio
        | 'total' // Total success ratio
    rawData: TimeSeriesRawData
}

export type TimeSeriesRawData = [DateRange, TimeSeriesEntry[]]
export type OverviewTimeSeriesRawData = [DateRange, OverviewTimeSeriesEntry[]]

export default function TimeSeries({
                                             type,
                                             rawData
                                         }: TimeSeriesProps) {
    const axisFormat = AxisFormatMap[rawData[0]]
    const dateFormat = DateFormatMap[rawData[0]]
    const dataMap = new Map<string, Map<string, { count: number, count_success: number }>>();
    const totalPerDate = new Map<string, number>();
    for (let entry of rawData[1]) {
        totalPerDate.set(entry.date, (totalPerDate.get(entry.date) || 0) + entry.count);
        let id: string;
        switch (type) {
            case 'client':
                id = entry.client;
                break;
            case 'provider':
                id = entry.provider;
                break;
            case 'status':
            case 'status-count':
                id = entry.status;
                break;
            default:
                id = 'Success Rate';
        }
        if (!dataMap.has(id)) {
            dataMap.set(id, new Map<string, { count: number, count_success: number }>());
        }
        if (!dataMap.get(id)!.has(entry.date)) {
            dataMap.get(id)!.set(entry.date, {count: 0, count_success: 0});
        }
        const current = dataMap.get(id)!.get(entry.date)!;
        if (entry.status === 'success') {
            current.count_success += entry.count;
        }
        current.count += entry.count;
        dataMap.get(id)!.set(entry.date, current);
    }
    const data: { id: string, data: { x: string, y: number }[] }[] = [];
    for (const [id, innerMap] of dataMap.entries()) {
        const dataItem = {id, data: [] as { x: string, y: number }[]};
        for (const [x, y] of innerMap.entries()) {
            if (type === 'status-count') {
                dataItem.data.push({x, y: y.count});
            } else if (type === 'status') {
                const total = totalPerDate.get(x)!;
                dataItem.data.push({x, y: y.count / total});
            } else {
                dataItem.data.push({x, y: (y.count === 0 ? 0 : y.count_success / y.count)});
            }
        }
        data.push(dataItem);
    }
    return (
        <ResponsiveLine
            data={data}
            margin={{top: 20, right: 20, bottom: 50, left: 50}}
            curve={'monotoneX'}
            enableSlices={"x"}
            yScale={{type: 'linear', min: 0, max: type === 'status-count' ? 'auto' : 1, nice: true}}
            axisLeft={{
                legendPosition: 'middle',
                legendOffset: -40,
                format: type == 'status-count' ? undefined : (value: number) => `${(value * 100).toFixed(0)}%`
            }}
            yFormat={type == 'status-count' ? undefined : (value: any) => `${(value * 100).toFixed(2)}%`}
            xScale={{type: 'time', format: dateFormat, useUTC: true}}
            axisBottom={{
                format: axisFormat,
                legendPosition: 'middle',
                legendOffset: 40,
            }}
            legends={[{
                anchor: 'top-left',
                direction: 'column',
                translateX: 20,
                itemWidth: 80,
                itemHeight: 20,
            }]}
        />
    )
}


