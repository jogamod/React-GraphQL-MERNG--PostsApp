import React, {useContext} from 'react'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';

import { AuthContext } from "../context/auth";
import DeleteButton from '../components/DeleteButton';

export const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`




export default function SinglePost(props) {
    const postId = props.match.params.postId
    const { user } = useContext(AuthContext)
    const { 
        loading, 
        data: {getPost: post},
    } = useQuery(FETCH_POST_QUERY, {
        variables: {postId}
    })

    const handleDeletePostCallback = () => {
        props.history.push('/')
    }
    
    let postMarkup
    if(!post){
        postMarkup = <p>Loading post...</p>
    }else{
        const {id,body,createdAt,username,comments,likes,likeCount,commentCount} = post
        postMarkup = (
            <Grid>
                <Grid.Row>
                     <Grid.Column width={2}>
                        <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                     </Grid.Column>
                     <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{id,likeCount,likes}} />
                                <Button 
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}
                                    >
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label> 
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={handleDeletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                     </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return (
        postMarkup
    )
}
