import React, {useState,useContext} from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';

import {AuthContext} from '../context/auth'
import {useForm} from '../util/hooks'

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token
        }
    }
`

export default function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const initialState = {
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    }

    const {onChange, onSubmit, values} = useForm(registerUser, initialState)
    
    const [addUser, {loading}] = useMutation(REGISTER_USER,{
        update(proxy, {data: {register: userData}}){
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    // NOTE for callback because addUser is not recognized
    function registerUser(){
        addUser()
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
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
                label="Email"
                placeholder="Email.."
                name="email"
                type="email"
                value={values.email}
                onChange={onChange}
                error={errors.email ? true : false}
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
                 <Form.Input 
                label="Confirm password"
                placeholder="Confirm password.."
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={onChange}
                error={errors.confirmPassword ? true : false}
                />
                <Button type="submit" primary>
                    Register
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