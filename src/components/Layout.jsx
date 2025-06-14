import { AppShell } from "@mantine/core";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Kiểm tra ngay khi load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const [isFirst, setIsFirst] = useState(true);
  // const handleIsFirst = () => {
  //   setIsFirst(false);
  //   window.open("https://www.youtube.com", "_blank");
  // };

  return (
    <AppShell
      transitionDuration={500}
      transitionTimingFunction="ease"
      // onClick={isFirst ? handleIsFirst : null}
    >
      <ScrollRestoration />
      {/* Main App */}
      <AppShell.Main className="bg-[linear-gradient(90deg,_#9AFDF7_3.43%,_#FFC7C7_86.18%)] shadow-[0px_4px_4px_rgba(0,0,0,0.5)] flex flex-col min-h-screen">
        <Header />
        <Outlet />
        <Footer />
      </AppShell.Main>
      {showScrollTop && (
        <AppShell.Footer position="right-bottom" className="fixed bottom-4 right-4 z-50">
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 rounded-full hover:bg-gray-300 transition"
            >
              <CircleArrowUp />
            </button>
          </div>
        </AppShell.Footer>
      )}
    </AppShell>
  );
};

export default Layout;
