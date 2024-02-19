import { Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"

const AboutUs = () => {

    return (
        <Stack sx={{width: '80%', margin: '10px auto'}}>
            <Paper sx={{width: '100%', padding: '20px'}}>
                <Typography variant="h2">About BJJ-Meta</Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                    BJJ-Meta is all about Brazilian Jiu-jitsu. It was created for the love of the sport and to try to have a centralized place for everyone to enjoy jiu-jitsu. It is still in Beta and there are a lot of work to be done. Since it’s user based the more users we have the better the site, so spread the word.
                    <br /><br />
                    In the forums/posts are categorized by channels and based around a certain subject where users can post questions, videos (YouTube video links), and images centered around the channel subject. 
                    <br /><br />
                    Academies is the place where you can search around an area and find an academy. Academy owners can find their academy using the search bar and register the academy to your account. Once it’s registered, you can add details about the academy, such as, instructors, classes, and schedule for everyone to discover your academy using this platform. This is meant to help academies to be more discoverable and it’s another outside site that can redirect to your website in order to boost the website’s SEO.
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h3">What's on the works?</Typography>
                <Typography variant="body1">Here are some of the plans we are working on for the site:</Typography>
                <List>
                    <ListItem><b>Verify belt rank:</b> users can display their belt rank but with a verify check other users can see the legitimacy of the rank. Our goal is to have a quick and simple verify process to make your claim legit.</ListItem>
                    <ListItem><b>Tournaments:</b> Have a place where you can search by location and find all nearby tournaments.</ListItem>
                    <ListItem><b>Events:</b> show or announce any BJJ related event. For example, when is the next WNO event and who is competing in it.</ListItem>
                    <ListItem><b>Chat:</b> a chat system to contact a user directly</ListItem>
                    <ListItem><b>Mobile App:</b> Create a Mobile application for Iphone and Android so you can take BJJ-Meta on the go.</ListItem>
                </List>
                <Typography variant="body1">All subject to change. If you have an idea or suggestion on how to make this site better you can reach us at bjj-meta-info@gmail.com</Typography>
                <br />
                <Divider />
                <br />
                <Link to="/privacy-policy">Privacy Policy </Link> | <Link to="/terms-and-conditions">Terms and Conditions </Link> | <Link to="/cookie-policy">Cookie Policy</Link>
            </Paper>
        </Stack>
    )
}

export default AboutUs