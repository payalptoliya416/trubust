import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const Company = Loadable(lazy(() => import('pages/company/Company')));
const SingleCompanyView = Loadable(lazy(() => import('pages/company/SingleCompanyView')));
const EditCompany = Loadable(lazy(() => import('pages/company/EditCompany')));
const UserComponent = Loadable(lazy(() => import('pages/user/UserComponent')));
const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'company',
      element: <Company />
    },
    {
      path: 'addcompany',
      element: <EditCompany />
    },
    {
      path: 'signleCompany',
      element: <SingleCompanyView />
    },
    {
      path: 'user',
      element: <UserComponent />
    },
    {
      path: 'useraddorupdate',
      element: <AddUser />
    },
    {
      path: 'typography',
      element: <Typography />
    },
  ]
};

export default MainRoutes;
