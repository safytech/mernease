import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import PageMeta from "@components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

import { EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Checkbox from "@components/form/input/Checkbox";
import Button from "@components/ui/button/Button";

import { coloredToast } from "@/hooks/useToast";
import { useApi } from "@/api";
import { useLoading } from "@/context/LoadingContext";

interface ISignUpForm {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

const defaultValues: ISignUpForm = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
};

export default function SignUp() {
  return (
    <>
      <PageMeta title="Sign Up" description="Create your account" />
      <AuthLayout>
        <InnerSignUpForm />
      </AuthLayout>
    </>
  );
}

function InnerSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = useApi();
  const navigate = useNavigate();
  const { startRequest, endRequest } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({ defaultValues });

  const onSubmit: SubmitHandler<ISignUpForm> = async (formData) => {
    if (!isChecked) {
      coloredToast("error", "Please accept Terms & Privacy Policy.");
      return;
    }

    try {
      startRequest();
      setLoading(true);
      
      const res = await api.post("/auth/signup", formData);

      if (res.status === 200) {
        coloredToast("success", "Account created successfully!");
        setTimeout(() => navigate("/auth/signin"), 400);
        return;
      }

      coloredToast("error", res.data?.message || "Signup failed");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong.";
      coloredToast("error", msg);
    } finally {
      setLoading(false);
      endRequest();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">

              {/* Full Name */}
              <div>
                <Label>
                  Full Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  error={!!errors.fullname}
                  hint={errors.fullname ? "Please enter your full name" : ""}
                  {...register("fullname", {
                    required: "Full name is required",
                  })}
                />
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  error={!!errors.email}
                  hint={errors.email ? "Please enter a valid email address" : ""}
                  {...register("email", { required: "Email is required" })}
                />
              </div>

              {/* Phone */}
              <div>
                <Label>
                  Phone <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  error={!!errors.phone}
                  hint={errors.phone ? "Please enter a valid phone number" : ""}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    error={!!errors.password}
                    hint={errors.password ? "Please enter a valid password" : ""}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 cursor-pointer right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-gray-500 dark:text-gray-400">
                  I agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  className="w-full flex justify-center items-center"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>

            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/auth/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
