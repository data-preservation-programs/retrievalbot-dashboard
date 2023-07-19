'use client'
import {RankBarEntry} from "@/components/types";
import {ResponsiveBar} from "@nivo/bar";

interface RankBarProps {
    rawData: RankBarEntry[]
}

export default function RankBar({rawData}: RankBarProps) {
    const rawDataSorted = [...rawData].sort((a, b) => a.value - b.value) as any;
    return (
        <ResponsiveBar
            data={rawDataSorted}
            colorBy={'indexValue'}
            layout='horizontal'
            minValue={0}
            maxValue={1}
            valueFormat={value => `${(value * 100).toFixed(0)}%`}
            margin={{top: 20, right: 20, bottom: 50, left: 100}}
            axisLeft={{
                tickPadding: 20,
            }}
            axisBottom={{
                format: (value: number) => `${(value * 100).toFixed(0)}%`
            }}
            labelSkipWidth={12}
        />
    )
}


