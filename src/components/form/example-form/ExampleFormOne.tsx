"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Form from "../Form";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextArea from "../input/TextArea";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon } from "../../../icons";

export default function ExampleFormOne() {
  const [message, setMessage] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:");
  };
  const options = [
    { value: "marketing", label: "Option 1" },
    { value: "template", label: "Option 2" },
    { value: "development", label: "Option 3" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const handleTextareaChange = (value: string) => {
    setMessage(value);
    console.log("Message:", value);
  };
  return (
    <ComponentCard title="Example Form">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input type="text" placeholder="Enter first name" id="firstName" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input type="text" placeholder="Enter last name" id="firstName" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="text"
              placeholder="Enter email address"
              id="firstName"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              defaultValue=""
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="email">Messages</Label>
            <TextArea
              placeholder="Type your message here..."
              rows={6}
              value={message}
              onChange={handleTextareaChange}
              className=" bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div className="col-span-2">
            <Button size="sm" className="w-full">
              Send Message
              <PaperPlaneIcon />
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
