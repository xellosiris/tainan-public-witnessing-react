import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import timezone from "dayjs/plugin/timezone";
import { Suspense } from "react";
import { Loading } from "./components/ui/loading";
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
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
