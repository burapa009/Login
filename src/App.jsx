import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <div>
      <Routes> 
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
