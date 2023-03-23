import { AppRouter, DefaultRouter } from '../router'

export const APPS = [
  {
    subdomain: 'www',
    app: DefaultRouter,
    main: true
  },
  {
    subdomain: 'app',
    app: AppRouter,
    main: false
  }
]
