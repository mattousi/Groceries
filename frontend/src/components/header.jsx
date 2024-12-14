

const Header = () => {
  return (
    <header className="bg-white  flex justify-between items-center p-2 mr-3">
      <div className="flex flex-col items-start">
  <h3 className="text-lg font-semibold">All</h3>
  <span className="w-[165px] h-[16px]   font-[Helvetica] text-[14px] text-left  text-[#333333]">
  Displaying 0 out of 0 items
</span>

</div>



      <div className="flex items-center justify-end space-x-4 w-full">
        <div className="relative flex items-center">
          
          <input
            type="text"
            placeholder="Recherche"
            className="w-[366px] h-[44px] border rounded-tl-[8px] rounded p-2 shadow-sm pl-10"
          />
          
          <img
            src="/images/recherche.png" 
            alt="search icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
        
        <button className="bg-[#396C95] text-white py-[13px] px-[24px] rounded-tl-[4px] rounded gap-[8px] w-[142px] h-[44px] font-[Helvetica] text-[16px] font-normal leading-[18.4px] text-center  flex items-center justify-center">
  <span className="text-[25px]">
    +
  </span>
  <span className=" text-[14px]">New Item</span>
</button>




      </div>
    </header>
  );
};

export default Header;
