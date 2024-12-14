import React, { useState, useRef } from "react";
import Sidebar from "../src/components/sidebar";
import Header from "../src/components/header";
import Card from "../src/components/card";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const refreshCallbackRef = useRef(null);

  const setRefreshCallback = (callback) => {
    refreshCallbackRef.current = callback;
  };

  const refreshData = () => {
    if (refreshCallbackRef.current) {
      refreshCallbackRef.current();
    }
  };

  return (
    <div className="flex">
      <Sidebar
        setSelectedCategory={setSelectedCategory}
        refreshData={refreshData} 
      />
      <div className="flex-grow">
        <Header />
        <Card
          selectedCategory={selectedCategory}
          setRefreshCallback={setRefreshCallback} 
        />
      </div>
    </div>
  );
}

export default App;
