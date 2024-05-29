import './App.css'
import { Outlet } from 'react-router-dom'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
      <div>Nav</div>
      <div>
      <Button>Click me</Button>
    </div>
      <Outlet/>
    </>
  )
}

export default App
