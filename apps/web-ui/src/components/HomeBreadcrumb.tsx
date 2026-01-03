import { Home } from "@mui/icons-material";
import { Link } from "@mui/material";
import { useNavigate } from "react-router";

function HomeBreadcrumb() {
    const navigate = useNavigate();

    return (
        <Link
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', cursor: "pointer" }}
            underline="hover"
            color="inherit"
        >
            <Home color='info' sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
        </Link>
    );
}

export default HomeBreadcrumb;