"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Tải lên ảnh hoặc video</h2>

        <div>
          <Label htmlFor="file" className="text-white">Chọn tệp:</Label>
          <input
            type="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleChange}
            className="mt-2 block w-full text-white bg-zinc-800 rounded-md border border-zinc-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
          />
        </div>

        {preview && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-zinc-400">Xem trước:</p>
            {file?.type?.startsWith("image") ? (
              <img src={preview} alt="preview" className="rounded-lg w-full" />
            ) : (
              <video
                controls
                className="rounded-lg w-full max-h-[400px] border border-zinc-700"
              >
                <source src={preview} type={file.type} />
                Trình duyệt không hỗ trợ video.
              </video>
            )}
          </div>
        )}

        {file && (
          <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
            Đã chọn: {file.name}
          </Button>
        )}
      </div>
    </div>
  )
}
