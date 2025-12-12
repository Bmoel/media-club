import { MenuItem, Stack, SwipeableDrawer, TextField, type SwipeableDrawerProps, type SxProps } from "@mui/material";
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import { MEDIA } from "../constants/media";
import type { Theme } from "@emotion/react";

const EMPTY_VALUE = 0;

interface FilterSideDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void,
}

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
    }),
}));

function FilterSideDrawer({ isOpen, setIsOpen }: FilterSideDrawerProps) {
    const { isMobile } = useConfig();

    const startYearMenuItems: number[] = useMemo(() => {
        const items = new Set<number>();
        Object.values(MEDIA).forEach(mediaItem => {
            items.add(mediaItem.dateStarted.getFullYear());
        });
        const years = [...items];
        years.sort((a, b) => a - b);
        return years;
    }, []);

    const stackCss: SxProps<Theme> = useMemo(() => {
        return isMobile ? { margin: '10px' } : { width: '400px', margin: '10px' };
    }, [isMobile]);

    const drawerSlotProps: SwipeableDrawerProps['slotProps'] = useMemo(() => {
        return isMobile ? {
            paper: {
                sx: { height: '85%' }
            }
        } : undefined;
    }, [isMobile]);

    return (
        <SwipeableDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => { }}
            anchor={isMobile ? "bottom" : "right"}
            slotProps={drawerSlotProps}
        >
            <Stack spacing={2} sx={stackCss}>
                {isMobile && <Puller />}
                <TextField
                    value={EMPTY_VALUE}
                    label="Start Year"
                    id="start-year-filter-select"
                    select
                >
                    <MenuItem key="select-year-none" value={EMPTY_VALUE}></MenuItem>
                    {startYearMenuItems.map(year => (
                        <MenuItem key={`select-year-${year}`} value={year}>{year}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    value={EMPTY_VALUE}
                    label="Status"
                    id="media-status-filter-select"
                    select
                >
                    <MenuItem key="status-value-none" value={EMPTY_VALUE}></MenuItem>
                    <MenuItem key="status-value-watching" value={1}>Watching</MenuItem>
                    <MenuItem key="status-value-completed" value={2}>Completed</MenuItem>
                </TextField>
            </Stack>
        </SwipeableDrawer>
    );
}

export default FilterSideDrawer;