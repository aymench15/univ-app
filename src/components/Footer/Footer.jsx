import React from "react";
import logo from "../../assets/images/logo_full.png";

import { Link } from "react-router-dom";
import { useAuth } from "../../newApp/modules/auth/useAuth";







const quickLinks03 = [
  {
    path: "/contact",
    display: "Contact us",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const user = useAuth((state) => state.user);

  return (
    <footer>
      <div className="container px-10">
        <div
          className="flex flex-col items-center"
        >
          <div className="flex flex-col items-center">
            <img
              className="h-[64px]"
              src={logo}
              alt=""
            />
            <p
              className="text-base leading-7 font-normal
            text-textColor mt-4"
            >
              Copyright © {year} All Rights Reserved
            </p>
          </div>
          
          {/* <div>
            <h2
              className="text-xl leading-[30px] font-normal
              mb-6 text-headingColor"
            >
              Support
            </h2>

            <ul>
              {quickLinks03
                .filter((l) => !l.roles || l.roles.includes(user?.role))
                .map((item, index) => (
                  <li
                    key={index}
                    className="mb-4"
                  >
                    <Link
                      to={item.path}
                      className="text-base leading-7 font-normal
                      text-textColor"
                    >
                      {item.display}
                    </Link>
                  </li>
                ))}
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
