// app/shop/my_shop/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader, AlertCircle, Store } from "lucide-react";

export default function MyShopPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://103.253.145.7:3002/api/shops/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch shop");
        setShop(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShop();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader className="animate-spin mr-2" />
        Đang tải thông tin shop...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 gap-2">
        <AlertCircle />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Store className="text-orange-500" size={28} />
        <h1 className="text-3xl font-bold">Thông tin Shop: {shop.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop Logo */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Logo</h2>
          {shop.logo_url ? (
            <img src={shop.logo_url} alt="Shop logo" className="w-32 h-32 object-cover rounded" />
          ) : (
            <p className="text-gray-400">Chưa có logo</p>
          )}
        </div>

        {/* Cover Photo */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Ảnh bìa</h2>
          {shop.cover_photo_url ? (
            <img src={shop.cover_photo_url} alt="Cover" className="w-full h-32 object-cover rounded" />
          ) : (
            <p className="text-gray-400">Chưa có ảnh bìa</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Thông tin liên hệ</h2>
          <p><strong>Email:</strong> {shop.contact_email || "N/A"}</p>
          <p><strong>Phone:</strong> {shop.contact_phone || "N/A"}</p>
          <p><strong>Địa chỉ:</strong> {shop.address || "N/A"}</p>
          <p><strong>Thành phố:</strong> {shop.city || "N/A"}</p>
          <p><strong>Quốc gia:</strong> {shop.country || "N/A"}</p>
          <p><strong>Mã bưu điện:</strong> {shop.postal_code || "N/A"}</p>
        </div>

        {/* Business Info */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Thông tin kinh doanh</h2>
          <p><strong>Mã đăng ký:</strong> {shop.business_registration || "N/A"}</p>
          <p><strong>Xếp hạng:</strong> {shop.rating || "0.00"}</p>
          <p><strong>Lượt đánh giá:</strong> {shop.total_reviews ?? 0}</p>
          <p><strong>Trạng thái:</strong> {shop.status || "Chưa xác định"}</p>
          <p><strong>Xác minh:</strong> {shop.is_verified ? "✔️ Đã xác minh" : "❌ Chưa xác minh"}</p>
          <p><strong>Ngày tạo:</strong> {new Date(shop.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
