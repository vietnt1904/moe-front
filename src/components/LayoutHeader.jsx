import { AppShell, useMantineColorScheme } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";

const LayoutHeader = () => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <AppShell transitionDuration={500} transitionTimingFunction="ease">
      {/* Main App */}
      <AppShell.Main
        className={`h-screen shadow-[0px_4px_4px_rgba(0,0,0,0.5)] flex flex-col min-h-screen ${
          colorScheme === "dark"
            ? "bg-neutral-700"
            : "bg-[linear-gradient(90deg,_#9AFDF7_3.43%,_#FFC7C7_86.18%)]"
        }`}
      >
        <Header />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default LayoutHeader;
