import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { AssistantAuthProvider } from '@/assistant/context/AssistantAuthContext';
import { AssistantSettingsProvider } from '@/assistant/context/AssistantSettingsContext';
import { ProtectedRoute } from './ProtectedRoute';

const StaffLayout = lazy(() => import('@/components/layout/StaffLayout').then((m) => ({ default: m.StaffLayout })));
const ClientLayout = lazy(() => import('@/components/layout/ClientLayout').then((m) => ({ default: m.ClientLayout })));
const StaffOverviewPage = lazy(() => import('@/features/staff/StaffOverviewPage'));
const StaffTasksPage = lazy(() => import('@/features/staff/StaffTasksPage'));
const StaffTeamPage = lazy(() => import('@/features/staff/StaffTeamPage'));
const StaffSettingsPage = lazy(() => import('@/features/staff/StaffSettingsPage'));
const ClientOverviewPage = lazy(() => import('@/features/client/ClientOverviewPage'));
const ClientCasesPage = lazy(() => import('@/features/client/ClientCasesPage'));
const ClientReportsPage = lazy(() => import('@/features/client/ClientReportsPage'));
const ClientBillingPage = lazy(() => import('@/features/client/ClientBillingPage'));
const ClientSupportPage = lazy(() => import('@/features/client/ClientSupportPage'));
const ClientSettingsPage = lazy(() => import('@/features/client/ClientSettingsPage'));
const OrgLayout = lazy(() => import('@/components/layout/OrgLayout').then((m) => ({ default: m.OrgLayout })));
const OrgOverviewPage = lazy(() => import('@/features/org/OrgOverviewPage'));
const OrgStaffAccountsPage = lazy(() => import('@/features/org/OrgStaffAccountsPage'));
const OrgBillingPage = lazy(() => import('@/features/org/OrgBillingPage'));
const OrgSettingsPage = lazy(() => import('@/features/org/OrgSettingsPage'));
const OrganizationsPage = lazy(() => import('@/features/platform/OrganizationsPage'));
const AssistantLayout = lazy(() => import('@/assistant/pages/AssistantLayout').then((m) => ({ default: m.AssistantLayout })));
const ChatPage = lazy(() => import('@/assistant/pages/ChatPage'));
const PublicHubPage = lazy(() => import('@/assistant/pages/PublicHubPage'));
const AssistantProfilePage = lazy(() => import('@/assistant/pages/ProfilePage'));
const AssistantSignupPage = lazy(() => import('@/assistant/pages/SignupPage'));
const AssistantSigninPage = lazy(() => import('@/assistant/pages/SigninPage'));
const ClarifyPage = lazy(() => import('@/assistant/pages/ClarifyPage'));
const ComprehendPage = lazy(() => import('@/assistant/pages/ComprehendPage'));

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const CasesPage = lazy(() => import('@/features/cases/CasesPage'));
const EvidencePage = lazy(() => import('@/features/evidence/EvidencePage'));
const JobsPage = lazy(() => import('@/features/jobs/JobsPage'));
const ForensicsPage = lazy(() => import('@/features/forensics/ForensicsPage'));
const IntegrationsPage = lazy(() => import('@/features/integrations/IntegrationsPage'));
const IpIntelligencePage = lazy(() => import('@/features/geolocation/IpIntelligencePage'));
const SocOverviewPage = lazy(() => import('@/features/soc/SocOverviewPage'));
const RealTimeMonitorPage = lazy(() => import('@/features/soc/RealTimeMonitorPage'));
const SiemSearchPage = lazy(() => import('@/features/soc/SiemSearchPage'));
const AlertsPage = lazy(() => import('@/features/soc/AlertsPage'));
const IncidentsPage = lazy(() => import('@/features/soc/IncidentsPage'));
const EndpointSecurityPage = lazy(() => import('@/features/soc/EndpointSecurityPage'));
const ThreatIntelligencePage = lazy(() => import('@/features/soc/ThreatIntelligencePage'));
const NetworkWatchPage = lazy(() => import('@/features/soc/NetworkWatchPage'));
const VulnerabilityMgmtPage = lazy(() => import('@/features/soc/VulnerabilityMgmtPage'));
const ReportsPage = lazy(() => import('@/features/soc/ReportsPage'));
const PlaybooksPage = lazy(() => import('@/features/soc/PlaybooksPage'));
const SatelliteUplinkPage = lazy(() => import('@/features/soc/SatelliteUplinkPage'));
const SettingsPage = lazy(() => import('@/features/soc/SettingsPage'));
const UsersPage = lazy(() => import('@/features/users/UsersPage'));
const AuditLogsPage = lazy(() => import('@/features/audit/AuditLogsPage'));

