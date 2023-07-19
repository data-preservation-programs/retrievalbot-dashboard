'use client'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface DropdownProps {
    id: string;
    label: string;
    options: string[];
    selected: string[];
    setSelected: (selected: string[]) => void;
}

export default function Dropdown({id, label, options, selected, setSelected}: DropdownProps) {
    return (
        <Autocomplete
            color={'inherit'}
            multiple
            id={id}
            options={options}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder={label} sx={{ backgroundColor: 'white' }}/>)}
            value={selected}
            sx={{width: 300}}
            onChange={(event, value) => {
                event.preventDefault();
                setSelected(value);
            }}
        />
    )
}
