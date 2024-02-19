import MainLayout from "./components/template/layout";
import AcademyDetails from "./pages/academy/details";
import EditAcademy from "./pages/academy/editAcademy";
import NewAcademy from "./pages/academy/newAcademy";
import Login from "./pages/auth/login";
import Registration
 from "./pages/auth/register";
import Forum from './pages/forum/forum'

import {
    Route,
    Routes
  } from 'react-router-dom'
import FindAcademy from "./pages/academy/findAcademy";
import AcademyHome from "./pages/academy/academyHome";
import EditUserProfile from "./pages/profile/editProfile";
import UserProfile from "./pages/profile/profile";
import AboutUs from "./pages/static/about";
import PrivacyPolicy from "./pages/static/privacy";
import TermsAndConditions from "./pages/static/terms";
import CookiePolicy from "./pages/static/cookies";

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
                <Route path='/profile/:slug' element={<UserProfile />}></Route>
                <Route path='/profile/edit/:username' element={<EditUserProfile />}></Route>
                <Route path='/academy' element={<AcademyHome />}></Route>
                <Route path="/academy/create" element={<NewAcademy />}></Route>
                <Route path="/academy/:slug" element={<AcademyDetails />}></Route>
                <Route path="/academy/edit/:slug" element={<EditAcademy />}></Route>
                <Route path="/academy/find" element={<FindAcademy />}></Route>
                <Route path="/about" element={<AboutUs />}></Route>
                <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
                <Route path="/terms-and-conditions" element={<TermsAndConditions />}></Route>
                <Route path="/cookie-policy" element={<CookiePolicy />}></Route>
                <Route path="*" element={<div><h1>Nothing found</h1></div>}></Route>
            </Route>
        </Routes>
    )
}


export default AppRoute;