import React, {useContext, useState, useRef} from 'react'
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';

import { AuthContext } from "../context/auth";
import DeleteButton from '../components/DeleteButton';
import { CREATE_COMMENT_MUTATION } from '../util/graphql';

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
    const commentInputRef = useRef(null)

    const [comment, setComment] = useState('')

    const { 
        loading, 
        data: {getPost: post},
    } = useQuery(FETCH_POST_QUERY, {
        variables: {postId}
    })

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION,{
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })


    const handleRedirectToHome = () => {
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
                    <Grid.Column width={2} textAlign="center">
                        <Button circular color="teal" onClick={handleRedirectToHome}>
                            <Icon name="arrow left" style={{margin: 0}}/>
                        </Button>
                    </Grid.Column>
                     <Grid.Column width={2}>
                        <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                     </Grid.Column>
                     <Grid.Column width={12}>
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
                                    <DeleteButton postId={id} callback={handleRedirectToHome}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input 
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                                >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => {
                            return (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id} />
                                        )}
                                        <Card.Header>
                                            {comment.username}
                                        </Card.Header>
                                        <Card.Meta>
                                            {moment(comment.createdAt).fromNow()}
                                        </Card.Meta>
                                        <Card.Description>
                                            {comment.body}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            )
                        })}
                     </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return (
        postMarkup
    )
}
