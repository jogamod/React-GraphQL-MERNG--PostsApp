import React, {useState, useContext} from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';

import { useForm } from '../util/hooks'
import {AuthContext} from '../context/auth'

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
                username: $username
                password: $password
        ){
            id email username createdAt token
        }
    }
`

export default function Login(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onSubmit, onChange, values} = useForm(loginUserCallback, {
        username: '',
        password: ''
    })

    const [loginUser, {loading}] = useMutation(LOGIN_USER,{
        update(proxy, {data: { login: userData}}){
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function loginUserCallback(){
        loginUser()
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Login</h1>
                <Form.Input 
                label="Username"
                placeholder="Username.."
                name="username"
                type="text"
                value={values.username}
                onChange={onChange}
                error={errors.username ? true : false}
                />
                 <Form.Input 
                label="Password"
                placeholder="Password.."
                name="password"
                type="password"
                value={values.password}
                onChange={onChange}
                error={errors.password ? true : false}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && 
            <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value => {
                        return <li key={value}>{value}</li>
                    })}
                </ul>
            </div>}
        </div>
    )
}