import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@components/form/Label";
import Input from "@components/form/input/InputField";
import Button from "@components/ui/button/Button";
import { coloredToast } from "@/hooks/useToast";

interface IFormInput {
  password: string;
}

const defaultValues: IFormInput = {
  password: "",
};

export default function Reset() {
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ defaultValues });

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      setShowLoader(true);
      const res = await fetch(`/api/auth/reset/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        coloredToast("success", "Password has been reset successfully.");
        navigate("/auth/signin", { replace: true });
      } else {
        const message = data?.message || "Failed to reset password.";
        coloredToast("error", message);
      }
    } catch (err: any) {
      const msg = err?.message ?? "An unexpected error occurred.";
      coloredToast("error", msg);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Reset Password | TailAdmin - React.js Dashboard Template"
        description="Reset your password in TailAdmin React.js Dashboard Template"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto">
            <Link
              to="/auth/signin"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5" />
              Back to login
            </Link>
          </div>

          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your new password below to reset your account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      New Password <span className="text-red-700">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter new password"
                        error={!!errors.password}
                        hint={
                          errors.password
                            ? "Please enter a valid new password"
                            : ""
                        }
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

                  <div>
                    <Button className="w-full" size="sm">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-5 text-center">
                <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                  Back to{" "}
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

          {showLoader && (
            <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
              <svg
                width="64"
                height="64"
                viewBox="0 0 135 135"
                xmlns="http://www.w3.org/2000/svg"
                fill="#4361ee"
              >
                <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 67 67"
                    to="-360 67 67"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          )}
        </div>
      </AuthLayout>
    </>
  );
}
