'use client'
import {RankBarEntry} from "@/components/types";
import {ResponsiveBar} from "@nivo/bar";
import xbytes from 'xbytes';

interface RankBarProps {
    rawData: RankBarEntry[]
}

export default function DealRankBar({rawData}: RankBarProps) {
    const rawDataSorted = [...rawData].sort((a, b) => a.value - b.value) as any;
    return (
        <ResponsiveBar
            data={rawDataSorted}
            colorBy={'indexValue'}
            layout='horizontal'
            minValue={0}
            valueFormat={value => xbytes(value, {iec: true})}
            margin={{top: 20, right: 20, bottom: 50, left: 100}}
            axisLeft={{
                tickPadding: 20,
            }}
            axisBottom={{
                format: (value: number) => xbytes(value, {iec: true})
            }}
            labelSkipWidth={12}
        />
    )
}


