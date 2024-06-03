import {Header} from './components/index'
import { Outlet } from 'react-router-dom'

import { AuthProvider } from './provider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import "../src/styles/Variables.css";
function App() {

  return (
      <AuthProvider>
      <Toaster/>
      <div>
      <Header></Header>
      
      </div>      
      <div style={{ display: "flex", flexDirection: "column", marginTop:"6.5rem"}}>
        <Outlet />

        </div>
   </AuthProvider>
       
  )
}

export default App
