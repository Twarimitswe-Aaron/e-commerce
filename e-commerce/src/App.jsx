
import{BrowserRouter,Route,Routes} from "react-router-dom"
import { LoginPage,SignUp } from "./Routes"

import './App.css'

function App() {
  return (
   <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<LoginPage/>}/>    
    </Routes>
    </BrowserRouter>
   </>
  )
   
}

export default App
