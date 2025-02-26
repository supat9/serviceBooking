import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-orange-600 text-gray-300 py-6 text-center">
      <div className="container mx-auto">
        <p className="font-bold text-black">Dlog-Tech &copy; 2024</p>
        <p className="mt-2">
          นวัตกรรมการขับขี่ | Quick Shifter |{" "}
          <br />
          {""}|
          <Link to="/repairOrder" className="text-blue-500 hover:underline">
            Repair Order
          </Link>
          {""}| |  
          <Link to="/payment" className="text-blue-500 hover:underline">
            Payment
          </Link>
          {""}| | 
          <Link to="/editUser" className="text-blue-500 hover:underline">
            EditUser
          </Link>
          {""}| | 
          <Link to="/editVehicle" className="text-blue-500 hover:underline">
            EditVehicle
          </Link>
          {""}| |
          <Link to="/editService" className="text-blue-500 hover:underline">
            EditService
          </Link>
          {""}| |
          <Link to="/editAppointment" className="text-blue-500 hover:underline">
            EditAppointment
          </Link>
        </p>
        <p className="mt-2">
          ที่อยู่: Tanon Songpol Alley, ตำบลลำพยา อำเภอเมืองนครปฐม นครปฐม 73000
        </p>
      </div>
    </footer>
  );
}

export default Footer;
