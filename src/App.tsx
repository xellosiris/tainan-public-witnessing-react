import { Route, Routes } from "react-router";
import Layout from "./Layout";
import Home from "./routes/Home";
import Member from "./routes/Member";
import Members from "./routes/Members";
import Overview from "./routes/Overview";
import PersonalShifts from "./routes/PersonalShifts";
import Profile from "./routes/Profile";
import Shifts from "./routes/Shifts";
import Sites from "./routes/Sites";
import VacantShifts from "./routes/vacantShifts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 需要一般使用者Routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="myShifts" element={<PersonalShifts />} />
        <Route path="vacantShifts" element={<VacantShifts />} />

        {/* 需要管理者身份Routes */}
        <Route path="overview" element={<Overview />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="sites" element={<Sites />} />
        <Route path="members">
          <Route index element={<Members />} />
          <Route path=":memberId" element={<Member />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
