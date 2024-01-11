import { Card, CardActions, CardContent } from "@mui/material"
import { FC, ReactNode, } from "react"

type cardProps = {
    content?: JSX.Element,
    footer?: JSX.Element,
    children?: ReactNode
}

const SlotCard: FC<cardProps> = (props) => {
    const {content, footer, children} = props

    return (
        <Card>
            <CardContent> {content} </CardContent>
            <CardContent>{children}</CardContent>
            {footer !== undefined && 
                <CardActions>{footer}</CardActions>
            }
        </Card>
    )
}

export default SlotCard;