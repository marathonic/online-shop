import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import StyledNavbar from "../components/StyledNavbar";

const SharedLayout = ({ numberOfItems, itemsInCart, user, inTheBag }) => {
  return (
    <>
      <Header />
      <StyledNavbar itemsInCart={itemsInCart} user={user} inTheBag={inTheBag} />
      <Outlet />
    </>
  );
};
export default SharedLayout;
