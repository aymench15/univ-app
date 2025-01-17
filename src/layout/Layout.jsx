import React, { useLayoutEffect } from "react";
import Header from "../components/Header/Header";
import Routers from "../routes/Routers";
import Footer from "../components/Footer/Footer";
import { useLoad } from "../newApp/modules/auth/useLoad";

const Layout = ({ socket }) => {
  const { mutate: loadUser } = useLoad();
  useLayoutEffect(() => {
    loadUser();
  }, [loadUser]);
  return (
    <>
      <Header />
      <main>
        <Routers socket={socket} />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
