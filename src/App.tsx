import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import timezone from "dayjs/plugin/timezone";
import AppRoutes from "./routes";
dayjs.extend(timezone);
dayjs.locale("zh-tw");
dayjs.tz.setDefault("Asia/Taipei");
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
