import MainLayout from "./components/form-input/template/layout";
import AcademyDetails from "./pages/academy/details";
import EditAcademy from "./pages/academy/editAcademy";
import MapView from "./components/form-input/adacemy/map";
import NewAcademy from "./pages/academy/newAcademy";
import Login from "./pages/auth/login";
import Registration
 from "./pages/auth/register";
import Forum from './pages/forum/forum'

import {
    Route,
    Routes
  } from 'react-router-dom'

const AppRoute = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Forum />}></Route>
                <Route path="/posts" element={<Forum />}>
                    <Route path=":channel" element={<Forum />}>
                        <Route path=":post_id" element={<Forum />}></Route>
                    </Route>
                    <Route path=":post_id" element={<Forum />}></Route>
                </Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path='/register' element={<Registration />}></Route>
                <Route path="/academy/create" element={<NewAcademy />}></Route>
                <Route path="/academy/edit/:slug" element={<EditAcademy />}></Route>
                <Route path="/academy/find" element={<MapView />}></Route>
                <Route path="*" element={<div><h1>Nothing found</h1></div>}></Route>
            </Route>
        </Routes>
    )
}


export default AppRoute;