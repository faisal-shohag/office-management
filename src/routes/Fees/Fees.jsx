import { TooltipProvider } from "@/components/ui/tooltip";
import FeeReport from "./FeeReport";

export default function Fees() {
  return (
    <TooltipProvider>
      <main className="">
        <FeeReport />
      </main>
    </TooltipProvider>
  );
}
