"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Form from "../Form";
import Input from "../input/InputField";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
} from "../../../icons";
import Checkbox from "../input/Checkbox";
import Label from "../Label";
import Button from "../../ui/button/Button";

export default function ExampleFormWithIcon() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:");
  };

  const [isChecked, setIsChecked] = useState(false);
  return (
    <ComponentCard title="Example Form With Icons">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              id="username"
              className="pl-11"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
              <UserIcon />
            </span>
          </div>{" "}
          <div className="relative">
            <Input
              type="text"
              placeholder="Email Address"
              id="email"
              className="pl-11"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
              <EnvelopeIcon />
            </span>
          </div>{" "}
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              id="password"
              className="pl-11"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
              <LockIcon />
            </span>
          </div>{" "}
          <div className="relative">
            <Input
              type="password"
              placeholder="Confirm Password"
              id="confirm-password"
              className="pl-11"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none left-4 top-1/2 dark:text-gray-400">
              <LockIcon />
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <Label className="mb-0"> Remember me</Label>
            </div>
            <div>
              <Button size="sm">
                Create Account <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
