import logoImg from 'style/images/LOGO-PNG-BLANC.png'

interface RouterData {
  title: string
  path: string
}

interface LogoRouterData {
  img: string
  path: string
}

interface NavigationProps {
  homeRoute: LogoRouterData
  routes: RouterData[]
}

const getHomeNavigationProps = (): NavigationProps => {
  const homeRoute: LogoRouterData = { img: logoImg, path: '/' }
  const docsRoute: RouterData = { title: 'Docs', path: '/docs' }
  const mediaRoute: RouterData = { title: 'Media', path: '/medias' }
  const blogRoute: RouterData = { title: 'Blog', path: '/blog' }
  const contactRoute: RouterData = { title: 'Contact', path: '/contact' }
  const teamRoute: RouterData = { title: 'Team', path: '/team' }

  return {
    homeRoute: homeRoute,
    routes: [docsRoute, mediaRoute, blogRoute, contactRoute, teamRoute]
  }
}

const getAppNavigationProps = (): NavigationProps => {
  const homeRoute: LogoRouterData = { img: logoImg, path: '/' }
  const dashboardRoute: RouterData = { title: 'Dashboard', path: '/dashboard' }
  const offersRoute: RouterData = { title: 'Offers', path: '/offers' }
  const collectionRoute: RouterData = { title: 'Collection', path: '/collection' }
  const investTicketRoute: RouterData = { title: 'Mint & Burn Invest Ticket', path: '/invest-ticket' }

  return {
    homeRoute: homeRoute,
    routes: [dashboardRoute, offersRoute, collectionRoute, investTicketRoute]
  }
}

export type { NavigationProps, RouterData, LogoRouterData }

export { getHomeNavigationProps, getAppNavigationProps }
