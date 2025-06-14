import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from '@mantine/modals';
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import '@mantine/carousel/styles.css';
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import WriteStory from "./pages/WriteStory.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import MessagePage from "./pages/MessagePage.jsx";
import LayoutHeader from "./components/LayoutHeader.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import AuthorPage from "./pages/AuthorPage.jsx";
import StoryPage from "./pages/StoryPage.jsx";
import ChapterPage from "./pages/ChapterPage.jsx";
import UpdateStoryPage from "./pages/UpdateStoryPage.jsx";
import WriteChapter from "./pages/WriteChapter.jsx";
import SearchStoryPage from "./pages/SearchStoryPage.jsx";
import BuildingPage from "./pages/BuildingPagel.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/story/:title",
                element: <StoryPage />,
            },
            {
                path: "/story/author/:title",
                element: <UpdateStoryPage />,
            },
            {
                path: "/story/author/:title/writechapter",
                element: <WriteChapter />
            },
            {
                path: "/search",
                element: <SearchStoryPage />,
            },
            {
                path: "/writestory",
                element: <WriteStory />,
            },
            {
                path: "/profile",
                element: <ProfilePage />,
            },
            {
                path: "/notification",
                element: <BuildingPage />,
                // element: <NotificationPage />,
            },
            {
                path: "/author",
                element: <AuthorPage />,
            },
            {
                path: "/setting",
                element: <SettingPage />,
            },
            {
                path: "/history",
                // element: <HistoryPage />,
                element: <BuildingPage />,
            },
            {
                path: "/story/:title/:chapter",
                element: <ChapterPage />,
            },
            {
                path: "/saved",
                element: <BuildingPage />,
            },
            {
                path: "/mylist",
                element: <BuildingPage />,
            },
            {
                path: "/qa",
                element: <BuildingPage />,
            },
            {
                path: "/*",
                element: <ErrorPage />,
            }
        ],
    },
    {
        path: "/",
        element: <LayoutHeader />,
        children: [
            {
                path: "/message",
                // element: <MessagePage />,
                element: <BuildingPage />,
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    },
    {
        path: "/error",
        element: <ErrorPage />,
    },
    {
        path: "/*",
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