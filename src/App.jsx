import { useState, useEffect } from 'react'
import './App.css'
import { supabase} from './lib/supabase'

// 할일
// [{
//   id:String,
//   text:String,
//   completed:Boolean,
// }]

function App() {
  const [inputValue,setInputValue]=useState('') // const [read-only,데이터 수정할 수 있는 함수]
  const [todos,setTodos]=useState([]) // useStatd([]):처음에 빈배열을 기본값으로 갖는 상태를 하나 만듦

  // 데이터 조회(READ)
  // 컴포넌트가 렌더링이 끝난 후 
  // Supabase의 todos테이블의 데이터를 가져온 후에
  // setTodos를 활용해서 todos 업데이트
  useEffect(()=>{
    fetchTodos();
  },[]) // 배열=>렌더링이 끝난 다음에 함수를 가져온다

  // 데이터 조회
  const fetchTodos= async ()=>{
    try{
      let { data: todos, error } = await supabase.from('todos').select('*')

      if(error){
        console.log(error);
        return;
      }
      setTodos(todos || []); // 앞이 true이면 값이 그대로 들어감, false이면 빈배열
    }catch(error){
      console.log(error);
    }
  }

  // id는 자동추가, completed는 항상 false
  // 데이터 추가(CREATE)
  const addTodo=async (e)=>{
    e.preventDefault(); // reloading되는 것을 막겠다

    try{
      const { data, error } = await supabase.from('todos').insert([{ text: inputValue },]).select()
      console.log(data[0])
      if(data && data.length>0){
        setTodos([data[0], ...todos]); // setTodos를 통해서 react가 데이터가 바뀌었음을 인지하고 업데이트함
      }
      setInputValue('');
    }catch(error){
      console.log(error);
    }

    const newTodo={
      id: new Date().getTime()+Math.random(), // 랜덤값을 붙여서 중복방지
      text: inputValue,
      completed: false,
    };
  };

  // 데이터 업데이트(UPDATE)
  const toggleTodo=async (id)=>{
    try{
      // id에 해당하는 todo 데이터 객체를 가져올 것 <- completed 값 가져오기 위해서
      // id에 해당하는 Supabase todo 데이터 객체에 completed 값을 업데이트
      // setTodos 데이터 업데이트
      const todo=todos.find(t=>t.id===id); // id가 일치하는 값을 가져옴
      if(!todo) return;

      // data:각각의 배열 -> data[0]:0번째 배열
      const { data, error } = await supabase.from('todos').update({ completed: !todo.completed }).eq('id', id).select()
      if(error){
        console.log(error);
        return;
      }

      if(data && data.length>0){
        setTodos(
          todos.map((todo)=> // map함수를 통해서 todos 배열을 하나씩 훑음
            todo.id===id ? data[0] : todo // 체크박스를 누른 id이면, 새데이터(data[0])를 그 자리에 넣음 / 아니면 그대로
          )
        );
      }
    }catch(error){
      console.log(error);
    }
  };

  const deleteTodo=async (id)=>{
    try{
      const { error } = await supabase.from('todos').delete().eq('id',id); // eq:equal,'id'(컬럼)===id인 것만 선택
      if(error){
        console.log(error);
        return;
      }
      setTodos(todos.filter((todo)=>id!==todo.id));
    }catch(error){
      console.log(error)
    }
  };

  return (
    <>
      <div className='app'>
        <div className='todo-container'>
          <header className='header'>
            <h1>🔥Todo List🔥</h1>
            <p className='subtitle'>일정을 체계적으로 관리하세요</p>
          </header>
          <form className='input-form' onSubmit={addTodo}>
            <input
              type='text'
              value={inputValue}
              onChange={(e)=>setInputValue(e.target.value)}
              placeholder='새로운 할 일을 입력하세요.'
              className='todo-input'
            />  
            <button type='submit' className='add-button'>추가</button>
          </form>
          <div className='todo-list'>
            {
              todos.length===0 ? (
                <div className='empty-state'>아직 할 일이 없습니다.</div>
              ) : (
                todos.map((todo)=>(
                  <div
                    key={todo.id}
                    className={`todo-item ${todo.completed ? 'completed' : ''}`} // completed가 된 경우에는 completed 처리, 반대는 빈칸 처리
                  >
                    <label className='todo-checkbox'>
                      <input
                        type='checkbox'
                        checked={todo.completed}
                        onChange={()=>toggleTodo(todo.id)}
                      />
                      <span className='todo-text'>{todo.text}</span>
                      <button
                        className='delete'
                        onClick={()=>deleteTodo(todo.id)}>🗑️</button>
                    </label>
                  </div>
                ))
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
