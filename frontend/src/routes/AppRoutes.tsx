import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Home } from "../pages/Home";
import { CounterfeitDetection } from "../pages/CounterfeitDetection";
import { ScamDetection } from "../pages/ScamDetection";
import { Reports } from "../pages/Reports";
import { ReportDetail } from "../pages/ReportDetail";
import { NotFound } from "../pages/NotFound";
import { Dashboard } from "../pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/counterfeit" element={<CounterfeitDetection />} />
        <Route path="/scam" element={<ScamDetection />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/counterfeit/:id" element={<ReportDetail kind="counterfeit" />} />
        <Route path="/reports/scam/:id" element={<ReportDetail kind="scam" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
