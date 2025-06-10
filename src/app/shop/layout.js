import Header from "@/components/shop/Header";

export default function ShopLayout({ children }) {
  return (
    <div
      className="overflow-y-auto pl-4 pr-4 pb-4 bg-black-cs text-white rounded-lg shadow-lg hide-scrollbar"
      style={{
        width: "900px",
        height: "95vh",
        margin: "20px auto",
      }}
    >
      {/* Header dùng chung cho tất cả các trang shop */}
      {/* onClose và onCartClick sẽ được xử lý ở đây hoặc truyền xuống từ layout cha nếu cần */}
      {/* Ví dụ: onClose={handleCloseShop} nếu có logic đóng shop từ layout cha */}
      <Header/>

      <div className="flex justify-between items-center border-b pb-4 mb-4" />

      {/* `children` sẽ là nội dung của `page.js` (ví dụ: shop/page.js hoặc shop/[id]/page.js) */}
      {children}
    </div>
  );
}
