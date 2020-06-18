import React, { FC, useEffect, useState } from 'react'
import { Button, Box, Input, Heading, Text, Checkbox } from '@chakra-ui/core'
import { useForm } from 'react-hook-form'
import { useParams, withRouter, RouteComponentProps  } from 'react-router-dom'
import Auth from '../../utils/Auth'

interface TaskType {
  id: number
  name: string
  comment: string
  done: boolean
}

type TaskProps = {create:boolean} & RouteComponentProps<{id: string | undefined}>

const Task: FC<TaskProps> = (props) => {
  const { id } = useParams()

  const { register, handleSubmit, errors, getValues, setValue } = useForm<TaskType>({
    defaultValues: {
      id: 0,
      name: '',
      comment: '',
      done: false,
    }
  })

  const formTask = getValues()
  const [ task, setTask ] = useState<TaskType>({
    ...formTask
  })

  const header = Auth.getHeader()

  const onCreate = (task: TaskType) => {
    const url = 'http://localhost:5000/task'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
      body: JSON.stringify(task)
    })

    props.history.push('/tasks')
  }

  const onUpdate = (task: TaskType) => {
    if (!isNaN(id)) {
      const url = 'http://localhost:5000/task/' + encodeURIComponent(id)
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
        body: JSON.stringify(task)
      })

      props.history.push('/tasks')
    }
  }

  const onSubmit = (task: TaskType, e: any) => {
    if (props.create) {
      onCreate(task)
    } else {
      onUpdate(task)
    }
  }

  const getTask = () => {
    if (!isNaN(id)) {
      const url = 'http://localhost:5000/task/' + encodeURIComponent(id)
      const header = Auth.getHeader()
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
      })
        .then(async (res) => {
          const data = await res.json()
          if (data === null) {
            return
          }

          if ('detail' in data) {
            Auth.logout()
            props.history.push('/login')
          }

          for (const property in data) {
            setValue(property, data[property])
          }
        })
    }
  }

  useEffect(() => {
    getTask()
  }, [])

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
        タスク
      </Heading>
      {((props.create) || (!props.create && Number(task.id) !== 0)) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box m={4}>
            <Input
              name='name'
              placeholder='タスク名'
              ref={register({
                required: 'タスク名は必須項目です',
              })}
            />
            {errors.name &&
            <Text color='#f00'>{errors.name.message}</Text>
            }
          </Box>
          <Box m={4}>
            <Input
              name='comment'
              placeholder='コメント'
              ref={register}
            />
          </Box>
          <Box m={4}>
            <Checkbox name='done' children='done' ref={register} />
          </Box>
          <Box mt={5} textAlign='center'>
            <Button type='submit'>{ props.create ? 'タスクを登録する' : 'タスクを更新する'}</Button>
          </Box>
        </form>
      )}
    </Box>
  )
}

export default withRouter(Task)
