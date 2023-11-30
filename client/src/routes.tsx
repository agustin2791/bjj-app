import App from "./App"
import Registration
 from "./pages/auth/register";
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
    }
])

export default routes;