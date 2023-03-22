import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import { NavigationProps, RouterData } from "@/types/propsType"

function Navbar({homeRoute, routes}: NavigationProps){
    return (
        <AppBar position="static">
            <CssBaseline />
            <Toolbar>
                <Link to={homeRoute.path}>
                    <Typography variant="h4">
                        {homeRoute.title}
                    </Typography>
                </Link>
                {routes.map((route: RouterData) => {
                    return (
                        <Link to={route.path}>
                            {route.title}
                        </Link>
                    )
                })}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar