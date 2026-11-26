import { useState } from "react";
import {
  // Card,
  Button, Form, Spinner
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { logoutUser, userAuth, userLogin } from "../../ReduxManager/action";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!number || !password) {
      Swal.fire("Please fill all fields", "", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("loginAdmins", {
        number,
        password,
      });
      console.log(res);

      if (res && res.status === 200) {

        const token = res.data.token;
        const decode = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decode.exp < currentTime) {
          Swal.fire("Token Expire", "", "warn");
          dispatch(logoutUser());
          return;
        }

        dispatch(userAuth(true));
        dispatch(
          userLogin({
            token: res.data.token,
            user_id: res.data.user_id,
          }),
        );

        Swal.fire({
          title: "Login",
          text: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setNumber("");
        setPassword("");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid number and password";

      Swal.fire({
        title: errorMsg,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card-container">

        <div className="card-header">
          <div className="logo-circle">
            <span>SK</span>
          </div>
          <h4 className="title">Login to your account</h4>
          {/* <p className="subtitle">
            Don’t have an account? <span className="link">Get started</span>
          </p> */}
        </div>

        <Form onSubmit={handleLogIn} className="form-container">

          <Form.Group className="form-group" controlId="exampleForm.ControlInputNumber">
            <Form.Label className="form-label">Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your number"
              value={number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setNumber(value);
              }}
              className="form-input"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="form-group" controlId="exampleForm.ControlInputEmail">
            <Form.Label className="form-label">Password</Form.Label>

            <div className="input-box">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />

              <i
                className={showPassword ? "pi pi-eye-slash input-icon" : "pi pi-eye input-icon"}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <span className="link">Forgot password?</span>
          </Form.Group>

          <Button type="submit" className="primary-btn login-btn w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Logging in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* <div className="divider">OR</div> */}

          {/* <div className="login">
            <i className="pi pi-google"></i>
            <i className="pi pi-github"></i>
            <i className="pi pi-twitter"></i>
          </div> */}

        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
