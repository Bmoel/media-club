import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useRemoveAnilistUserMutation, useSyncAnilistUserMutation } from "../../api/mediaClub/mediaClubApi";

export type AuthMode = 'sync' | 'remove';

const isValidAuthMode = (mode: string | null): mode is AuthMode => {
    return mode === 'sync' || mode === 'remove';
};

function AuthCallbackPage() {
    const [loadingText, setLoadingText] = useState<string>('');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lastCallKey = useRef<string>("");

    const [syncUser] = useSyncAnilistUserMutation();
    const [removeUser] = useRemoveAnilistUserMutation();

    const handleAuth = useCallback(async (code: string, mode: AuthMode) => {
        try {
            if (mode === "remove") {
                await removeUser({ code }).unwrap();
                setLoadingText('Successfully removed profile, redirecting...');
            } else {
                await syncUser({ code }).unwrap();
                setLoadingText('Successfully synced profile, redirecting...');
            }
        } catch {
            setLoadingText(`Failed to ${mode === "remove" ? 'remove' : 'sync'} profile, redirecting...`);
        } finally {
            sessionStorage.removeItem('oauth_state');
            setTimeout(() => navigate('/'), 1500);
        }
    }, [removeUser, syncUser, navigate]);

    useEffect(() => {
        const code = searchParams.get('code');
        const stateParam = searchParams.get('state');
        const [mode, originalState] = stateParam?.split('_') || [];
        if (originalState !== sessionStorage.getItem('oauth_state') || !isValidAuthMode(mode)) {
            setLoadingText('Invalid session, please try again...');
            setTimeout(() => navigate('/'), 1500);
            return;
        }
        if (!code) {
            setLoadingText('Authentication error, redirecting...');
            setTimeout(() => navigate('/'), 1500);
            return;
        }
        const currentCallKey = `${mode}-${code}`;
        setLoadingText((mode === "remove" ? "Removing your AniList profile..." : "Syncing your AniList profile..."));
        if (lastCallKey.current !== currentCallKey) {
            lastCallKey.current = currentCallKey;
            handleAuth(code, mode);
        }
    }, [handleAuth, navigate, searchParams]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">{loadingText}</Typography>
        </Box>
    );
}

export default AuthCallbackPage;