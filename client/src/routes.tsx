import App from "./App"
import Registration
 from "./pages/auth/register";
import Forum from './pages/forum/forum'
import {
    createBrowserRouter,
    RouterProvider
  } from 'react-router-dom'

const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/register',
        element: <Registration />
    },
    {
        path: '/posts',
        element: <Forum />
    }
])

export default routes;