import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { Button, MobileStepper, SwipeableDrawer } from "@mui/material"
import { FC, useState } from "react"

type postImagesProps = {
    images: string[]
}
const PostImages:FC<postImagesProps> = (props) => {
    const {images} = props
    const [currentView, setCurrentView] = useState(0)

    const handleNext = () => {
        setCurrentView((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setCurrentView((prevActiveStep) => prevActiveStep - 1);
    };
    return (<>
        {images.length > 1 && 
            <MobileStepper
            variant="dots"
            steps={images.length}
            position='static'
            activeStep={currentView}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={currentView === images.length - 1}>
                    Next
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={currentView === 0}>
                    <KeyboardArrowLeft />
                    Back
                </Button>
            }
        />}
        <div className="image-post-container">
            <img src={images[currentView]} alt={'view post image ' + (currentView + 1)} />
        </div>
        
    </>)
}

export default PostImages;