import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import background from "/src/assets/P003.jpg";
import Nav from "../nav-bar/nav";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setPassword("");
    setName("");
    setAddress("");
    setContact("");
    setEmail("");
    setConfirmPassword("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseURL = "http://localhost:3000";
    const endpoint = isLogin
      ? `${baseURL}/auth/login`
      : `${baseURL}/auth/signIn`;

    let payload = { username, password };

    if (!isLogin) {
      payload = { username, name, address, contact, email, password };
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
        if (response.status === 401) {
          errorMsg = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        }
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: errorMsg,
          icon: "error",
          confirmButtonText: "ลองใหม่",
        });
        return;
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "userData",
          JSON.stringify(jwtDecode(data.accessToken))
        );

        Swal.fire({
          title: "เข้าสู่ระบบสำเร็จ!",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/services");
        }, 2000);
      } else {
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ!",
          text: "กรุณาเข้าสู่ระบบเพื่อใช้งาน",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("เกิดข้อผิดพลาดในระบบ");
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
        icon: "error",
        confirmButtonText: "ลองใหม่",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Nav />

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
          {/* Background section - Full width on mobile, half on larger screens */}
          <div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center text-white p-6 sm:p-8 lg:p-10 min-h-[200px] sm:min-h-[250px] lg:min-h-[500px] transform transition duration-200 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Welcome to Dlog Tech</h1>
            <p className="mt-2 text-center text-sm sm:text-base">
              Please log in or sign up to continue.
            </p>
          </div>

          {/* Login/Register Form - Full width on mobile, half on larger screens */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-6 sm:p-8 lg:p-10 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] transform transition duration-200 hover:scale-[1.02]">
            {isLogin ? (
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-4 sm:mb-6">
                  Login Account
                </h2>
                <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm">
                  <div className="mb-3 sm:mb-4">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 sm:py-3 rounded-md font-semibold transition duration-200"
                  >
                    Login
                  </button>
                </form>
                <p
                  className="mt-4 text-orange-600 cursor-pointer text-sm sm:text-base"
                  onClick={toggleForm}
                >
                  ยังไม่มีบัญชี? สมัครสมาชิก
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-500 mb-4 sm:mb-6">
                  Register Account
                </h2>
                <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-3 sm:mt-4 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 rounded-md font-semibold transition duration-200"
                  >
                    Register
                  </button>
                </form>
                <p
                  className="mt-4 text-orange-600 cursor-pointer text-sm sm:text-base"
                  onClick={toggleForm}
                >
                  มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
                </p>
              </>
            )}
            {message && <p className="mt-4 text-red-500 text-sm sm:text-base">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;