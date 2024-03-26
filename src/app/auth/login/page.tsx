"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(5, "Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const SignIn: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(
        "https://flexstay-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );
      if (response.ok) {
        const { token, _id } = await response.json();
        // Store token and userId in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", _id);

        toast.success("Logged in successful");
        router.push('/profile');
      } else {
        const data = await response.json();
        toast.error(data.message || " Something went wrong");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  

  return (
    <div className="dark:bg-gray-950 flex min-h-screen items-center justify-center px-4">
      <div className="dark:bg-gray-900 w-full max-w-sm rounded-lg bg-white px-8 py-3 shadow-md">
        <h1 className="dark:text-gray-200 mb-4 text-center text-2xl font-bold">
               Login to your Account
        </h1>
        <Formik
          initialValues={{
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
                {isSubmitting ? "Please wait..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex items-center justify-center gap-x-5">
          <Link
            href="/auth/register"
            className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Don&apos;t have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
