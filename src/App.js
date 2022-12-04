import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Page1 from './Page1';
import Page2 from './page2';
import Page3 from './Page3';
import CircularLayout from './gojs-group-templates/circular.group';
import GridLayout from './gojs-group-templates/grid.group';
import TreeLayout from './gojs-group-templates/tree.group';
import Headers from './Headers';


function App() {
  return (
    <Router>
      <Headers></Headers>
      <Routes>
        <Route path='/' element={<Page1 />} />
        <Route path='/page1' element={<Page1 />} />
        <Route path='/page2' element={<Page2 />} />
        <Route path='/page3' element={<Page3 />} />
        <Route path='/circular-layout' element={<CircularLayout />} />
        <Route path='/grid-layout' element={<GridLayout />} />
        <Route path='/tree-layout' element={<TreeLayout />} />
      </Routes>
    </Router>

  );
}

export default App;
