import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Error from "./pages/Error";
import SharedLayout from "./pages/SharedLayout";
import SingleProduct from "./pages/SingleProduct";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import SharedProductsLayout from "./pages/SharedProductsLayout";
import CartSection from "./pages/CartSection";
import data from "./data";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import getSeason from "./components/helper-functions/getSeason";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [inCart, setInCart] = useState([]);
  const [banner, setBanner] = useState("");

  const [itemsInCart, setItemsInCart] = useState({});

  useEffect(() => {
    setBanner(() => {
      let season = getSeason();
      let bannerName = `/${season}-banner.jpg`;
      return (
        <img
          src={process.env.PUBLIC_URL + bannerName}
          alt={`${season} sale banner`}
          className="welcome-banner"
        />
      );
    });
  }, []);

  const logOut = () => setUser(null);

  const addToCart = (item) => {
    setInCart((prevInCart) => [...prevInCart, item]);
  };

  const removeFromCartTotally = (itemId) => {
    setInCart((prevInCart) => {
      const filtered = prevInCart.filter((itemObj) => itemObj.id !== itemId);
      return filtered;
    });
  };

  const getListOfItems = () => {
    let allItemNames = {};
    for (let i = 0; i < data.length; i++) {
      let currentObj = data[i];
      allItemNames[currentObj.name] = 0; //<-- initialise all itemsInCart at 0
    }
    return allItemNames;
  };

  //set the default setInCart state to the result of getListOfItems:

  useEffect(() => {
    setItemsInCart(getListOfItems());
  }, []);

  //if there's a user logged in, persist:

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  const addItemToCart = (itemName) => {
    setItemsInCart((prevItemsInCart) => {
      const newCart = {
        ...prevItemsInCart,
        [itemName]: prevItemsInCart[itemName] + 1,
      };
      return newCart;
    });
  };

  //this updates the itemsInCart, where the QTY spans get their values from.
  const removeOneItemFromCart = (itemName) => {
    setItemsInCart((prevItemsInCart) => {
      const newCart = {
        ...prevItemsInCart,
        [itemName]: prevItemsInCart[itemName] - 1,
      };

      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setInCart((prevInCart) => {
      const toModify = [...prevInCart];
      toModify.splice(
        toModify.indexOf(toModify.findIndex((obj) => obj.id === itemId))
      );
      return toModify;
    });
  };

  function ItemCounter(itemName, itemObj) {
    const btnStyle = {
      pointerEvents: "none",
      color: "palevioletred",
    };

    return (
      <div className="counter-container">
        <button
          className="counter-btn"
          onClick={() => {
            itemsInCart[itemName] > 1
              ? removeOneItemFromCart(itemName)
              : resetItemCount(itemName);
          }}
        >
          <FaMinus style={btnStyle} size={18} />
        </button>
        <span className="add-item-counter">{itemsInCart[itemName]}</span>
        {itemsInCart[itemName] < itemObj.available ? (
          <button
            className="counter-btn"
            onClick={() => {
              addToCart(itemObj);
              addItemToCart(itemName);
            }}
          >
            <FaPlus style={btnStyle} size={18} />
          </button>
        ) : (
          <button
            style={{
              border: "none",
              backgroundColor: "pink",
              color: "palevioletred",
            }}
          >
            <FcCancel size={18} />
          </button>
        )}
        {itemsInCart[itemName] >= itemObj.available && (
          <div>
            <span>only {itemObj.available} in stock</span>
          </div>
        )}
      </div>
    );
  }

  const resetItemCount = (itemName) => {
    setItemsInCart((prevItemsInCart) => {
      const newCart = {
        ...prevItemsInCart,
        [itemName]: 0,
      };
      return newCart;
    });
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route
            path="/online-shop/"
            element={<SharedLayout itemsInCart={itemsInCart} user={user} />}
          >
            <Route index element={<Home user={user} banner={banner} />} />
            <Route path="about" element={<About />} />

            <Route
              path="products"
              element={
                <SharedProductsLayout
                  numberOfItems={inCart.length}
                  inCart={inCart}
                  itemsInCart={itemsInCart}
                />
              }
            >
              <Route index element={<Products />} />

              <Route
                path=":productId"
                element={
                  <SingleProduct
                    addToCart={addToCart}
                    addItemToCart={addItemToCart}
                    inCart={inCart}
                    itemsInCart={itemsInCart}
                    removeOneItemFromCart={removeOneItemFromCart}
                    removeFromCartTotally={removeFromCartTotally}
                    removeFromCart={removeFromCart}
                    resetItemCount={resetItemCount}
                    ItemCounter={ItemCounter}
                  />
                }
              />
            </Route>

            <Route
              path="login"
              element={<Login user={user} setUser={setUser}></Login>}
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} logOut={logOut} />
                </ProtectedRoute>
              }
            />
            <Route
              path="cart"
              element={
                <CartSection
                  inCart={inCart}
                  itemsInCart={itemsInCart}
                  removeFromCartTotally={removeFromCartTotally}
                  resetItemCount={resetItemCount}
                  removeOneItemFromCart={removeOneItemFromCart}
                  ItemCounter={ItemCounter}
                  user={user}
                />
              }
            />

            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
