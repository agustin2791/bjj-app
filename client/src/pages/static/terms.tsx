import { Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material"

const TermsAndConditions = () => {

    return (
        <Stack sx={{width: '80%', margin: '10px auto'}}>
            <Paper sx={{width: '100%', padding: '20px'}}>
                <Typography variant="h2">Terms and Conditions</Typography>
                <Divider />
                <br /><br />
                <Typography variant="body1">
                Welcome to our Brazilian Jiu-jitsu Social Media App(BJJ-Meta)! Before you start using our platform, please take a moment to carefully read through the following terms and conditions. By accessing or using our app, you agree to be bound by these terms. If you do not agree to these terms, please refrain from using our services.
                <br /><br />
                <b>1. Age Requirement:</b>
                <br /><br />
                a. Users must be at least 13 years old to register and use our app.
                b. Users who are minors must obtain parental consent before using our services.
                <br /><br />
                <b>2. Personal Data:</b>
                <br /><br />
                a. We are committed to protecting your privacy. We will not sell or disclose your personal data to third parties without your consent.
                b. By using our app, you consent to the collection, use, and disclosure of your personal information as outlined in our Privacy Policy.
                <br /><br />
                <b>3. Content Guidelines:</b>
                <br /><br />
                a. Users are prohibited from posting any content that is unlawful, obscene, defamatory, or violates the rights of others.
                b. Any X-rated content must be appropriately marked and restricted to users who are 18 years or older.
                <br /><br />
                <b>4. User Conduct:</b>
                <br /><br />
                a. Users must conduct themselves in a respectful and lawful manner while using our app.
                b. Harassment, bullying, hate speech, or any other form of abusive behavior will not be tolerated.
                <br /><br />
                <b>5. Intellectual Property:</b>
                <br /><br />
                a. Users retain ownership of the content they post on our platform.
                b. By posting content, users grant us a non-exclusive, royalty-free license to use, reproduce, and distribute their content for the purposes of operating and promoting our app.
                <br /><br />
                <b>6. Safety Measures:</b>
                <br /><br />
                a. We employ reasonable measures to ensure the safety and security of our users.
                b. However, users are responsible for maintaining the confidentiality of their account credentials and are advised not to share them with others.
                <br /><br />
                <b>7. Modification of Terms:</b>
                <br /><br />
                a. We reserve the right to modify or update these terms and conditions at any time.
                b. Users will be notified of any changes, and continued use of our app constitutes acceptance of the modified terms.
                <br /><br />
                <b>8. Termination of Account:</b>
                <br /><br />
                a. We reserve the right to suspend or terminate users' accounts for violations of these terms or for any other reason at our discretion.
                b. Users may also deactivate or delete their accounts at any time.
                <br /><br />
                <b>9. Governing Law:</b>
                <br /><br />
                a. These terms and conditions shall be governed by and construed in accordance with the laws of The United States.
                b. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in The United States.
                <br /><br />
                By using our Brazilian Jiu-jitsu Social Media App, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you have any questions or concerns, please contact us at bjj-meta-info@gmail.com.
                <br /><br />
                </Typography>
            </Paper>
        </Stack>
    )
}

export default TermsAndConditions;