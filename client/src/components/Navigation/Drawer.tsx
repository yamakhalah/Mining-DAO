import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { NavigationProps, RouterData } from "../../types/propsType"
import { useState } from "react"



function NavDrawer ({homeRoute, routes}: NavigationProps) {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <Link to={homeRoute.path}>
                    <Typography variant="h4">
                        {homeRoute.title}
                    </Typography>
                </Link>
                <List>
                    {routes.map((route: RouterData) => {
                        return (
                            <ListItem onClick={() => setOpenDrawer(false)}>
                                <ListItemText>
                                    <Link to={route.path}>
                                        {route.title}
                                    </Link>
                                </ListItemText>
                            </ListItem>
                        )
                    })}
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                <Menu />
            </IconButton>
        </>
    )
}

export default Drawer