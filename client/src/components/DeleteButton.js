import React, {useState} from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../util/graphql';
import { useMutation } from '@apollo/react-hooks';

export default function DeleteButton({postId, callback}) {
    console.log(postId)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [deletePost, {error}] = useMutation(DELETE_POST_MUTATION,{
        variables: {postId},
        update(proxy, result){
            setConfirmOpen(false)

            // NOTE removing post from apollo cache
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            let oldArray = data.getPosts
            let newArray = oldArray.filter((post) => {
                return post.id !== postId
            })
            data.getPosts = newArray
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data})

            // NOTE call callback from props
            if(callback) callback()
        }
    })


    const handleDeletePost = () => {
        deletePost()
    }
    
    return (
        <React.Fragment>
            <Button 
                as="div" 
                floated="right" 
                color="red"
                onClick={() => setConfirmOpen(true)}>
                <Icon name="trash" style={{margin: 0}}/>
            </Button>
            <Confirm 
                header="Deleting post"
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeletePost}
                
            />
        </React.Fragment>
    )
}
