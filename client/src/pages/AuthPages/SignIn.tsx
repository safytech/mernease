import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "@components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

import { EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "@/store/user/userSlice";

import { useForm, SubmitHandler } from "react-hook-form";
import { coloredToast } from "@/hooks/useToast";
import type { IRootState } from "@/store";

import { useApi } from "@/api";
import { useLoading } from "@/context/LoadingContext";

const APP_NAME = import.meta.env.VITE_APP_NAME;

interface IFormInput {
  email: string;
  password: string;
}

const defaultValues: IFormInput = {
  email: "mernease@gmail.com",
  password: "12345",
};

export default function SignIn() {
  return (
    <>
      <PageMeta
        title={`Sign In | ${APP_NAME} Admin Dashboard`}
        description={`Sign in to the ${APP_NAME} to use the authentication, CRUD, API structure, and a full admin dashboard`}
      />
      <AuthLayout>
        <InnerSignInForm />
      </AuthLayout>
    </>
  );
}

function InnerSignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const api = useApi();
  const { startRequest, endRequest } = useLoading();
  const user = useSelector((state: IRootState) => state.user?.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ defaultValues });

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    dispatch(signInStart());
    startRequest();
    setIsLoading(true);

    try {
      const res = await api.post(`/auth/signin`, formData);

      if (res.status === 200 && res.data) {
        dispatch(signInSuccess(res.data));

        setTimeout(() => {
          setIsLoading(false);
          endRequest();
          navigate("/dashboard", { replace: true });
        }, 400);
        return;
      }

      const message = res.data?.message || "Sign in failed";
      coloredToast("error", message);
      dispatch(signInFailure(message));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred.";
      coloredToast("error", msg);
      dispatch(signInFailure(msg));
    } finally {
      setIsLoading(false);
      endRequest();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-red-700">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  error={!!errors.email}
                  hint={errors.email ? "Please enter a valid email address" : ""}
                  placeholder="Enter your Email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Password"
                    error={!!errors.password}
                    hint={errors.password ? "Please enter a valid password" : ""}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div></div>
                <Link
                  to="/auth/recover"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button
                  className="w-full flex justify-center items-center"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account? {""}
              <Link
                to="/auth/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
