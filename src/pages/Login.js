import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ user, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setUser({ name: name, email: email });
    navigate("/dashboard");
  };

  const styles = {
    display: "flex",
    flexDirection: "column",
    width: "auto",
    alignItems: "center",
  };

  return (
    <section className="section" style={styles}>
      <form className="form" onSubmit={handleSubmit}>
        <h5>log in</h5>
        <div className="form-row">
          <label htmlFor="name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-input"
            id="name"
            placeholder="e.g: Neville"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email" className="form-label">
            e-mail address
          </label>
          <input
            type="email"
            className="form-input"
            id="email"
            placeholder="e.g: example@owl.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-block">
          Alohomora
        </button>
      </form>
    </section>
  );
};
export default Login;
