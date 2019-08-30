import React, {useContext} from 'react'
import { Card, Button, Image, Icon, Label } from 'semantic-ui-react';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { FETCH_POSTS_QUERY, LIKE_POST_MUTATION } from '../util/graphql';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton';

export default function PostCard({post: { body, createdAt, id, username, likeCount, commentCount, likes}}) {
    const { user } = useContext(AuthContext)

    const handleDeletePost = () => {
        console.log("deleted")
    }
    
    function commentOnPost(){
        console.log("comment")
    }

    return (
        <Card fluid>
        <Card.Content>
          <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
          <Card.Header>Molly Thomas</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
          <Card.Description>
            {body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <LikeButton user={user} post={{id, likes, likeCount}} />
            <Button labelPosition='right' as={Link} to={`/post/${id}`}>
                <Button color='blue' basic>
                    <Icon name='comments' />
                </Button>
                <Label as='a' basic color='blue' pointing='left'>
                    {commentCount}
                </Label>
            </Button>
            {user && user.username === username && (
                <Button as="div" floated="right" color="red" onClick={handleDeletePost}>
                    <Icon name="trash" style={{margin: 0}}/>
                </Button>
            )}
        </Card.Content>
      </Card>
    )
}
