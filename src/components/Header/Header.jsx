import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import logoShort from "../../assets/images/logo_short.png";
import logoFull from "../../assets/images/logo_full.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../../newApp/modules/auth/useAuth";
import Loading from "../Loader/Loading";
import { NO_USER_IMAGE } from "../../utils/utils";

const navLinks = [
  {
    path: "/home",
    display: "Home",
    roles: ["_"],
  },
  {
    path: "/uploader",
    display: "Upload documents",
    roles: ["Doctor", "Professor"],
  },
  // {
  //   path: "/assessments",
  //   display: "Assessments",
  // },
  {
    path: "/contact",
    display: "Contact",
    roles: ["_"],
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  // const [ImageSrc,setImageSrc] = useState(NO_USER_IMAGE)
  const { user, token, isLoading, resetAuth } = useAuth((state) => state);
  const role = user?.role;

  const handleLogout = () => {
    resetAuth();
  };

  const handleStickyHeader = useCallback(() => {
    window.addEventListener("scroll", () => {
      if (headerRef.current) {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        )
          headerRef.current.classList.add("sticky__header");
        else headerRef.current.classList.remove("sticky__header");
      }
    });
  });

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  const toggleMenu = () =>
    menuRef.current && menuRef.current.classList.toggle("show__menu");

  // useEffect(() => {
  //   const loadImage = async () => {
  //     try {
  //       const response = await fetch(user.img);
  //       if (!response.ok) {
  //         setImageSrc(response.url || user.img || NO_USER_IMAGE);
  //         throw new Error("Image failed to load");
  //       }
  //       setImageSrc(response.url);
  //     } catch (error) {
  //       setImageSrc(NO_USER_IMAGE);
  //       console.error(error);
  //     }
  //   };

  //   loadImage();
  // }, [ImageSrc]);

  return (
    <div className="flex flex-col">
      {!isLoading && (
        <header
          className="header flex items-center"
          ref={headerRef}
        >
          <div className="container flex flex-col">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={"/"}>
                <img
                  className="block md:hidden h-[64px]"
                  src={logoShort}
                  alt="Logo"
                />
                <img
                  className="hidden md:block h-[64px]"
                  src={logoFull}
                  alt="Logo"
                />
              </Link>
              {/* ####### Menu ######## */}
              <div
                className="navigation text-nowrap"
                ref={menuRef}
                onClick={toggleMenu}
              >
                <ul className="menu flex flex-col md:flex-row items-center gap-[2.7rem]">
                  {navLinks
                    .filter((l) => !l.roles || l.roles.includes(role))
                    .map((link, index) => (
                      <li key={index}>
                        <NavLink
                          to={link.path}
                          className={(navClass) =>
                            navClass.isActive
                              ? "text-primaryColor text-[16px] leading-7 font-[600]"
                              : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                          }
                        >
                          {link.display}
                        </NavLink>
                      </li>
                    ))}
                  {token && user && role === "doctor" && (
                    <>
                      <NavLink
                        to={"/program"}
                        className={"btn btn-sm btn-primary rounded-full"}
                      >
                        Mon programme
                      </NavLink>
                    </>
                  )}
                </ul>
              </div>

              {/* nav right */}
              <div className="flex items-center gap-4">
                {token && user ? (
                  <>
                    {role !== "admin" ? (
                      <div className="flex gap-4 content-center items-center">
                        <Link
                          to={`${
                            role === "doctor"
                              ? "/doctors/profile/me"
                              : "/users/profile/me"
                          }`}
                        >
                          <figure className="w-[35px] h-[35px] rounded-full">
                            <img
                              src={user.img ?? NO_USER_IMAGE}
                              alt="Logo"
                              className="w-full h-full rounded-full"
                            />
                          </figure>
                          {/* <h2>{user?.name}</h2> */}
                        </Link>

                     
                      </div>
                    ) : (
                      <div className="flex gap-4 content-center items-center">
                        <button
                          onClick={handleLogout}
                          className="btn btn-sm rounded-full text-red-500 hover:bg-opacity-80"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login">
                    <button
                      className="bg-primaryColor py-2 px-6 text-white
                font-[600] h-[44px] flex items-center justify-center
                rounded-[50px]"
                    >
                      Log in
                    </button>
                  </Link>
                )}
                <span
                  className="md:hidden"
                  onClick={toggleMenu}
                >
                  <BiMenu className="w-6 h-6 cursor-pointer" />
                </span>
              </div>
            </div>
          </div>
        </header>
      )}
    </div>
  );
};

export default Header;
