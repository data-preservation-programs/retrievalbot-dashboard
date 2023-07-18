'use client'
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {GenerateParams, ParsedParams} from "@/components/types";
import {usePathname, useRouter} from "next/navigation";

interface DateRangePickerProps {
    params: ParsedParams;
}

export default function DateRangePicker({ params } : DateRangePickerProps) {
    const selected = params.dateRange
    const router = useRouter();
    const pathname = usePathname();
    console.log(selected)
    return (
        <ToggleButtonGroup
            value={selected}
            exclusive
            onChange={(event, value) => {
                event.preventDefault();
                if (value !== null) {
                    params.dateRange = value
                    router.push(pathname + '?' + GenerateParams(params))
                }
            }}
        >
            <ToggleButton value={'1h'}>1h</ToggleButton>
            <ToggleButton value={'24h'}>24h</ToggleButton>
            <ToggleButton value={'3d'}>3d</ToggleButton>
            <ToggleButton value={'14d'}>14d</ToggleButton>
            <ToggleButton value={'30d'}>30d</ToggleButton>
        </ToggleButtonGroup>
    )
}
