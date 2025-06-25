import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedLayout } from "../layout/ProtectedLayout";


const ProtectedRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedLayout/>}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="auth/*" element={<Navigate to="/home" />} />
        {/* Pages */}
        <Route path="home" element={<>home</>} />
        <Route path="register" element={<>register</>} />
        <Route path="user" element={<>user</>} />
        <Route path="make-payment" element={<>make-payment</>} />
        {/* <Route path="dashboard" element={<DashboardWrapper />} />
        <Route path="builder" element={<BuilderPageWrapper />} />
        <Route path="menu-test" element={<MenuTestPage />} />
        <Route path="report" element={<PageReport />} /> */}
{/* 
        <Route
          path="register/*"
          element={
            <SuspensedView>
              <RegisterPage />
            </SuspensedView>
          }
        />
        <Route
          path="master/*"
          element={
            <SuspensedView>
              <MasterPage />
            </SuspensedView>
          }
        />
        <Route
          path="user-management/*"
          element={
            <SuspensedView>
              <UseManagement />
            </SuspensedView>
          }
        />
        <Route path="make-payment/*"
          element={
            <SuspensedView>
              <MakePayment />
            </SuspensedView>
          }
        />
        <Route
          path="user-customer/*"
          element={
            <SuspensedView>
              <CustomerPage />
            </SuspensedView>
          }
        />
        <Route
          path="payment/*"
          element={
            <SuspensedView>
              <Payment />
            </SuspensedView>
          }
        />
        <Route
          path="NCB/*"
          element={
            <SuspensedView>
              <NCB />
            </SuspensedView>
          }
        />
        <Route
          path="test"
          element={
            <SuspensedView>
              <TestMenu />
            </SuspensedView>
          }
        /> */}

        {/* Page Not Found */}
        {/* <Route path="*" element={<Navigate to="/error/404" />} /> */}
      </Route>
    </Routes>
  );
};

export { ProtectedRoute };
