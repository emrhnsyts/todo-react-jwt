import { useState } from 'react';
import { Routes, Route, } from 'react-router-dom';
import Auth from './Auth/Auth';
import Todos from './Todos/Todos';

function App() {
  const [user, setUser] = useState({});


  return (
    <div >
      <Routes>
        <Route path="/" element={<Auth user={user} setUser={setUser} />} />
        <Route path="/todos/:userId" element={<Todos user={user} setUser={setUser} />} />
        <Route path="*" element={<h1>error</h1>} />
      </Routes>
    </div>
  );
}

export default App;
