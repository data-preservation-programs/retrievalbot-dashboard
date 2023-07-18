'use client'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {usePathname, useRouter} from "next/navigation";
import {GenerateParams, ParsedParams} from "@/components/types";

interface DropdownProps {
    id: 'client' | 'provider'
    options: string[];
    params: ParsedParams;
}

export default function Dropdown({id, options, params}: DropdownProps) {
    const idUpper = id.charAt(0).toUpperCase() + id.slice(1)
    const router = useRouter();
    const pathname = usePathname();
    const selected = params[id]

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
                    params[id] = value
                    router.push(pathname + '?' + GenerateParams(params))
                }
            }}
        />
    )
}
