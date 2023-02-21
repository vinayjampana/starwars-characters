import { Route, Routes } from "react-router";
import CharacterList from './pages/characterList/characterList';
import CharacterView from './pages/characterView/characterView';


function App() {
  return (
    <Routes>
      <Route path="/" element={<CharacterList />} />
      <Route path="/characters"  element={<CharacterList />}  />
      <Route  path="/characters/:id" element={<CharacterView />} />
    </Routes>
  );
}

export default App;
