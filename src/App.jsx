import React, { useEffect, useState } from 'react'

export default function App() {

  let [initialized, setInitialized] = useState(false);
  let [message, setMessage] = useState('');
  let [task, setTask] = useState({

    number: 999,
    text: 'Test Text!',
    isComplete: false,
  });

  let [tasks, setTasks] = useState([]);
  let [completeTasks, setCompleteTasks] = useState(0);
  let count = tasks.length;




  function getTask(e){

    let newTask = {...task};
    setMessage(e.target.value);
    newTask.text = e.target.value;
    newTask.number = count + 1;
    newTask.isComplete = false;
    setTask(newTask);
  }

  function clickAdd(){

    tasks.push(task);
    setTasks(tasks);
    setMessage("");
   
    localStorage.setItem("taskList",JSON.stringify(tasks));
   
    console.log(tasks);
  }

  function getTaskList(){

    if(localStorage.getItem("taskList") == null){
      setTasks([]);
      setCompleteTasks(0);
    }
    else{
      
      tasks = JSON.parse(localStorage.getItem("taskList"));
      setTasks(tasks);
      let comTasks = localStorage.getItem('compCount');
      if(comTasks == null){ setCompleteTasks(0); }
      else{ 

        comTasks = parseInt(comTasks, 10);
        setCompleteTasks(comTasks + 1);
       
      }
    }
  }

  function deleteTask(id){

    if(tasks[id].isComplete){

      completeTasks = completeTasks - 1;
      localStorage.setItem("compCount",completeTasks);
      setCompleteTasks(completeTasks)
      if(completeTasks === 0){

        localStorage.removeItem('compCount')
      }
    }

    const updatedTasks = tasks.filter((_, i) => i !== id);
    setTasks(updatedTasks);
    if(tasks.length === 1){

      localStorage.removeItem('taskList');
    }
    else{

      localStorage.setItem("taskList",JSON.stringify(tasks));
    }
  }


  function completeTask(id){

    
    let currTask = tasks[id];
    currTask.isComplete = true;
    let newTasks = tasks.map((t)=>
      {if(t.number === currTask.number){

        return { ...t, isComplete: true };
      }
      return t;
    }
    );
    setTasks(newTasks);
    setCompleteTasks(completeTasks + 1);
    localStorage.setItem("taskList",JSON.stringify(tasks));
    localStorage.setItem("compCount",completeTasks);

  }

  function displayTasks(){
    let result = [];
     result = tasks.map((task, index) =>   
      <tr key={index}>
        <th className='id'>{index + 1 }</th>
        <th className='text'>{task.text}</th>
        <th>
          <div className='buttons'>
            <div className='btn controlBtn compBtn' onClick={()=>deleteTask(index)} ><i className=" delt fa-sharp fa-solid fa-trash"></i></div>
            {task.isComplete ? <div className='btn don-text'>Done!</div>:<div onClick={()=>completeTask(index)} className='btn controlBtn compBtn d-flex justify-content-center align-items-center'><i className="comp fa-solid fa-check"></i></div>}
          </div>
        </th>
      </tr>        
    )
    return result;
  }
  useEffect(()=>{

    if (!initialized) {
      getTaskList();
      setInitialized(true);
    }

  },[tasks]);
  return (
    <div className='container d-flex flex-column align-items-center'>
      <div className='table-header'>
        <div className='brd w-25 mt-4 mb-3'></div>
        <h1>To Do List!</h1>
        <div className='brd w-100 mt-3'></div>
      </div>
      <div className='inline-brd '></div>
      <div className='details mb-4 w-100 d-flex flex-column justify-content-around align-items-center'>
        <div className='table-form w-100 mb-4 d-flex justify-content-center align-items-center '>
          <label>What do you want to do?</label>
          <input onChange={getTask} type="text" className="w-50 form-control" value={message}></input>
          <button onClick={clickAdd} className='btn w-10'>Add</button>
        </div>
        <div className='inline-brd '></div>
        <div className='content w-100'>
          <table className="table table-dark" border="1">
            <thead className="bg-primary">
              <tr>
                <th scope="col" className='id'>#</th>
                <th scope="col">Task</th>     
                <th scope="col" className='box'>Delete / Complete?</th>
              </tr>
            </thead>
            <tbody>
              {displayTasks()}
            </tbody>
          </table>
          <div className='text-center d-flex justify-content-center align-items-center'>
            {tasks.length === 0 ? <p className='comp-sent'>You didn`t have any tasks yet.</p> : tasks.length === completeTasks ? <p className='comp-sent'>You Complete All Tasks !!.</p> : <p className='comp-sent'>You Complete {completeTasks} of {tasks.length} Tasks.</p>}
          </div>
        </div>
        <div className='inline-brd w-100 mt-3'></div>
      </div>
    </div>
  )
}
