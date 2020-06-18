import React, { FC, useState } from 'react'
import { Button, Box, Input, Heading, Text, Link, Icon, InputRightElement, InputGroup } from '@chakra-ui/core'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, withRouter, RouteComponentProps } from 'react-router-dom'
import Auth, { AuthProps } from '../../utils/Auth'

type LoginProps = {} & RouteComponentProps<{}>

const Login: FC<LoginProps> = ({history}) => {
  const { register, handleSubmit, errors, setError } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const onSubmit = async (data: AuthProps, e: any) => {
    const res = await Auth.authenticate(data)
    if ('detail' in res) {
      const key = Object.keys(res.detail)[0]
      if (key === 'email'|| key === 'password') {
        setError(key, 'incorrent', res.detail[key])

        return
      }
    }

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
        ログイン
      </Heading>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >
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
              placeholder='パスワード'
              ref={register(
                {
                  required: 'パスワードは必須項目です',
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
          <Button type='submit'>ログイン</Button>
        </Box>
      </form>
      <Box mt={3} textAlign='center'>

        初めてご利用の方へ
        <Link>
          <RouterLink to='/join'>
            会員登録する<Icon name="external-link" mx="2px" />
          </RouterLink>
        </Link>
      </Box>
    </Box>
  )
}

export default withRouter(Login)
