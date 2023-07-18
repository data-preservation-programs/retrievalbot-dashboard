'use client'
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DateRange} from "@/components/types";
import {useRouter} from "next/navigation";

interface DateRangePickerProps {
    selected: DateRange;
}

export default function DateRangePicker({ selected} : DateRangePickerProps) {
    const router = useRouter();
    return (
        <ToggleButtonGroup
            value={selected}
            exclusive
            onChange={(event, value) => {
                event.preventDefault();
                if (value !== null) {
                    const params = new URLSearchParams(window.location.search)
                    params.set('dateRange', value)
                    router.push('?' + params.toString())
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
