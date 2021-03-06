import * as Redux from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

const todo = (state = 0, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if(state.id !== action.id){
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

const todoApp = Redux.combineReducers({
  todos,
  visibilityFilter
})

const store = Redux.createStore(todoApp)

const FilterLink = ({filter, children}) => {
  return (
    <a href='#'
      onClick={(e) => {
        e.preventDefault()
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }}
    >
      {children}
    </a>
  )
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

let nextTodoIn = 0
class TodoApp extends React.Component {
  render(){
    const visibleTodos = getVisibleTodos(
      this.props.todos,
      this.props.visibilityFilter
    )
    return (
      <div>
        <input ref={node => {
          this.input = node
        }} />
        <button onClick={()=>{
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoIn++
          })
        }}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map( (todo) => (
            <li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                })
              }}
              style = {{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
              >
              {todo.text}
            </li>)
          )}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink filter='SHOW_ALL'>
            All
          </FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE'>
            Active
          </FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED'>
            Completed
          </FilterLink>
        </p>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp { ... store.getState()} />,
    document.getElementById('root')
  )
}

store.subscribe(render)
render()
