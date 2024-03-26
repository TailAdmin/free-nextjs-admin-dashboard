"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  phoneNumber: Yup.string()
    .min(0, "Invalid number")
    .max(14, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(
        "https://flexstay-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );
      if (response.ok) {
        toast.success("Registration successful");
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="dark:bg-gray-950 flex min-h-screen items-center justify-center px-4">
      <div className="dark:bg-gray-900 w-full max-w-sm rounded-lg bg-white px-8 py-3 shadow-md">
        <h1 className="dark:text-gray-200 mb-4 text-center text-2xl font-bold">
          Create an account
        </h1>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label
                  htmlFor="firstName"
                  className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium"
                >
                  First Name
                </label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
				  disabled={isSubmitting}
                  className="w-full rounded-md border border-gray-[#f3f2f2] px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.firstName && touched.firstName ? (
                  <div className=" text-xs text-red">{errors.firstName}</div>
                ) : null}
              </div>
              {/* Repeat the same structure for other form fields */}
              <div className="mb-3">
                <label
                  htmlFor="lastName"
                  className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium"
                >
                  Last Name
                </label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
				           disabled={isSubmitting}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.lastName && touched.lastName ? (
                  <div className=" text-xs text-red">{errors.lastName}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="phoneNumber"
                  className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <Field
                  type="tel"
				          inputMode="numeric"
                  id="phoneNumber"
                  name="phoneNumber"
				          disabled={isSubmitting}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className=" text-xs text-red">{errors.phoneNumber}</div>
                ) : null}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
				  disabled={isSubmitting}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.email && touched.email ? (
                  <div className=" text-xs text-red">{errors.email}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
				  disabled={isSubmitting}
                  className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {errors.password && touched.password ? (
                  <div className=" text-xs text-red">{errors.password}</div>
                ) : null}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                {isSubmitting ? "Please wait..." : "Create Account"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex items-center justify-center gap-x-5">
          <Link
            href="/auth/login"
            className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
