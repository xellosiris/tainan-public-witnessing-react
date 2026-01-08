import Layout from "@/Layout";
import { Route, Routes } from "react-router";
import Home from "./Home";
import Overview from "./Overview";
import PersonalShifts from "./PersonalShifts";
import Profile from "./Profile";
import Shifts from "./Shifts";
import Sites from "./Sites";
import User from "./User";
import Users from "./Users";
import VacantShifts from "./VacantShifts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 需要一般使用者Routes */}
        <Route path="schedule" element={<Profile />} />
        <Route path="myShifts" element={<PersonalShifts id={"00cf91ce-f962-4025-837a-7b47453406dc"} />} />
        <Route path="vacantShifts" element={<VacantShifts />} />

        {/* 需要管理者身份Routes */}
        <Route path="overview" element={<Overview />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="sites" element={<Sites />} />
        <Route path="users">
          <Route index element={<Users />} />
          <Route path=":userId" element={<User />} />
        </Route>
      </Route>
    </Routes>
  );
}
