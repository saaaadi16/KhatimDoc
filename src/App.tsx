import React, { useState, createContext, useEffect } from "react";
import { flushSync } from "react-dom";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Signup from "./components/signup/signupComponent";
import Signin from "./components/signin/signinComponent";
import SigninPassword from "./components/signin/signinPassword";
import Home from "./components/home/homeComponent";
import RequireAuth from "./components/requireAuth";
import OtpComponent from "./components/signup/otpComponent";
import SignupPassword from "./components/signup/signupPass";
import SecurityQuestion from "./components/securityQuestion/securityQuestion";
import PreparePackage from "./components/prepare/prepare";
import { PackageContext } from "./services/packageContext";
import Editor from "./components/editor/Editor";
import ForgotPassOTP from "./components/signin/ForgotPassOTP";
import ForgotPassSQ from "./components/signin/ForgotPassSQ";
import SigningComponent from "./components/signing/signingComponent";
import ForgotPassConf from "./components/signin/ForgotPassConf";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedDash from "./components/ProtectedDash";
import ProtectedPackages from "./components/ProtectedPackages";
import { PackagesContent } from "./components/packagesContent/PackagesContent";
import ProtectedSettings from "./components/ProtectedSettings";
import Profile from "./components/settingsComponents/Profile";
import Password from "./components/settingsComponents/Password";
import Question from "./components/settingsComponents/Question";

export interface User {
  userID: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  company?: string;
  number?: string;
  country?: string;
  avatar?: any;
}

export interface IRecep {
  name: string;
  action: string;
  action_performed: string;
  processed: boolean;
}

export interface IRow {
  package_location?: string;
  package_status: string;
  package_guid: string;
  package_name: string;
  serial: boolean;
  last_change: string;
  recipients: IRecep[];
  permitted_actions: string[];
  owner_name: string;
}

function App() {
  const [user, setUser] = useState<User>({
    userID: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [otp, setOtp] = useState<string>("");
  const [question, setQ] = useState<string>("");
  const [currPackage, setCurrPackage] = useState<string>("Hello World");
  const [AccSuccess, setAccSuccess] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<number>();
  const [avatar, setAvatar] = useState<any>();

  const [RowsUpdated, setRowsUp] = useState<number>(0);
  const [ProfileUpdated, setPUp] = useState<number>(0);
  const [SearchText, setSearchText] = useState<string>("");
  const [SearchUpdate, setSearchUp] = useState<number>(0);

  return (
    <div className="App">
      <Router basename="kdoc-dev">
        <PackageContext.Provider
          value={{
            currPackage,
            setCurrPackage,
            recipient,
            setRecipient,
            avatar,
            setAvatar,
            user,
            setUser,
          }}
        >
          <DndProvider backend={HTML5Backend}>
            <Routes>
              <Route element={<RequireAuth user={user} />}>
                <Route path="prepare" element={<PreparePackage />} />
                <Route path="prepare/editor" element={<Editor />} />
                <Route
                  element={
                    <ProtectedDash
                      User={user}
                      setUser={setUser}
                      ProfileUpdated={ProfileUpdated}
                      SearchText={SearchText}
                      setSearchText={setSearchText}
                      SearchUpdate={SearchUpdate}
                      setSearchUp={setSearchUp}
                      RowsUpdated={RowsUpdated}
                    />
                  }
                >
                  <Route
                    path="home"
                    element={
                      <Dashboard
                        User={user}
                        setUser={setUser}
                        ProfileUpdated={ProfileUpdated}
                      />
                    }
                  />
                  <Route
                     element={<ProtectedPackages RowsUpdated={RowsUpdated} />}
                  >
                    <Route
                    
                      path="/inbox"
                      element={
                        <PackagesContent
                          Title={"Inbox"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/sent"
                      element={
                        <PackagesContent
                          Title={"Sent"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/drafts"
                      element={
                        <PackagesContent
                          Title={"Draft"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/pending"
                      element={
                        <PackagesContent
                          Title={"Pending"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/waiting"
                      element={
                        <PackagesContent
                          Title={"Waiting for Others"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/declined"
                      element={
                        <PackagesContent
                          Title={"Declined"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/canceled"
                      element={
                        <PackagesContent
                          Title={"Cancelled"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/completed"
                      element={
                        <PackagesContent
                          Title={"Completed"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                        />
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <PackagesContent
                          Title={"Search Results"}
                          user={user}
                          setUser={setUser}
                          RowsUpdated={RowsUpdated}
                          setRowsUp={setRowsUp}
                          SearchText={SearchText}
                          SearchUpdate={SearchUpdate}
                        />
                      }
                    />
                  </Route>
                  <Route element={<ProtectedSettings />}>
                    <Route
                      path="/profile"
                      element={
                        <Profile
                          Title={"Profile"}
                          User={user}
                          setUser={setUser}
                          ProfileUpdated={ProfileUpdated}
                          setPUp={setPUp}
                        />
                      }
                    />
                    <Route
                      path="/password"
                      element={<Password Title={"Password"} />}
                    />
                    <Route
                      path="/security"
                      element={
                        <Question
                          Title={"Security Question"}
                          question={question}
                          setQ={setQ}
                        />
                      }
                    />
                  </Route>
                </Route>
                <Route
                  path="signin/password"
                  element={
                    <SigninPassword
                      user={user}
                      setQ={setQ}
                      setUser={setUser}
                      setAccSuccess={setAccSuccess}
                    />
                  }
                />
                <Route
                  path="signup/otp"
                  element={
                    <OtpComponent user={user} otp={otp} setOtp={setOtp} />
                  }
                />
                <Route
                  path={"signin/forgotPassword/OTP"}
                  element={
                    <ForgotPassOTP
                      user={user}
                      otp={otp}
                      setOtp={setOtp}
                      question={question}
                      setQ={setQ}
                    />
                  }
                />
                <Route
                  path={"signin/forgotPassword/SQ"}
                  element={
                    <ForgotPassSQ
                      user={user}
                      otp={otp}
                      setOtp={setOtp}
                      question={question}
                      setQ={setQ}
                    />
                  }
                />
                <Route
                  path={"signin/forgotPassword/ConfirmPass"}
                  element={
                    <ForgotPassConf user={user} setUser={setUser} otp={otp} />
                  }
                />
                <Route
                  path="signup/securityQuestion"
                  element={
                    <SecurityQuestion user={user} setUser={setUser} otp={otp} />
                  }
                />
                <Route
                  path="signup/password"
                  element={
                    <SignupPassword
                      user={user}
                      setUser={setUser}
                      otp={otp}
                      setAccSuccess={setAccSuccess}
                    />
                  }
                />
                <Route
                  path="signup/securityQuestion"
                  element={
                    <SecurityQuestion user={user} setUser={setUser} otp={otp} />
                  }
                />
              </Route>
              <Route
                path="/"
                element={
                  <Signin
                    user={user}
                    setUser={setUser}
                    AccSuccess={AccSuccess}
                  />
                }
              />
              <Route
                path="/signin"
                element={
                  <Signin
                    user={user}
                    setUser={setUser}
                    AccSuccess={AccSuccess}
                  />
                }
              />
              <Route
                path="/signup"
                element={<Signup user={user} setUser={setUser} />}
              />
              <Route
                path="/sign/:packageId/:sessionId"
                element={<SigningComponent />}
              />
              <Route path="/redirect" element={<Navigate to="/signin" />} />
            </Routes>
          </DndProvider>
        </PackageContext.Provider>
      </Router>
    </div>
  );
}

export default App;
