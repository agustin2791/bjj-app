import { AccountCircle } from "@mui/icons-material"
import { FC } from "react"


type ProfilePictureProps = {
    username: string | undefined,
    image: string | undefined
}
const ProfilePicture: FC<ProfilePictureProps> = (props) => {
    const { username, image } = props


    return (<>
    <div className="image_container">
        {image &&
            <img src={image} alt={`${username} user profile picture`} />
        || <AccountCircle sx={{fontSize: '300px'}} />}
    </div>
    </>)
}

export default ProfilePicture