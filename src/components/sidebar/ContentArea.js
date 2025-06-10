export default function ContentArea() {
  return (
    <div className="mx-auto w-3/5 h-full overflow-y-auto">
      <div className="min-h-screen space-y-10 p-6">
        {/* Map các video feed tại đây */}
        <div className="h-[90vh] bg-red-200">Video 1</div>
        <div className="h-[90vh] bg-blue-200">Video 2</div>
        <div className="h-[90vh] bg-green-200">Video 3</div>
      </div>
    </div>
  );
}
