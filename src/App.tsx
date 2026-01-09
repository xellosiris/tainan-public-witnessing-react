import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import timezone from "dayjs/plugin/timezone";
import { routeTree } from "./routeTree.gen";
dayjs.extend(timezone);
dayjs.locale("zh-tw");
dayjs.tz.setDefault("Asia/Taipei");
const queryClient = new QueryClient();
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
