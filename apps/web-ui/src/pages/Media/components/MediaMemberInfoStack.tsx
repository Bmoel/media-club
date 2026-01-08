import { Stack } from "@mui/material";
import type { ReactNode } from "react";

function MediaMemberInfoStack({ children }: { children: ReactNode }) {
    return (
        <Stack
            spacing={1}
            alignItems="center"
            border="1px solid"
            borderColor="divider"
            borderRadius="8px"
            height={'100%'}
            display="flex"
            px={3}
        >
            {children}
        </Stack>
    );
}

export default MediaMemberInfoStack;