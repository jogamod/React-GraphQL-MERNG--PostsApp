import React, {useEffect, useState} from 'react'
import { Button, Icon, Label } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { LIKE_POST_MUTATION } from '../util/graphql';
import {Link} from 'react-router-dom'

export default function LikeButton({user, post: {likeCount, id, likes}}) {
    const [liked, setLiked] = useState(false)
    useEffect(() => {
            if(user && likes.find(like => like.username === user.username)){
                setLiked(true)
            }else{
                setLiked(false)
            }
    }, [user,likes])


    const [likePost, {error}] = useMutation(LIKE_POST_MUTATION,{
        variables: {postId: id},
        update(proxy, result){
            //console.log(result)
        }
    })

    const handleLikePost = () => {
        likePost()
    }

    const LikeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
                    )
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={handleLikePost}>
                {LikeButton}
                <Label as='a' basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
        </Button>
    )
}
