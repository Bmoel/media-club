import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSyncAnilistUserMutation } from "../../api/mediaClub/mediaClubApi";

function AuthCallback() {
    const [loadingText, setLoadingText] = useState<string>('Syncing your AniList profile...');
    const hasCalledRef = useRef<boolean>(false);

    const [searchParams] = useSearchParams();
    const [syncUser] = useSyncAnilistUserMutation();
    const navigate = useNavigate();

    const handleAuth = useCallback(async (code: string) => {
        try {
            await syncUser({ code }).unwrap();
            setLoadingText('Successfully synced profile, redirecting...');
        } catch {
            setLoadingText('Failed to sync profile, redirecting...');
        } finally {
            setTimeout(() => navigate('/'), 1500);
        }
    }, [syncUser, navigate]);

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setLoadingText('Error syncing profile, redirecting...');
            setTimeout(() => navigate('/'), 1500);
            return;
        }
        if (!hasCalledRef.current) {
            hasCalledRef.current = true;
            handleAuth(code);
        }
    }, [handleAuth, navigate, searchParams]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">{loadingText}</Typography>
        </Box>
    );
}

export default AuthCallback;