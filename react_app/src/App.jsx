{/*import Layout from "./components/home/layout_home/Layout_home";
import AppProvider from "./context/AppContext";
import { Routes, Route } from "react-router-dom";
import nucast from "./components/nucast/Nucast";

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
  export default App;
*/}



// App.jsx
import Layout from "./components/home/layout_home/Layout_home";
import AppProvider from "./context/AppContext";
import { Routes, Route } from "react-router-dom";
import Nucast from "./components/nucast/layout_nu/Nucast";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <AppProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;