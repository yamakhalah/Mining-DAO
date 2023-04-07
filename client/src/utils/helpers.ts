import { AppRouter, DefaultRouter } from '../router'

function getApp (): () => JSX.Element {
  if (window.location.host.split('.')[0] === 'app') {
    return (AppRouter)
  } else {
    return (DefaultRouter)
  }
}

export { getApp }
