import  { useState } from "react";

export default function Payment() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [slipData, setSlipData] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("#", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSlipData(data);
        alert("File uploaded successfully");
        console.log("data", data);
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange}></input>
        <input type="submit" value="Upload"></input>
      </form>
      {/* <img src={imageUrl} alt="Slip" height={300} /> */}
    </div>
  );
}
