import { useRef, useState } from "react";
import logo from "../../../../assets/images/logo_full.png";
import { useAuthAdmin } from "../useAuthAdmin";
import { Input } from "rsuite";

export const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { mutate, isPending } = useAuthAdmin();

  const handleClick = () => {
    mutate({ password, name });
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
          Connectez-vous en tant qu'administrateur
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
              <Input
                type="text"
                id="name"
                onChange={(value) => setName(value)}
                value={name}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mot de passe
              </label>
              <Input
                type="password"
                id="password"
                onChange={(value) => setPassword(value)}
                value={password}
                required
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
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
