import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import MachineDetails from './Pages/HeroSections/MachineDetails/MachineDetails';
import ProductionData from './Pages/HeroSections/ProductionData/ProductionData';
import PlantDetails from './Pages/HeroSections/PlantDetails/PlantDetails';
import SKUDetails from './Pages/HeroSections/SKUDetails/SKUDetails';
import PlantSetup from './Pages/HeroSections/PlantSetup/PlantSetup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Graphs from './Pages/HeroSections/Graphs/Graphs';

function App() {
  return (
    <BrowserRouter>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='machinedetails' element={<MachineDetails/>}/>
          <Route path='addproduction' element={<ProductionData/>}/>
          <Route path='plantdetails' element={<PlantDetails/>}/>
          <Route path='skudetails' element={<SKUDetails/>}/>
          <Route path='plantsetup' element={<PlantSetup/>}/>
          <Route path='graphs' element={<Graphs/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
