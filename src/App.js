import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./AuthPages/LoginPage";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Pages/Dashboard";
import { useSelector } from "react-redux";
import Categories from "./Pages/Categories";
import Users from "./Pages/Users";
import Brands from "./Pages/Brands";
import SubCategories from "./Pages/SubCategories";
import AppBanner from "./Pages/AppBanners";
import Enquiries from "./Pages/Enquiries";
import Admins from "./Pages/Admins";
import Products from "./Pages/Products";
import ProductSpecification from "./Pages/ProductSpecifications";
import ContactUs from "./Pages/ContactUs";
import "./assets/style/modal.css";
import "./assets/style/tabs.css";
import Orders from "./Pages/Orders";

function App() {
  const isLogin = useSelector((state) => state.userAuth);

  return (
    <div className="App">
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={"/login"} />} />
            {/* <Route path="/register" element={<RegistrationPage />} /> */}

            <Route element={<ProtectedRoutes />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/subcategories" element={<SubCategories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/productSpecification" element={<ProductSpecification />} />
                <Route path="/appBanner" element={<AppBanner />} />
                <Route path="/enquiries" element={<Enquiries />} />
                <Route path="/users" element={<Users />} />
                <Route path="/contactUs" element={<ContactUs />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
            </Route>

            <Route
              path="/login"
              element={
                isLogin ? <Navigate to={"/dashboard"} replace /> : <LoginPage />
              }
            />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
