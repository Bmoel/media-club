import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLazyGetUserIdQuery } from "../../api/anilist/anilistApi";
import { useSyncAnilistUserMutation } from "../../api/mediaClub/mediaClubApi";

function AuthCallback() {
    const [loadingText, setLoadingText] = useState<string>('Syncing your AniList profile...');

    const [trigger, result] = useLazyGetUserIdQuery();
    const [updatePost] = useSyncAnilistUserMutation();
    const navigate = useNavigate();

    const returnEarly = useCallback(() => {
        setLoadingText('Error syncing profile, redirecting...');
        setTimeout(() => navigate('/'), 1500);
    }, [navigate]);

    const handleAuth = useCallback(async (token: string) => {
        try {
            const userId = await trigger(token).unwrap();
            await updatePost({ anilistId: userId }).unwrap();
            setLoadingText('Successfully synced profile, redirecting...');
        } catch {
            setLoadingText('Failed to sync profile, redirecting...');
        } finally {
            setTimeout(() => navigate('/'), 1500);
        }
    }, [trigger, updatePost, navigate]);

    useEffect(() => {
        if (!result.isUninitialized) {
            returnEarly();
            return;
        }
        const hash = window.location.hash;
        if (!hash) {
            returnEarly();
            return;
        }
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (!token) {
            returnEarly();
            return;
        }
        handleAuth(token);
    }, [navigate, result, handleAuth, returnEarly]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">{loadingText}</Typography>
        </Box>
    );
}

export default AuthCallback;