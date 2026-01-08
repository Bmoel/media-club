import { Stack } from "@mui/material";
import type { ReactNode } from "react";

function UserListStack({ children }: { children: ReactNode }) {
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                overflowX: 'auto',
                py: 1,
                px: 1,
                '&::-webkit-scrollbar': { display: 'none' }
            }}
        >
            {children}
        </Stack>
    );
}

export default UserListStack;