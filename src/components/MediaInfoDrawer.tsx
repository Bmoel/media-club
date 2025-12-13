import { Stack, SwipeableDrawer, type SwipeableDrawerProps, type SxProps } from "@mui/material";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import type { Theme } from "@emotion/react";
import { Puller } from "./common/Puller";

interface MediaInfoDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void,
}

function MediaInfoDrawer({ isOpen, setIsOpen }: MediaInfoDrawerProps) {
    const { isMobile } = useConfig();

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
            </Stack>
        </SwipeableDrawer>
    );
}

export default MediaInfoDrawer;