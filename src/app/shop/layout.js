import Header from "@/components/shop/Header";

export default function ShopLayout({ children }) {
  return (
    <div
      className="overflow-y-auto pl-4 pr-4 pb-4 bg-black-cs text-white rounded-lg shadow-lg hide-scrollbar"
      style={{
        width: "1200px",
        height: "95vh",
        margin: "20px auto",
      }}
    >
      <Header/>

      <div className="flex justify-between items-center border-b pb-4 mb-4" />

      {children}
    </div>
  );
}
