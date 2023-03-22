import { APPS } from './constants'

function getApp (): () => JSX.Element {
  const subdomain = getSubdomain(window.location.hostname)

  const defaultRouter = APPS.find((app) => app.main)

  if (!defaultRouter) throw new Error('Must have main app')

  if (subdomain === '') return defaultRouter.app

  const appRouter = APPS.find(app => subdomain === app.subdomain)

  if (!appRouter) return defaultRouter.app

  return appRouter.app
}

function getSubdomain (location: string): string {
  const locationParts = location.split('.')

  let sliceTill = -2

  const isLocalhost = locationParts.slice(-1)[0] === 'localhost'
  if (isLocalhost) sliceTill = -1

  return locationParts.slice(0, sliceTill).join('')
}

export { getSubdomain, getApp }
