import { Avatar, Box, Stack, Typography } from "@mui/material";
import type { AnilistUser } from "../../../api/anilist/anilistApi.types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import MemberSkeleton from "../../../components/skeleton/MemberSkeleton";

interface UserListInterface {
    anilistUsers: AnilistUser[] | undefined;
    selectedUser?: AnilistUser;
    setSelectedUser?: Dispatch<SetStateAction<AnilistUser | undefined>>
}

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

function UserList(props: UserListInterface) {
    const { anilistUsers, selectedUser, setSelectedUser } = props;

    if (anilistUsers === undefined) {
        return (
            <UserListStack>
                {[...Array(3)].map((_, i) => <MemberSkeleton key={i} />)}
            </UserListStack>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', ml: 1 }}>
                Members
            </Typography>
            <UserListStack>
                {anilistUsers.map((user) => (
                    <Box
                        key={user?.user.name}
                        onClick={() => {
                            if (setSelectedUser) {
                                setSelectedUser(user);
                            }
                        }}
                        sx={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            opacity: selectedUser?.user.id === user?.user.id ? 1 : 0.5,
                            transition: '0.2s'
                        }}
                    >
                        <Avatar
                            src={user?.user.avatar.medium}
                            sx={{
                                width: 56,
                                height: 56,
                                border: selectedUser?.user.id === user?.user.id ? '2px solid #1976d2' : 'none'
                            }}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {user?.user.name}
                        </Typography>
                    </Box>
                ))}
            </UserListStack>
        </Box>
    );
}

export default UserList;