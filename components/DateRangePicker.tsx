'use client'
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DateRange} from "@/components/types";

interface DateRangePickerProps {
    selected: DateRange
    setSelected: (selected: DateRange) => void
}

export default function DateRangePicker({ selected, setSelected } : DateRangePickerProps) {
    return (
        <ToggleButtonGroup
            value={selected}
            exclusive
            onChange={(_event, value) => {
                setSelected(value);
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
