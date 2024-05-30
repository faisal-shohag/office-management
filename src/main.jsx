import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
// import App from './App.jsx';
import Dashboard from './routes/Dashboard';
import AuthProvider from './Providers/AuthProvider';
import DashboardContent from './routes/DashboardContent';
import Class from './routes/Classes/Classes';
import LoginView from './routes/LoginView';
import { Toaster } from 'react-hot-toast';
import Teachers from './routes/Teachers/Teachers';
import AddTeacher from './routes/Teachers/AddTeacher';
import AddClasses from './routes/Classes/AddClasses';
import ClassView from './routes/Classes/ClassView';
import Students from './routes/Students/Students';
import AddStudents from './routes/Students/AddStudents';
import Staffs from './routes/Staffs/Staffs';
import AddStuffs from './routes/Staffs/AddStuffs';
import Subjects from './routes/Subjects/Subjects';
import AddSubjects from './routes/Subjects/AddSubjects';
import Fees from './routes/Fees/Fees';
import AddFees from './routes/Fees/AddFees';
import Sections from './routes/Sections/Sections';
import AddSections from './routes/Sections/AddSections';
import Results from './routes/Result/Results';
import AddResults from './routes/Result/AddResults';
import IdCards from './routes/IdCard/IdCards';
import SalaryReport from './routes/Salary/SalaryReport';
import PaySalary from './routes/Salary/PaySalary';
import Reports from './routes/Report/Reports';
import AddReports from './routes/Report/AddReports';
import Exams from './routes/Exam/Exams';
import AddExams from './routes/Exam/AddExams';
import AddAccounts from './routes/Accounts/AddAccounts';
import ViewAccountReport from './routes/Accounts/ViewAccountReport';
import StudentProfile from './routes/Profile/StudentProfile';
import TeacherProfile from './routes/Profile/TeacherProfile';
import StaffProfile from './routes/Profile/StaffProfile';
import AddAttendance from './routes/Attendance/AddAttendance';
import EditClasses from './routes/Classes/EditClasses';
import EditStudents from './routes/Students/EditStudents';
import EditTeacher from './routes/Teachers/EditTeacher';
import EditStuff from './routes/Staffs/EditStuff';
import Settings from './routes/Settings/Settings';
import PrivateRoute from './routes/PrivateRoute';
import TotalTransection from './routes/TotalTransection/TotalTransection';
import AddVisitor from './routes/Visitors/AddVisitor';
import VisitorReport from './routes/Visitors/VisitorReport';
import NotFound from './routes/NotFound';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView/>
  },
  {
    path: "/",
    element: <PrivateRoute><Dashboard/></PrivateRoute>,
    errorElement: <NotFound/>,
    children: [
      {
        path: "/",
        element: <DashboardContent/>,
      },
      {
        path: "/teachers",
        element: <Teachers />,
      },
      {
        path: "/add-teachers",
        element: <AddTeacher />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/add-students",
        element: <AddStudents />,
      },
      {
        path: "/staffs",
        element: <Staffs />,
      },
      {
        path: "/add-staffs",
        element: <AddStuffs />,
      },
      {
        path: "/subjects",
        element: <Subjects />,
      },
      {
        path: "/add-subjects",
        element: <AddSubjects />,
      },
      {
        path: "/classes",
        element: <Class/>
      },
      {
        path: "/add-classes",
        element: <AddClasses />,
      },
      {
        path: "/class-view/:id",
        element: <ClassView />,
      },
      {
        path: "/fees",
        element: <Fees />,
      },
      {
        path: "/add-fees",
        element: <AddFees />,
      },
      {
        path: "/sections",
        element: <Sections />,
      },
      {
        path: "/add-sections",
        element: <AddSections />,
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/add-results",
        element: <AddResults />,
      },
      {
        path: "/id-cards",
        element: <IdCards />,
      },
      {
        path: "/salaries-report",
        element: <SalaryReport />,
      },
      {
        path: "/pay-salaries",
        element: <PaySalary />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/add-reports",
        element: <AddReports />,
      },
      {
        path: "/exams",
        element: <Exams />,
      },
      {
        path: "/add-exams",
        element: <AddExams />,
      },
      {
        path: "/add-accounts",
        element: <AddAccounts />,
      },
      {
        path: "/view-accounts-report",
        element: <ViewAccountReport />,
      },
      {
        path: "/admin-settings",
        element: <Settings />,
      },
      {
        path: "/student-profile/:id",
        element: <StudentProfile />,
      },
      {
        path: "/teachers-profile/:id",
        element: <TeacherProfile />,
      },
      {
        path: "/staffs-profile/:id",
        element: <StaffProfile />,
      },
      {
        path: "/add-attendance",
        element: <AddAttendance />,
      },
      /* Edit Works */
      {
        path: "/editClass/:id",
        element: <EditClasses />,
      },
      {
        path: "/editStudent/:id",
        element: <EditStudents />,
      },
      {
        path: "/teachers-edit/:id",
        element: <EditTeacher />,
      },
      {
        path: "/staffs-edit/:id",
        element: <EditStuff />,
      },
      {
        path: "/total-transection",
        element: <TotalTransection />,
      },
      {
        path: "/add-visitor",
        element: <AddVisitor />,
      },
      {
        path: "/view-visitor-report",
        element: <VisitorReport />,
      },
    ]
  },

  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
    <Toaster/>
     
  </React.StrictMode>,
)
