import React, { FC, useState } from 'react'
import { Button, Box, Input, Heading, Text, InputRightElement, InputGroup } from '@chakra-ui/core'
import { useForm } from 'react-hook-form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Auth from '../../utils/Auth'
import url from '../../utils/ApiURL'

interface JoinType {
  name: string
  email: string
  password: string
}

type JoinProps = {} & RouteComponentProps<{}>

const Join: FC<JoinProps> = ({ history }) => {
  const { register, handleSubmit, errors, setError } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const postUser = async (joinData: JoinType) => {
    const data = await fetch(`${url}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(joinData)
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if ('access_token' in data) {
          localStorage.setItem('accessToken', data.access_token)
        }

        return data
      })

    return data
  }

  const onSubmit = async (joinData: JoinType, e: any) => {
    const data = await postUser(joinData)
    if ('detail' in data) {
      const key = Object.keys(data.detail)[0]
      if (key === 'name' || key === 'email' || key === 'password') {
        setError(key, 'exists', data.detail[key])

        return
      }
    }

    Auth.storeAccessToken(data)

    history.push('/tasks')
  }

  return (
    <Box
      maxW='md'
      borderWidth='1px'
      rounded='lg'
      w={500}
      p={4}
      m="20px auto"
    >
      <Heading
        as='h1'
        size='xl'
        textAlign='center'
      >
        会員登録
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box m={4}>
          <Input
            name='name'
            placeholder='ユーザ名'
            ref={register({
              required: 'ユーザ名は必須項目です',
            })}
          />
          {errors.name &&
            <Text color='#f00'>{errors.name.message}</Text>
          }
        </Box>
        <Box m={4}>
          <Input
            name='email'
            placeholder='メールアドレス'
            ref={register({
              required: 'メールアドレスは必須項目です',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'メールアドレスの形式が不正です',
              }
            })}
          />
          {errors.email &&
            <Text color='#f00'>{errors.email.message}</Text>
          }
        </Box>
        <Box m={4}>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              name='password'
              placeholder='パスワード 8文字以上32文字以下'
              ref={register(
                {
                  required: 'パスワードは必須項目です',
                  minLength: {
                    value: 8,
                    message: 'パスワードは8文字以上32文字以下で入力してください'
                  },
                  maxLength: {
                    value: 32,
                    message: 'パスワードは8文字以上32文字以下で入力してください'
                  }
                },
              )}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password &&
            <Text color='#f00'>{errors.password.message}</Text>
          }
        </Box>
        <Box mt={5} textAlign='center'>
          <Button type='submit'>会員登録する</Button>
        </Box>
      </form>
    </Box>
  )
}

export default withRouter(Join)
