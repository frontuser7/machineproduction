import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import MachineDetails from './Pages/HeroSections/MachineDetails/MachineDetails';
import ProductionData from './Pages/HeroSections/ProductionData/ProductionData';
import ProductionList from './Pages/HeroSections/ProductionList/ProductionList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='machinedetails' element={<MachineDetails/>}/>
          <Route path='addproduction' element={<ProductionData/>}/>
          <Route path='productionlist' element={<ProductionList/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
