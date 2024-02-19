import { Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material"

const CookiePolicy = () => {

    return (
        <Stack sx={{width: '80%', margin: '10px auto'}}>
            <Paper sx={{width: '100%', padding: '20px'}}>
                <Typography variant="h2">Cookie Policy</Typography>
                <Divider />
                <br /><br />
                <Typography variant="body1">
                This Cookie Policy explains how we use cookies and similar technologies on our Brazilian Jiu-jitsu Social Media App (BJJ-Meta). Cookies are small text files that are stored on your device when you visit a website or use a mobile application. By using our app, you consent to the use of cookies in accordance with this policy.
                <br /><br />
                <b>1. Types of Cookies We Use:</b>
                <br /><br />
                a. Essential Cookies: These cookies are necessary for the operation of our app. They enable basic functions such as page navigation and access to secure areas of the app.

                b. Functional Cookies: These cookies allow us to remember your preferences and settings, such as language preferences and display settings, to enhance your user experience.

                c. Performance Cookies: These cookies collect information about how you use our app, such as which pages you visit and any errors you encounter. This data helps us improve the performance and usability of our app.

                d. Advertising Cookies: We may use third-party advertising partners to display advertisements on our app. These partners may use cookies to collect information about your browsing behavior and interests, in order to provide targeted advertising.
                <br /><br />
                <b>2. Third-Party Cookies:</b>
                <br /><br />
                a. We may also allow third-party service providers, such as social media platforms and analytics providers, to set cookies on your device when you use our app. These cookies are subject to the respective third party's privacy policies.
                <br /><br />
                <b>3. Cookie Management:</b>
                <br /><br />
                a. You can control and manage cookies through your browser settings. Most web browsers allow you to block or delete cookies, or to receive a warning before a cookie is stored.
                b. Please note that blocking or deleting cookies may affect the functionality of our app and your user experience.
                <br /><br />
                <b>4. Consent:</b>
                <br /><br />
                a. By continuing to use our app, you consent to the use of cookies as described in this Cookie Policy.
                b. You may withdraw your consent to the use of cookies at any time by adjusting your browser settings or deleting cookies from your device.
                <br /><br />
                <b>5. Updates to this Policy:</b>
                <br /><br />
                a. We reserve the right to update or modify this Cookie Policy at any time.
                b. We will notify you of any changes by posting the revised Cookie Policy on our app.
                c. Your continued use of our app after the effective date of the revised Cookie Policy constitutes acceptance of the updated terms.
                <br /><br />
                <b>6. Contact Us:</b>
                <br /><br />
                If you have any questions, concerns, or requests regarding this Cookie Policy or our cookie practices, please contact us at bjj-meta-info@gmail.com.

                By using our Brazilian Jiu-jitsu Social Media App, you acknowledge that you have read, understood, and agreed to this Cookie Policy.

                </Typography>
            </Paper>
        </Stack>
    )
}

export default CookiePolicy;