import { type NextPage } from "next";
import Head from "next/head";
import { useState, useReducer, useCallback, memo, useMemo } from "react";
import type {
  FC,
  InputHTMLAttributes,
  SVGProps,
  ChangeEvent,
  FormEvent,
} from "react";
import { clsx } from "clsx";

import { api } from "../../utils/api";

const Home: NextPage = () => {
  // const res = api.test.helloProcedure.useQuery({ text: "from tRPC" });

  const [formData, formDispatcher] = useReducer(formReducer, initialFormData);
  const inputAction = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      formDispatcher({ key: e.target.name, value: e.target.value }),
    []
  );

  const [confirmedPassword, setConfirmedPassword] = useState("");
  const onConfirmedPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setConfirmedPassword(e.target.value),
    []
  );

  const [isError, setIsError] = useState(false);

  const passwordIsConfirmed = useMemo(() => {
    const bothFieldsAreEqual = confirmedPassword === formData.password;
    const bothFieldsNotEmpty =
      confirmedPassword.length !== 0 && formData.password.length !== 0;

    return bothFieldsNotEmpty && bothFieldsAreEqual;
  }, [confirmedPassword, formData.password]);

  /* const { mutateAsync: submitForm } = api.auth.register.useMutation({
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  }); */

  const submit = /* async */ (e: FormEvent) => {
    e.preventDefault();

    /* await submitForm({ email: formData.email, password: formData.password }); */
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Registration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-neutral flex min-h-screen flex-col items-center justify-center">
        <form
          onSubmit={(e) => void submit(e)}
          className="rounded-box border-base-content/5 bg-base-100 container m-auto flex max-w-xs flex-col items-center justify-center gap-5 border p-5 py-7 shadow"
        >
          {String(passwordIsConfirmed)}
          <label htmlFor="email" className="w-full">
            <span
              className={clsx(
                "mb-1 block px-2.5 text-xs font-semibold",
                isError ? "text-red-400" : "text-slate-900"
              )}
              onClick={() => {
                setIsError(() => !isError);
              }}
            >
              Email
            </span>
            <span className="relative">
              <input
                onChange={inputAction}
                value={formData.email}
                name="email"
                id="email"
                type="email"
                className={clsx(
                  "block w-full rounded-lg border  px-2.5 py-1.5 outline-none transition-colors",
                  isError
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300 bg-slate-100"
                )}
              />
            </span>
          </label>
          <MemoPasswordField
            isError={isError}
            labelText="Password"
            onChange={inputAction}
            name="password"
            value={formData.password}
          />
          <MemoPasswordField
            isError={isError}
            labelText="Confirm password"
            onChange={onConfirmedPasswordChange}
            name="confirm-password"
            value={confirmedPassword}
          />
          <button
            type="submit"
            className=" btn-secondary btn-block btn mt-4 h-10 min-h-fit "
          >
            Register
          </button>
        </form>
      </main>
    </>
  );
};

const initialFormData = { email: "", password: "" };
type FormState = typeof initialFormData;
type Payload = { key: string; value: string };
const formReducer = (state: FormState, payload: Payload) => ({
  ...state,
  [payload.key]: payload.value,
});

type PasswordFieldProps = {
  labelText: string;
  isError: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const PasswordField: FC<PasswordFieldProps> = (props) => {
  const { labelText, isError, ...other } = props;

  const [isPassVisisble, setIsPassVisibility] = useState(false);
  const togglePassVisibility = useCallback(
    () => setIsPassVisibility((prevState) => !prevState),
    []
  );

  return (
    <label className="w-full">
      <span
        className={clsx(
          "mb-1 block px-2.5 text-xs font-semibold",
          isError ? "text-red-400" : "text-slate-900"
        )}
      >
        {labelText}
      </span>
      <span className="relative">
        <input
          {...other}
          type={isPassVisisble ? "text" : "password"}
          className={clsx(
            "block w-full rounded-lg border  px-2.5 py-1.5 outline-none transition-colors",
            isError
              ? "border-red-300 bg-red-50"
              : "border-slate-300 bg-slate-100"
          )}
        />
        <MemoDynamicIcon
          isVisible={isPassVisisble}
          onClick={togglePassVisibility}
          className={clsx(
            "absolute top-2/4 right-3 h-5 -translate-y-2/4 cursor-pointer transition-colors",
            isError ? "text-red-400" : "text-slate-900"
          )}
        />
      </span>
    </label>
  );
};
const MemoPasswordField = memo(PasswordField);

type DynamicIconProps = { isVisible: boolean } & SVGProps<SVGSVGElement>;

const DynamicIcon: FC<DynamicIconProps> = ({ isVisible, ...rest }) => (
  // isVisible ? <EyeSlashIcon {...rest} /> : <EyeIcon {...rest} />
  <div>asd</div>
);
const MemoDynamicIcon = memo(DynamicIcon);

export default Home;
