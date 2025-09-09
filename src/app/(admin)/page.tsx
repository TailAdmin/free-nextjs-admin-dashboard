import { Metadata } from "next";
import MaidDashboardWrapper from "./MaidDashboardWrapper";

export const metadata: Metadata = {
  title: "Maid Dashboard | City Maid Services",
  description: "Your personal dashboard for managing your maid services",
};

export default function MaidDashboardPage() {
  return <MaidDashboardWrapper />;
}
