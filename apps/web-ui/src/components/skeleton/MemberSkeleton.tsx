import { Skeleton, Stack } from '@mui/material';

function MemberSkeleton() {
    return (
        <Stack direction="column" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <Skeleton variant="text" width="80%" height={20} animation="wave" />
        </Stack>
    );
}

export default MemberSkeleton;