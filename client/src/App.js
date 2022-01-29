import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';  //gentrate an ide
import './App.css';

import Editor from './components/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`} /> } />  {/*create a new id*/}
        <Route path='/docs/:id' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
