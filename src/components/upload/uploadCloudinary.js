export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Cookies_preset");

  const cloudName = "da9rooi9r";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Upload Fail!");
    console.log("duration:", data.duration)

    return {
      url: data.secure_url,
      type: data.resource_type,
      duration: data.duration || null,
    };
  } catch (error) {
    console.error("Error upload Cloudinary:", error);
    throw error;
  }
}
