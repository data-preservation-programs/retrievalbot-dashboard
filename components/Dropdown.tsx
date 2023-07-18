'use client'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useRouter} from "next/navigation";

interface DropdownProps {
    id: string
    selected: string[];
    options: string[];
}

export default function Dropdown({id, selected, options}: DropdownProps) {
    const idUpper = id.charAt(0).toUpperCase() + id.slice(1)
    const router = useRouter();

    return (
        <Autocomplete
            color={'inherit'}
            multiple
            id={"tags-" + id}
            options={options}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder={idUpper}/>)}
            defaultValue={selected}
            sx={{width: 300, color:'inherit'}}
            onChange={(event, value) => {
                event.preventDefault();
                if (value !== null) {
                    const params = new URLSearchParams(window.location.search)
                    params.set(id, value.join(','))
                    router.push('?' + params.toString())
                }
            }}
        />
    )
}
