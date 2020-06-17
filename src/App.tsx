import React, { FC } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Login from './components/Login'
import Join from './components/Join'
import TaskList from './components/TaskList'
import Task from './components/Task'

import Auth from './utils/Auth'

const App: FC = () => (
  <Switch>
    <Route path='/login' component={Login} />
    <Route path='/join' component={Join} />

    // protect route
    <Route path='/tasks'
      render={
        () => Auth.isLoggedIn()
          ? <TaskList />
          : <Redirect to='/login' />
      }
    />
    <Route path='/task/new'
      render={
        () => Auth.isLoggedIn()
          ? <Task create={true} />
          : <Redirect to='/login' />
      }
    />
    <Route path='/task/:id'
      render={
        () => Auth.isLoggedIn()
          ? <Task create={false} />
          : <Redirect to='/login' />
      }
    />

    <Redirect to="/login" />
  </Switch>
)

export default App
