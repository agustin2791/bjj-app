import { FC, useEffect, useState } from "react";
import { Channel, Comment, ForumEntry } from "../../utils/types_interfaces";
import { List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";


type ListProps = {
    list: [],
    type: string
}
const UserPostList:FC<ListProps> = (props) => {
    const { list, type } = props
    const navigate = useNavigate()
    const [showPostList, setShowPostList] = useState<ForumEntry[]>()
    const [showCommentList, setShowCommentList] = useState<Comment[]>()

    useEffect(function () {
        if (type === 'post') {
            setShowPostList(list as ForumEntry[])
        } else {
            setShowCommentList(list as Comment[])
        }
    }, [list])

    const clickAction = (target: string | undefined, channel: string) => {
        return navigate(`/posts/${channel}/${target}`)
    }


    return (<>
        
        <List>
            {type === 'post' && showPostList?.map((l) => {
                return (
                    <ListItem sx={{cursor: 'pointer'}} onClick={() => {clickAction(l?._id, typeof l.channel === 'object' ? l.channel.slug : l.channel)}}>
                        {l.title}
                    </ListItem>
                )
            })}
            {type === 'comment' && showCommentList?.map((l) => {
                return (
                    <ListItem sx={{cursor: 'pointer'}} onClick={() => {typeof l.post_id === 'object' ? clickAction(l.post_id?._id, typeof l.post_id.channel === 'object' ? l.post_id.channel.slug : '') : null}}>
                        {l.comment.substring(0, 25)}...
                    </ListItem>
                )
            })}
        </List>
    </>)
}

export default UserPostList;