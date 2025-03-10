import { lazy} from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import NotFound from 'pages/404/NotFound';

const Company = Loadable(lazy(() => import('pages/company/Company')));
const SingleCompanyView = Loadable(lazy(() => import('pages/company/SingleCompanyView')));
const EditCompany = Loadable(lazy(() => import('pages/company/EditCompany')));
const UserComponent = Loadable(lazy(() => import('pages/user/UserComponent')));
const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
const SupportTicketChat = Loadable(lazy(() => import('pages/support-ticket/SupportTicketChat')));
const SupportTicket = Loadable(lazy(() => import('pages/support-ticket/SupportTicket')));
const ExternalRequest = Loadable(lazy(() => import('pages/external-request/ExternalRequest')));
const ExternalRequestChat = Loadable(lazy(() => import('pages/external-request/ExternalRequestChat')));
const InternalRequest = Loadable(lazy(() => import('pages/internal-request/InternalRequest')));
const SecureChannel = Loadable(lazy(() => import('pages/secure-channel/SecureChannel')));
const AddAdmin = Loadable(lazy(() => import('pages/admin-user/AddAdmin')));
const Admin = Loadable(lazy(() => import('pages/admin-user/Admin')));
const RolePermission = Loadable(lazy(() => import('pages/admin-user/RolePermission')));
const AddRule = Loadable(lazy(() => import('pages/admin-user/AddRule')));
const ErrorLogs = Loadable(lazy(() => import('pages/logs/ErrorLogs')));
const Logs = Loadable(lazy(() => import('pages/logs/Logs')));
const AddPermission = Loadable(lazy(() => import('pages/admin-user/AddPermission')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {  
  path: '/',
  element: <ProtectedRoute  />,
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      path: '/',
      element: <Dashboard />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />,
        },
        {
          path: '/*',
          element: <NotFound />
        },
        {
          path: 'company',
          element: <Company />
        },
        {
          path: 'company',
          children: [
            {
              path: 'company-add-update',
              element: <EditCompany />,    
            },
          ]
        },
        {
          path: 'company',
          children: [
            {
              path: 'signleCompany',
              element: <SingleCompanyView />
            },
          ]
        },
        {
          path: 'user',
          element: <UserComponent />
        },
        {
          path: 'user',
          children: [
            {
              path: 'user-add-update',
              element: <AddUser />
            },
          ]
        },
        {
          path: 'support-ticket',
          element: <SupportTicket />
        },
        {
          path: 'support-ticket',
          children: [
            {
              path: 'support-ticket-chat',
              element:  <SupportTicketChat />
            }
          ]
        },
         {
          path: 'external-request',
          element: <ExternalRequest />
        },
        {
          path: 'external-request',
          children: [
            {
              path: 'external-request-chat',
              element:  <ExternalRequestChat />
            }
          ]
        },
        {
          path: 'internal-request',
          element: <InternalRequest />
        },
        {
          path: 'secure-channel',
          element: <SecureChannel />
        },
        {
          path: 'role-permission',
          element: <RolePermission />
        },
        {
          path: 'role-permission',
          children: [
            {
              path: 'add-rolename',
              element:  <AddRule />
            }
          ]
        },
        {
          path: 'admin',
          element: <Admin />
        },
        {
          path: 'admin',
          children: [
            {
              path: 'add-user',
              element:  <AddAdmin />
            }
          ]
        },
        {
          path: 'logs',
          element: <Logs />
        },
        {
          path: 'logs',
          children: [
            {
              path: 'error-logs',
              element: <ErrorLogs />
            },
          ]
        },   
        {
          path: 'role-permission',
          children: [
            {
              path: 'add-role-permission',
              element: <AddPermission />
            },
          ]
        },   
      ]
    } 
  ]
};

export default MainRoutes;
