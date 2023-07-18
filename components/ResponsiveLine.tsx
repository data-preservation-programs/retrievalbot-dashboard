'use client'
import {LineSvgProps, ResponsiveLine as RL} from "@nivo/line";

export interface ResponsiveLineProps extends  LineSvgProps {
    usePercentile?: boolean;
}

export default function ResponsiveLine({ usePercentile, ...otherProps }: ResponsiveLineProps) {
    if (usePercentile) {
        const axisLeft = otherProps.axisLeft || {};
        axisLeft.format = (value: number) => `${(value * 100).toFixed(0)}%`;
        otherProps.axisLeft = axisLeft;
        otherProps.yFormat = (value: any) => `${(value * 100).toFixed(2)}%`;
    }

    // Render the ResponsiveLine with all the original props, possibly modified
    return <RL {...otherProps} />;
}
