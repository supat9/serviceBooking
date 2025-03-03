import { Link } from "react-router-dom";

function Footer() {
  // ดึงข้อมูล user จาก localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  // ตรวจสอบว่า permission เป็น "admin" หรือ "mechanic"
  const hasPermission = userData?.permission === "admin" || userData?.permission === "mechanic";

  return (
    <footer className="bg-orange-600 text-gray-300 py-6 text-center">
      <div className="container mx-auto">
        <p className="font-bold text-1xl text-gray">Dlog-Tech &copy; 2024</p>
        <p className="mt-2">
          นวัตกรรมการขับขี่ | Quick Shifter |{" "}
          <br />
        {hasPermission && (
          <>
            <Link to="/repairOrder" className="text-gray-300 hover:underline">
              Repair Order
            </Link>
            {" | "}
            <Link to="/editUser" className="text-gray-300 hover:underline">
              EditUser
            </Link>
            {" | "}
            <Link to="/editVehicle" className="text-gray-300 hover:underline">
              EditVehicle
            </Link>
            {" | "}
            <Link to="/editService" className="text-gray-300 hover:underline">
              EditService
            </Link>
            {" | "}
            <Link to="/editAppointment" className="text-gray-300 hover:underline">
              EditAppointment
            </Link>
            {" | "}
            <Link to="/addBill" className="text-gray-300 hover:underline">
              AddBill
            </Link>
          </>
        )}
        </p>
        <p className="mt-2">
          ที่อยู่: Tanon Songpol Alley, ตำบลลำพยา อำเภอเมืองนครปฐม นครปฐม 73000
        </p>
      </div>
    </footer>
  );
}

export default Footer;
