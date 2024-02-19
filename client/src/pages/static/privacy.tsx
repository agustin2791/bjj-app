import { Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material"

const PrivacyPolicy = () => {

    return (
        <Stack sx={{width: '80%', margin: '10px auto'}}>
            <Paper sx={{width: '100%', padding: '20px'}}>
                <Typography variant="h2">Privacy Policy</Typography>
                <Divider /><br /><br />
                <Typography variant="body1">
                This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our Brazilian Jiu-jitsu Social Media App (BJJ-Meta). Your privacy is important to us, and we are committed to safeguarding the information you provide to us.
                <br /><br />
                1. <b>Information We Collect:</b>
                <br /><br />
                a. Personal Information: When you register an account with us, we may collect personal information such as your name, email address, date of birth, and profile picture.
                b. User Content: We collect the content you post on our platform, including photos, videos, comments, and messages.
                c. Usage Data: We automatically collect information about your interactions with our app, including your IP address, device information, and browsing activity.
                d. Location Data: With your consent, we may collect your precise or approximate location to provide location-based services.
                <br /><br />
                2. <b>Use of Information:</b>
                <br /><br />
                a. We use the information we collect to operate and improve our app, personalize your experience, and communicate with you about our services.
                b. Your personal information may be used to verify your identity, facilitate social interactions, and provide relevant content and recommendations.
                c. We may also use your information for research, analytics, and advertising purposes, but we will never sell your personal data to third parties.
                <br /><br />
                3. <b>Disclosure of Information:</b>
                <br /><br />
                a. We may share your personal information with third-party service providers who assist us in delivering our services, such as hosting providers, analytics providers, and payment processors.
                b. We may disclose your information in response to legal requests, court orders, or to comply with applicable laws and regulations.
                c. Your information may be disclosed to protect the rights, property, or safety of our users, our app, or others.
                <br /><br />
                4. <b>Data Retention:</b>
                <br /><br />
                a. We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                b. You may request the deletion of your account and associated data at any time, subject to certain limitations and legal obligations.
                <br /><br />
                5. <b>Security Measures:</b>
                <br /><br />
                a. We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                b. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                <br /><br />
                6. <b>Children's Privacy:</b>
                <br /><br />
                a. Our app is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
                b. If you believe that we have inadvertently collected personal information from a child under 13, please contact us immediately, and we will take steps to remove such information.
                <br /><br />
                7. <b>Changes to this Policy:</b>
                <br /><br />
                a. We reserve the right to update or modify this Privacy Policy at any time.
                b. We will notify you of any changes by posting the revised Privacy Policy on our app.
                c. Your continued use of our app after the effective date of the revised Privacy Policy constitutes acceptance of the updated terms.
                <br /><br />
                8. <b>Contact Us:</b>
                <br /><br />
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at bjj-meta-info@gmail.com.
                <br /><br />
                By using our Brazilian Jiu-jitsu Social Media App (BJJ-Meta), you consent to the collection, use, and disclosure of your personal information as described in this Privacy Policy.

                </Typography>
            </Paper>
        </Stack>
    )
}

export default PrivacyPolicy