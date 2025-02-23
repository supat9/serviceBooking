import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-orange-600 text-gray-300 py-6 text-center">
      <div className="container mx-auto">
        <p className="font-bold text-lg">Dlog-Tech &copy; 2024</p>
        <p className="mt-2">
          นวัตกรรมการขับขี่ | Quick Shifter |{" "}
          <Link to="/repairOrder" className="text-blue-500 hover:underline">
            Repair Order
          </Link>
          |{" "}
          <Link to="/payment" className="text-blue-500 hover:underline">
            Payment
          </Link>
          |{" "}
          <Link to="/editUser"className="text-blue-500 hover:underline">EditUser</Link>
        </p>
        <p className="mt-2">
          ที่อยู่: Tanon Songpol Alley, ตำบลลำพยา อำเภอเมืองนครปฐม นครปฐม 73000
        </p>
        <p className="mt-2"></p>
      </div>
    </footer>
  );
}

export default Footer;
