import React, { useRef } from "react";
import { useRegisterAdmin } from "../useAuthAdmin";
import logo from "../../../../assets/images/logo_full.png";

export const AdminRegister = () => {
  const password = useRef();
  const name = useRef();

  const { mutate: register, isPending } = useRegisterAdmin();

  const handleClick = () => {
    register({ password: password.current.value, name: name.current.value });
  };

  return (
    <div className="flex min-h-full min-w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-fit bg-gray-50 mx-auto my-10 rounded-lg">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={logo}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Créez un compte administrateur
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div className="flex flex-col gap-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="name"
                ref={name}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                ref={password}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              disabled={isPending}
              type="button"
              onClick={handleClick}
              className="flex w-full justify-center rounded-md bg-primaryColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
