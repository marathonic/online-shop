import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { IoCartOutline } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import countAllItems from "../components/helper-functions/countAllItems";
import { useMediaQuery } from "react-responsive";
import products from "../data";

const CartSection = ({
  inCart,
  itemsInCart,
  removeFromCartTotally,
  resetItemCount,
  ItemCounter,
  user,
}) => {
  const linkedImg = {
    display: "flex",
    width: "max-content",
    height: "max-content",
    alignItems: "flex-end",
  };

  const noEmptyQty = inCart.filter((item) => itemsInCart[item.name] >= 1);
  const noRepeats = [...new Set(noEmptyQty)];
  const totalItemCount = countAllItems(itemsInCart);

  const [cost, setCost] = useState(0);
  const [conversionDisplay, setConversionDisplay] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    const updateCost = () => {
      setCost(() => {
        const arrayedAmounts = [...Object.values(itemsInCart)];
        const prices = [];
        for (let i = 0; i < products.length; i++) {
          const current = products[i];
          prices.push(current.price);
        }
        const multiplied = [];
        for (let i = 0; i < arrayedAmounts.length; i++) {
          multiplied.push(prices[i] * arrayedAmounts[i]);
        }
        return multiplied.reduce((a, b) => a + b, 0);
      });
    };

    updateCost();
  }, [itemsInCart]);

  const LoginBtn = ({ user }) => {
    if (!user && totalItemCount > 0) {
      return (
        <Link to="/login">
          <button className="btn">Log in to continue</button>
        </Link>
      );
    } else if (user && totalItemCount > 0) {
      return (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <button
            className="btn"
            style={{
              width: "max-content",
              textAlign: "center",
              marginBottom: "5rem",
              fontSize: "1.1rem",
            }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ?autoplay=1",
                "_blank"
              )
            }
          >
            Proceed to checkout
          </button>
        </div>
      );
    } else {
      return null;
    }
  };
  const allItems = noRepeats.map((itemObj) => {
    return (
      <article className="cart-section-item" key={nanoid()}>
        <Link style={linkedImg} to={`/products/${itemObj.id}`}>
          <img
            // src={process.env.PUBLIC_URL + "/" + itemObj.image + ".jpg"}
            src={`/${itemObj.image}`}
            alt={itemObj.name}
            className="item-thumbnail"
          />
        </Link>
        <div className="cart-section-details">
          <Link to={`/products/${itemObj.id}`}>
            <span className="cart-section-item-name">{itemObj.name}</span>
          </Link>
          <div className="cart-price-div">
            <span className="cart-price-span">
              {itemObj.price.toLocaleString("en-US")} ʛ
            </span>
          </div>
          <div className="cart-section-quantity">
            <span className="qty">QTY:</span>
            <span>{ItemCounter(itemObj.name, itemObj)}</span>
            {/* ^^^ holds a numeric value (how many of this X item are in the cart.) */}
          </div>
          <button
            className="remove-item-btn"
            style={{ padding: 0 }}
            onClick={() => {
              removeFromCartTotally(itemObj.id);
              resetItemCount(itemObj.name);
            }}
          >
            <RiDeleteBinLine
              style={{
                pointerEvents: "none",
                color: "darkvioletred",
                padding: 0,
                margin: 0,
              }}
              size={isMobile ? 21 : 22}
            />
          </button>
        </div>
      </article>
    );
  });

  return (
    <div className="cart-section">
      {totalItemCount > 0 && <h5 style={{ textAlign: "center" }}>Your Cart</h5>}
      {totalItemCount === 0 && (
        <span>
          <IoCartOutline
            size={120}
            style={{ color: "rgba(217, 217, 214, 0.6)" }}
          />
          <h5 style={{ color: "silver" }}>0 items in cart</h5>
        </span>
      )}
      <div className="cart-list-overview">{allItems}</div>
      {totalItemCount > 0 && (
        <span style={{ fontSize: "1.32rem", marginBottom: "1rem" }}>
          Your total: {cost.toLocaleString("en-US")} ʛ.
          <button
            onClick={() => setConversionDisplay(!conversionDisplay)}
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <FaInfoCircle
              style={{ pointerEvents: "none", color: "skyblue" }}
              size={17}
            />
          </button>
          {conversionDisplay && (
            <span style={{ fontSize: "1.1rem", color: "teal" }}>
              <div>
                <span>In Muggle currency:</span>
              </div>
              <div>£{(cost * 4.93).toLocaleString("en-US")}</div>
              <div>${(cost * 6.64).toLocaleString("en-US")}</div>
            </span>
          )}
        </span>
      )}
      <LoginBtn user={user} />
    </div>
  );
};

export default CartSection;
