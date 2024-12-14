import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ setSelectedCategory, refreshData }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null); // Track which category is being dragged over

  // Fetch categories and update the sidebar
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/categories/");
      const allCategory = {
        id: 0, // Use 0 to represent "All"
        name: "All",
        products: response.data.flatMap((category) => category.products || []),
      };
      setCategories([allCategory, ...response.data]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch categories");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onDragOver = (e, category) => {
    e.preventDefault(); 
    setDragOverCategory(category.id); 
  };

  const onDragLeave = () => {
    setDragOverCategory(null); 
  };

  const onDrop = async (e, category) => {
    e.preventDefault();
    setDragOverCategory(null); 
    const product = JSON.parse(e.dataTransfer.getData("product"));

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/products/${product.id}/category`,
        {
          category_id: category.id,
        }
      );
      console.log(
        `Product ID: ${product.id} moved to Category ID: ${category.id}`,
        response.data
      );
      await fetchCategories(); 
      refreshData(); 
    } catch (error) {
      console.error("Failed to update product category:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id === 0 ? null : category); 
  };

  return (
    <div className="w-64 bg-white text-black p-6 border-r -mt-4">
      <h2 className="text-2xl font-bold decoration-slice underline-offset-4 decoration-black">
        Groceries
      </h2>
      <div className="mt-2">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="text-black-600">
              <th
                colSpan="2"
                className="p-3 border-b border-blue-gray-100 text-left"
              >
                <button className="flex items-center justify-center w-full h-full text-[14px] font-[Helvetica] font-normal leading-[21px] text-decoration-skip-ink-none">
                  <span className="mr-3">+</span> New list
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-3 text-center">Loading...</td>
              </tr>
            )}

            {error && (
              <tr>
                <td className="p-3 text-center text-red-500">{error}</td>
              </tr>
            )}

            {!loading &&
              !error &&
              categories.map((category) => (
                <tr
  key={category.id}
  className={`cursor-pointer border-b border-blue-gray-100 relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500 before:scale-0 hover:before:scale-100 transition-all ${
    dragOverCategory === category.id
      ? "bg-blue-200"
      : "hover:bg-[#EDF0FF]"
  }`}
  onClick={() => handleCategoryClick(category)} 
  onDragOver={(e) => onDragOver(e, category)} 
  onDragLeave={onDragLeave} 
  onDrop={(e) => onDrop(e, category)} 
>
  <td className="p-3 flex items-center whitespace-nowrap">
    {category.name}{" "}
    <span className="text-gray-500 mx-1">
      ({category.products ? category.products.length : 0} items)
    </span>
  </td>
</tr>

              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sidebar;
