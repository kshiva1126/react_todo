import React, { FC, useState, useEffect } from 'react'
import { Box, Heading, Link, Checkbox, Icon, Button } from '@chakra-ui/core'
import { Link as RouterLink, withRouter, RouteComponentProps } from 'react-router-dom'
import Auth from '../../utils/Auth'
import url from '../../utils/ApiURL'

type TaskProps = {} & RouteComponentProps<{}>

const TaskList: FC<TaskProps> = ({ history }) => {
  const header = Auth.getHeader()

  interface TaskType {
    id: number
    name: string
    comment: string
    done: boolean
  }

  const [tasks, setTasks] = useState<TaskType[]>([
    {
      id: 0,
      name: '',
      comment: '',
      done: false,
    },
  ])

  const deleteTask = (id: number) => {
    if (window.confirm('削除しますか?')) {
      fetch(`${url}/task/` + encodeURIComponent(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
      })
        .then(async (res) => {
          const data = await res.json()
          if (data !== null && 'detail' in data) {
            Auth.logout()
            history.push('/login')
          }

          setTasks(tasks.filter(task => {
            return task.id !== id
          }))
        })
    }
  }

  const updateDone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const id = target.id
    const value = target.type === "checkbox" ? target.checked : target.value
    fetch(`${url}/done/` + encodeURIComponent(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
      body: JSON.stringify({
        name: '',
        comment: '',
        done: value,
      })
    }).then(async (res) => {
      const data = await res.json()
      if ('detail' in data) {
        Auth.logout()
        history.push('/login')
      }

      setTasks(tasks.map(task => {
        if (task.id === data.id) {
          task.done = data.done
        }

        return task
      }))
    })
  }

  const getTasks = () => {
    fetch(`${url}/task`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if ('detail' in data) {
          Auth.logout()
          history.push('/login')
        }

        if (Array.isArray(data)) {
          const tasks: TaskType[] = []
          const reverse = data.reverse()
          reverse.map(d => {
            if (d.id > 0) {
              tasks.push({
                id: d.id,
                name: d.name,
                comment: d.comment ? d.comment : '',
                done: d.done,
              })
            }
          })
          setTasks(tasks)
        }
      })
  }

  useEffect(() => {
    getTasks()
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
        リスト
      </Heading>

      {tasks && tasks.filter(task => {
        return task.id !== 0
      }).map(task => {
        return (
          <Box
            key={task.id}
            p={4}
            m="20px auto"
            borderWidth='1px'
            isTruncated
            backgroundColor={task.done ? '#87D37C' : ''}
          >
            <Checkbox name='done' id={String(task.id)} defaultIsChecked={task.done} onChange={updateDone}>
              <RouterLink to={'/task/' + encodeURIComponent(String(task.id))}>
                {task.name}
              </RouterLink>
            </Checkbox>
            <Link onClick={() => deleteTask(task.id)}><Icon name='close' float='right' /></Link>
          </Box>
        )
      })}
      <Box mt={3} textAlign='center'>
        <Button ><RouterLink to='/task/new'>タスクを作る</RouterLink></Button>
      </Box>
    </Box>
  )
}

export default withRouter(TaskList)
