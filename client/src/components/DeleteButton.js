import React from 'react'
import { Button, Icon } from 'semantic-ui-react';
import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../util/graphql';
import { useMutation } from '@apollo/react-hooks';

export default function DeleteButton({post: {id}}) {
    console.log(id)

    const [deletePost, {error}] = useMutation(DELETE_POST_MUTATION,{
        variables: {postId: id},
        update(proxy, result){
            // NOTE reading from apollo cache
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            let oldArray = data.getPosts
            let newArray = oldArray.filter((post) => {
                return post.id !== id
            })
            data.getPosts = newArray
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
        }
    })


    const handleDeletePost = () => {
        deletePost()
    }
    
    return (
        <Button as="div" floated="right" color="red" onClick={handleDeletePost}>
            <Icon name="trash" style={{margin: 0}}/>
        </Button>
    )
}
