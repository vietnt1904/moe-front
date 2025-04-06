import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import { ModalsProvider } from '@mantine/modals';
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import PendingShopDetail from "./pages/PendingShopDetailPage.jsx";
import PendingShopListPage from "./pages/PendingShopListPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import '@mantine/carousel/styles.css';
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/pendingshops/",
                element: <PendingShopListPage />,
            },
            {
                path: "/pendingshop/:id",
                element: <PendingShopDetail />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            }
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "signup",
        element: <SignUpPage />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    }
]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* khong can quan tam */}
        <QueryClientProvider client={queryClient}>
            {/* provider cua thu vien ui */}
            <MantineProvider defaultColorScheme="light">
                <ModalsProvider>

                    <NavigationProgress />
                    {/* toast thong bao */}
                    <Notifications />
                    {/* routes */}
                    <DatesProvider
                        settings={{
                            locale: "vn",
                            firstDayOfWeek: 1,
                            timezone: "Asia/Ho_Chi_Minh",
                        }}
                    >
                        <RouterProvider router={router} />
                    </DatesProvider>
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>,
);