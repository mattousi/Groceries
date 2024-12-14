import React, { useState, useEffect } from "react";
import axios from "axios";

const CardList = ({ selectedCategory, setRefreshCallback }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/products/");
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setRefreshCallback(fetchData); 
  }, [setRefreshCallback]);

  
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category_id === selectedCategory.id)
    : items;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="flex-grow p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex border rounded-md shadow-sm overflow-hidden bg-white min-h-[150px]"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("product", JSON.stringify(item));
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="relative w-1/2">
              <img
                src={`/images/${item.image}`}
                alt={item.name}
                className="w-full h-full"
              />
            </div>
            <div className="p-2 py-2 pt-2 space-y-4">
              <p className="w-[43px] h-[21px] gap-0 text-[#191919] font-helvetica text-base font-normal leading-[20.8px]">
                {item.name}
              </p>
              <p className="w-[43px] h-[21px] gap-0 text-[#191919] font-helvetica text-base font-normal leading-[20.8px]">
                {item.weight}kg
              </p>
              <p className="w-[43px] h-[21px] gap-0 text-[#191919] font-helvetica text-base font-normal leading-[20.8px]">
                {item.quantity}
              </p>
              <p className="w-[43px] h-[21px] gap-0 text-[#191919] font-helvetica text-base font-normal leading-[20.8px]">
                {item.price}$
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CardList;
