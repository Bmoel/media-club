import { Alert, AlertTitle, Avatar, Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import RegistrationPageBreadcrumbs from "./components/RegistrationPageBreadcrumbs";

function RegistrationPage() {
    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <RegistrationPageBreadcrumbs />
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Box sx={{
                            height: 400,
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: 10
                        }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url(${'/chuuniland.svg'})`,
                                    backgroundSize: 'cover',
                                    filter: 'brightness(0.6)'
                                }}
                            />
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{ height: '100%', position: 'relative', p: 4, textAlign: 'center' }}
                            >
                                <Typography variant="h3" color="white" fontWeight="900" sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                                    JOIN THE CLUB
                                </Typography>
                                <Typography variant="h6" color="rgba(255,255,255,0.8)">
                                    Your Anilist journey, shared with friends.
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Link your Anilist Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                By registering, we'll automatically fetch your <strong>scores and reviews</strong>
                                &nbsp;directly from Anilist. No manual entry required — just connect and then navigate to
                                any of the media in the home page to see how you compare to others.
                            </Typography>
                        </Box>
                        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                            <AlertTitle sx={{ fontWeight: 'bold' }}>Transparency Notice</AlertTitle>
                            We store your <strong>Anilist ID</strong> in our database to keep your profile synced.
                            This is publically accessible info, and is the only thing we store to fetch your data from Anilist.
                        </Alert>
                        <Button
                            variant="contained"
                            startIcon={<Avatar src="/anilist.svg" />}
                            size="large"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://anilist.co/api/v2/oauth/authorize"
                            fullWidth
                            sx={{
                                borderRadius: 8,
                                py: 1.5,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                                backgroundColor: "#2b2d42"
                            }}
                        >
                            Connect with Anilist
                        </Button>
                    </Stack>
                </Grid>
            </Stack>
        </Container>
    );
}

export default RegistrationPage;