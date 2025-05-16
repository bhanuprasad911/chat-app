import React, { useContext } from "react";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import { Navigate, Route, Routes } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { ThemeSelectorContext } from "./context/ThemeContext.jsx";



function App() {
  const { isLoading, authUser } = useAuthUser();
  const {theme} = useContext(ThemeSelectorContext);



  const isAuthenticated = Boolean(authUser);
  const onBoarded = authUser?.isOnboarded || false;
  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && onBoarded ? (
              <Layout showSideBar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notification"
          element={
            isAuthenticated && onBoarded ? (
              <Layout showSideBar={true}>
                <NotificationPage />
              </Layout>

            ) : <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && onBoarded ? (
              <Layout showSideBar={true}>
                <CallPage />
              </Layout>

            ) : <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && onBoarded ? (
              <Layout showSideBar={false}>
                <ChatPage />
              </Layout>

            ) : <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !onBoarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* <Route
          path="*"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        /> */}
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
