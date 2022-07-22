import { Link, useParams } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import products from "../data";

const SingleProduct = (props) => {
  const {
    addToCart,
    addItemToCart,
    itemsInCart,
    ItemCounter,
  } = props;

  const { productId } = useParams();
  const product = products.find((product) => product.id === productId);
  const { image, name, price, description } = product;

  const backToProducts = {
    position: "absolute",
    top: "30%",
    alignItems: "stretch",
  };

  const isAlreadyInCart = () => {
    return itemsInCart[name] > 0;
  };

  return (
    <section className="section product">
      <img src={process.env.PUBLIC_URL + image} alt={name} style={{ maxWidth: "50%" }} />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5>{name}</h5>
        <span>{price.toLocaleString("en-US")} ʛ</span>
        <p>{description}</p>
      </div>
      {/* Conditionally render buttons: add to cart || counter  */}
      {!isAlreadyInCart() ? (
        <div>
          <button
            className="add-cart-btn"
            onClick={() => {
              addToCart(product);
              addItemToCart(name);
              }}
          >
            add to cart
          </button>
        </div>
      ) : (
        ItemCounter(name, product)
      )}


      <Link to="/products">
        <div style={backToProducts}>
          <FaArrowCircleLeft
            style={{
              position: "absolute",
              marginTop: "7px",
              marginLeft: "-11px",
            }}
          />
          &nbsp; Back
        </div>
      </Link>
    </section>
  );
};

export default SingleProduct;
