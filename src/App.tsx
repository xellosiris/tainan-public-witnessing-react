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

export const user = {
  id: "00cf91ce-f962-4025-837a-7b47453406dc",
  displayName: "葉逸邱（假）",
  permission: 0,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});
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
