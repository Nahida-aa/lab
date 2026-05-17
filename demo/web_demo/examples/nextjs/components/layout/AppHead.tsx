import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggleGradientIcon } from "./theme-toggle";

export const AppHead = () => {
  return (
    <header className="flex justify-between">
      <SidebarTrigger />
      <ModeToggleGradientIcon />
    </header>
  );
};
