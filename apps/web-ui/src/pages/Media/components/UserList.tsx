import { Avatar, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import MemberSkeleton from "../../../components/skeleton/MemberSkeleton";
import { Info } from "@mui/icons-material";
import useConfig from "../../../hooks/useConfig";
import UserListStack from "./UserListStack";

interface UserListInterface {
    anilistUsers: MediaAnilistUser[] | undefined;
    selectedUser?: MediaAnilistUser;
    setSelectedUser?: Dispatch<SetStateAction<MediaAnilistUser | undefined>>;
    dataIsLoading: boolean;
}

function UserList(props: UserListInterface) {
    const { anilistUsers, selectedUser, setSelectedUser, dataIsLoading } = props;

    const { isMobile } = useConfig();

    const onUserSelection = useCallback((newUser: MediaAnilistUser) => {
        if (setSelectedUser === undefined) {
            return;
        }
        if (selectedUser?.user.id === newUser.user.id) {
            setSelectedUser(undefined);
            return;
        }
        setSelectedUser(newUser);
    }, [selectedUser?.user.id, setSelectedUser]);

    if (dataIsLoading) {
        return (
            <UserListStack>
                {[...Array(15)].map((_, i) => <MemberSkeleton key={i} />)}
            </UserListStack>
        );
    }

    return (
        <Box>
            <Stack direction="row" alignItems="center">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    Members
                </Typography>
                <Tooltip
                    title="Will show available members who have this media in their Anilist"
                    placement={isMobile ? 'bottom-end' : 'right-start'}
                >
                    <IconButton size="small">
                        <Info />
                    </IconButton>
                </Tooltip>
            </Stack>
            {(anilistUsers === undefined || anilistUsers.length === 0) ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    fontStyle="italic"
                    sx={{ opacity: 0.5, p: 2 }}
                >
                    No members found (╯°□°)╯︵ ┻━┻
                </Typography>
            ) : (
                <UserListStack>
                    {anilistUsers.map((user) => (
                        <Box
                            key={user?.user.name}
                            onClick={() => onUserSelection(user)}
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
            )}

        </Box>
    );
}

export default UserList;