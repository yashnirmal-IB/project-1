import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const theme = useSelector((state) => state.theme.value);
  return (
    <Box
      className={`w-[275px] h-full flex flex-col pt-2 border-r ${
        theme === "dark" && "border-gray-600"
      }`}
    >
      <Link
        to="/"
        variant="text"
        underline="none"
        className="w-full text-center py-2.5"
      >
        Dashboard
      </Link>
      <Link
        to="/customers"
        variant="text"
        underline="none"
        className="w-full text-center py-2.5"
      >
        Customers
      </Link>
    </Box>
  );
}
