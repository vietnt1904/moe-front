import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

const Layout = () => {
  // const { isOpen } = useNavbarStore();
  // get session using useCurrentUser hook
  // const { session, isLoading } = useCurrentUser();

  // useNavigate hook to navigate page
  // const navigate = useNavigate();

  // useEffect(() => {
  //     // If session is null, navigate to login page
  //     if (!isLoading && !session) navigate("/");
  // }, [session, navigate, isLoading]);

  return (
    <AppShell
      transitionDuration={500}
      transitionTimingFunction="ease"
    >
      {/* Main App */}
      <AppShell.Main className="bg-[linear-gradient(90deg,_#9AFDF7_3.43%,_#FFC7C7_86.18%)] shadow-[0px_4px_4px_rgba(0,0,0,0.5)] flex flex-col min-h-screen">
        <Header />
        <Outlet />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
