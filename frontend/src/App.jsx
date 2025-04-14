import Header from './Header'
import Homepage from './Homepage'
import { ThemeProvider } from './ThemeProvider'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Homepage />
      </div>
    </ThemeProvider>
  )
}

export default App
