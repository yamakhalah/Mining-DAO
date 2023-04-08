import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AuthRoute = ({ component: Component, isOwner,  ...rest}) => {
  return(
    <Route {...rest} render={props => (
      isOwner
        ? <Component {...props} />
        : <Redirect to='/' />
    )} />
  )
}


export default AuthRoute