export default function App() {
  return (
    <AssistantAuthProvider>
    <AssistantSettingsProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="forensics" element={<ForensicsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="ip-intelligence" element={<IpIntelligencePage />} />
          <Route path="soc/overview" element={<SocOverviewPage />} />
          <Route path="soc/real-time-monitor" element={<RealTimeMonitorPage />} />
          <Route path="soc/siem-search" element={<SiemSearchPage />} />
          <Route path="soc/alerts" element={<AlertsPage />} />
          <Route path="soc/incidents" element={<IncidentsPage />} />
          <Route path="soc/endpoint-security" element={<EndpointSecurityPage />} />
          <Route path="soc/threat-intelligence" element={<ThreatIntelligencePage />} />
          <Route path="soc/network-watch" element={<NetworkWatchPage />} />
          <Route path="soc/vulnerability-mgmt" element={<VulnerabilityMgmtPage />} />
          <Route path="soc/case-management" element={<CasesPage />} />
          <Route path="soc/reports" element={<ReportsPage />} />
          <Route path="soc/playbooks" element={<PlaybooksPage />} />
          <Route path="soc/satellite" element={<SatelliteUplinkPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="organizations" element={<OrganizationsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="*" element={<EmptyState icon="alertCircle" title="Page not found" description="Use the sidebar to get back on track." />} />
        </Route>
      </Route>

      <Route path="staff" element={<ProtectedRoute />}>
        <Route element={<StaffLayout />}>
          <Route index element={<StaffOverviewPage />} />
          <Route path="tasks" element={<StaffTasksPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="team" element={<StaffTeamPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<StaffSettingsPage />} />
          <Route path="analysis-jobs" element={<JobsPage />} />
          <Route path="ip-intelligence" element={<IpIntelligencePage />} />
          <Route path="threat-intelligence" element={<ThreatIntelligencePage />} />
          <Route path="forensics" element={<ForensicsPage />} />
          <Route path="siem-search" element={<SiemSearchPage />} />
        </Route>
      </Route>

      <Route path="org" element={<ProtectedRoute />}>
        <Route element={<OrgLayout />}>
          <Route index element={<OrgOverviewPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="forensics" element={<ForensicsPage />} />
          <Route path="analysis-jobs" element={<JobsPage />} />
          <Route path="ip-intelligence" element={<IpIntelligencePage />} />
          <Route path="real-time-monitor" element={<RealTimeMonitorPage />} />
          <Route path="siem-search" element={<SiemSearchPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="endpoint-security" element={<EndpointSecurityPage />} />
          <Route path="threat-intelligence" element={<ThreatIntelligencePage />} />
          <Route path="network-watch" element={<NetworkWatchPage />} />
          <Route path="vulnerability-mgmt" element={<VulnerabilityMgmtPage />} />
          <Route path="staff-accounts" element={<OrgStaffAccountsPage />} />
          <Route path="billing" element={<OrgBillingPage />} />
          <Route path="settings" element={<OrgSettingsPage />} />
        </Route>
      </Route>

      <Route path="client" element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route index element={<ClientOverviewPage />} />
          <Route path="cases" element={<ClientCasesPage />} />
          <Route path="reports" element={<ClientReportsPage />} />
          <Route path="billing" element={<ClientBillingPage />} />
          <Route path="support" element={<ClientSupportPage />} />
          <Route path="settings" element={<ClientSettingsPage />} />
        </Route>
      </Route>

      <Route path="signup" element={<AssistantSignupPage />} />
      <Route path="signin" element={<AssistantSigninPage />} />

      <Route path="/" element={<AssistantLayout />}>
        <Route index element={<ChatPage />} />
        <Route path="clarify" element={<ClarifyPage />} />
        <Route path="comprehend" element={<ComprehendPage />} />
        <Route path="hub" element={<PublicHubPage />} />
        <Route path="profile" element={<AssistantProfilePage />} />
      </Route>
    </Routes>
    </AssistantSettingsProvider>
    </AssistantAuthProvider>
  );
}
