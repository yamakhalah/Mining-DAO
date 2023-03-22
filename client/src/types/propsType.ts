type RouterData = {
    title: string;
    path: string;
}

type NavigationProps = {
    homeRoute: RouterData,
    routes: [RouterData]
}

export type { NavigationProps, RouterData }