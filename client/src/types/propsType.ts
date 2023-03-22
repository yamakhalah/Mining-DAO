interface RouterData {
  title: string
  path: string
}

interface NavigationProps {
  homeRoute: RouterData
  routes: RouterData[]
}

const getHomeNavigationProps = (): NavigationProps => {
  const homeRoute: RouterData = { title: 'Mining DAO', path: '/' }
  const docsRoute: RouterData = { title: 'Docs', path: '/docs' }
  const mediaRoute: RouterData = { title: 'Media', path: '/medias' }
  const blogRoute: RouterData = { title: 'Bog', path: '/blog' }
  const contactRoute: RouterData = { title: 'Contact', path: '/contact' }
  const teamRoute: RouterData = { title: 'Team', path: '/team' }

  return {
    homeRoute: homeRoute,
    routes: [docsRoute, mediaRoute, blogRoute, contactRoute, teamRoute]
  }
}

export type { NavigationProps, RouterData }

export { getHomeNavigationProps }
