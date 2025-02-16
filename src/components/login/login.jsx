import { useState } from "react";
import Nav from "../nav-bar/Nav";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // state สำหรับสมัครสมาชิกเพิ่มเติม
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // ล้างค่าทุกฟิลด์เมื่อเปลี่ยนฟอร์ม
    setUsername("");
    setPassword("");
    setFullName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = "http://localhost:3000";
    // กำหนด endpoint ตามฟอร์มที่เลือก
    const endpoint = isLogin
      ? `${baseURL}/auth/login`
      : `${baseURL}/auth/signIn`;

    // เตรียม payload สำหรับส่งข้อมูล
    let payload = { username, password };

    // ถ้าเป็นสมัครสมาชิกให้เพิ่มข้อมูลเพิ่มเติม
    if (!isLogin) {
      payload = { ...payload, fullName, address, phone, email };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = "เกิดข้อผิดพลาด";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (err) {
          console.error("Error parsing error response:", err);
        }
        setMessage(errorMsg);
        return;
      }

      const data = await response.json();

      if (isLogin) {
        // จัดเก็บ token เมื่อเข้าสู่ระบบสำเร็จ
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userData", JSON.stringify(jwtDecode(data.accessToken)));
        // let userData = localStorage.getItem("accessToken")
        //       ? jwtDecode(localStorage.getItem("accessToken"))
        //       : null;
        setMessage("เข้าสู่ระบบสำเร็จ");
        navigate("/services");
      } else {
        setMessage("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("เกิดข้อผิดพลาดในระบบ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 m-4">
          {isLogin ? (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                เข้าสู่ระบบ
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="ชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  เข้าสู่ระบบ
                </button>
              </form>
              <p
                className="text-center mt-4 text-blue-500 cursor-pointer"
                onClick={toggleForm}
              >
                ยังไม่มีบัญชี? สมัครสมาชิก
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                สมัครสมาชิก
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="ชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="ที่อยู่"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="เบอร์ติดต่อ"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  สมัครสมาชิก
                </button>
              </form>
              <p
                className="text-center mt-4 text-blue-500 cursor-pointer"
                onClick={toggleForm}
              >
                มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
              </p>
            </div>
          )}
          {message && (
            <div className="mt-4 text-center text-red-500">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
