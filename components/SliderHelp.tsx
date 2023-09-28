import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

const SLIDER_HELP_MESSAGE = 'Adjust the time window to zoom in / out';

export default function SliderHelp() {
    return <Box display="flex" justifyContent="flex-end">
        <Tooltip title={SLIDER_HELP_MESSAGE}>
            <IconButton>
                <HelpIcon />
            </IconButton>
        </Tooltip>
    </Box>

}