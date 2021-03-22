import React, { useState } from 'react'
import Page from '@src/components/page/index'
import styles from './style.scss'
// import { TodoTextInput } from '../TodoTextInput';

interface Props {
  todo?: any
  editTodo?: any
  deleteTodo?: any
  completeTodo?: any
}

export default function TodoItem(props: Props) {
  // export const TodoItem = ({ todo, editTodo, deleteTodo, completeTodo }: Props) => {
  const [count, setcount] = useState(0)

  function countEmite() {
    setcount(count + 1)
  }

  return (
    <Page title="TS">
      <div className={styles.tsbox}>
        <button onClick={countEmite}>click me</button>
        <p>this is my father's world X {count}</p>
      </div>
    </Page>
  )
}
