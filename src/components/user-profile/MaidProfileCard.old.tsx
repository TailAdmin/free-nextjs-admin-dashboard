"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useProfile } from "../../context/ProfileContext";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
type Gender = 'Female' | 'Male' | 'Other';
type Education = 'Under SEE' | 'SEE' | 'Plus 2' | 'Bachelor or More';
type Religion = 'Hindu' | 'Muslim' | 'Christian' | 'Buddhist' | 'Not to Say';
type Skill = 'Cooking' | 'Cleaning' | 'Babysitting' | 'Elder Care' | 'Postnatal' | 'Sick Care' | 'Pet Care' | 'Gardening';

interface FormData {
  // View mode fields
  fullName: string;
  professionalTitle: string;
  location: string;
  profileImage: string;
  
  // Edit mode fields
  firstName: string;
  lastName: string;
  age: number | '';
  gender: Gender | '';
  education: Education | '';
  religion: Religion | '';
  experience: string;
  skills: Skill[];
  workTime: string;
  email: string;
  phone: string;
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

export default function MaidProfileCard() {
  const { profileImage, setProfileImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "Sarah Johnson",
    professionalTitle: "Professional Housekeeper & Childcare Specialist",
    location: "Phoenix, Arizona, United States",
    profileImage: profileImage || "/images/placeholder-avatar.png",
    
    // Edit mode fields
    firstName: "Sarah",
    lastName: "Johnson",
    age: 32,
    gender: "Female",
    education: "Bachelor or More",
    religion: "Not to Say",
    experience: "5 years in housekeeping and childcare",
    skills: ["Cooking", "Cleaning", "Babysitting"],
    workTime: "9:00 AM - 5:00 PM",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    cityState: "Phoenix, Arizona",
    postalCode: "85001",
    taxId: "AS4568384"
  });

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const skill = name as Skill;
      
      setFormData(prev => ({
        ...prev,
        skills: checked 
          ? [...prev.skills, skill]
          : prev.skills.filter(s => s !== skill)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' && value !== '' ? parseInt(value) : value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        setFormData(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(e);
  };

  // Helper function to render input field with proper typing
  const renderInput = ({
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    min,
    max,
    label,
    className = ''
  }: {
    id: string;
    name: keyof FormData;
    type?: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    label: string;
    className?: string;
  }) => {
    const inputId = `${id}-${name}`; // Create unique ID by combining id and name
    return (
      <div className={className}>
        <Label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={inputId}
          name={name}
          type={type}
          defaultValue={value?.toString()}
          onChange={onChange}
          placeholder={placeholder}
          min={min?.toString()}
          max={max?.toString()}
          className={`w-full ${required ? 'border-red-500' : ''}`}
        />
      </div>
    );
  };

  const renderInputField = (label: string, name: keyof FormData, type: string = "text", placeholder: string = "") => {
    const value = formData[name] as string | number;
    
    return (
      <div className="mb-4">
        <Label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Label>
        <Input
          id={name}
          type={type}
          name={name as string}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
    );
  };

  const renderSelectField = (label: string, name: keyof FormData, options: {value: string, label: string}[]) => {
    const value = formData[name] as string;
    const selectId = `select-${name}`;
    
    return (
      <div className="mb-4">
        <Label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Label>
        <select
          id={selectId}
          name={name as string}
          value={value}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          aria-label={`Select ${label.toLowerCase()}`}
          title={label}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderCheckboxField = (label: string, name: string, value: string) => {
    const isChecked = formData.skills.includes(value as Skill);
    const checkboxId = `checkbox-${name}`;
    
    return (
      <div key={name} className="flex items-center">
        <input
          id={checkboxId}
          name={value}
          type="checkbox"
          checked={isChecked}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          aria-label={label}
          title={label}
        />
        <Label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label}
        </Label>
      </div>
    );
  };


  const renderEditMode = () => {
    const skillsList: Skill[] = ['Cooking', 'Cleaning', 'Babysitting', 'Elder Care', 'Postnatal', 'Sick Care', 'Pet Care', 'Gardening'];
    const genderOptions = [
      { value: 'Female', label: 'Female' },
      { value: 'Male', label: 'Male' },
      { value: 'Other', label: 'Other' }
    ];
    const educationOptions = [
      { value: 'Under SEE', label: 'Under SEE' },
      { value: 'SEE', label: 'SEE' },
      { value: 'Plus 2', label: 'Plus 2' },
      { value: 'Bachelor or More', label: 'Bachelor or More' }
    ];
    const religionOptions = [
      { value: 'Hindu', label: 'Hindu' },
      { value: 'Muslim', label: 'Muslim' },
      { value: 'Christian', label: 'Christian' },
      { value: 'Buddhist', label: 'Buddhist' },
      { value: 'Not to Say', label: 'Not to Say' }
    ];

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header (Read-only) */}
        <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-700">
            <Image
              src={formData.profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.fullName}</h2>
          <p className="text-gray-600 dark:text-gray-300">{formData.professionalTitle}</p>
          <p className="text-gray-500 dark:text-gray-400">{formData.location}</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.fullName}</h2>
        <p className="text-gray-600 dark:text-gray-300">{formData.professionalTitle}</p>
        <p className="text-gray-500 dark:text-gray-400">{formData.location}</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput({
            id: 'firstName',
            name: 'firstName',
            type: 'text',
            value: formData.firstName,
            onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
            placeholder: 'Enter first name',
            required: true,
            label: 'First Name *',
            className: 'md:col-span-1'
          })}
          {renderInput({
            id: 'lastName',
            name: 'lastName',
            type: 'text',
            value: formData.lastName,
            onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
            placeholder: 'Enter last name',
            required: true,
            label: 'Last Name *',
            className: 'md:col-span-1'
          })}
          {renderInput({
            id: 'age',
            name: 'age',
            type: 'number',
            value: formData.age,
            onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
            placeholder: 'Enter age',
            min: 18,
            max: 99,
            label: 'Age',
            className: 'md:col-span-1'
          })}
          <div className="md:col-span-1">
            <Label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              aria-label="Select gender"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            {renderInput({
              id: 'lastName',
              name: 'lastName',
              type: 'text',
              value: formData.lastName,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter last name',
              required: true,
              label: 'Last Name *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'age',
              name: 'age',
              type: 'number',
              value: formData.age,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter age',
              min: 18,
              max: 99,
              label: 'Age',
              className: 'md:col-span-1'
            })}
            <div className="md:col-span-1">
              <Label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                aria-label="Select gender"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education
              </Label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                aria-label="Select education level"
              >
                <option value="">Select education level</option>
                <option value="Under SEE">Under SEE</option>
                <option value="SEE">SEE</option>
                <option value="Plus 2">Plus 2</option>
                <option value="Bachelor or More">Bachelor or More</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="religion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Religion
              </Label>
              <select
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                aria-label="Select religion"
              >
                <option value="">Select religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Not to Say">Not to Say</option>
              </select>
            </div>
            {renderInput({
              id: 'experience',
              name: 'experience',
              type: 'text',
              value: formData.experience,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'e.g., 5 years in housekeeping and childcare',
              label: 'Experience',
              className: 'md:col-span-2'
            })}
            {renderInput({
              id: 'workTime',
              name: 'workTime',
              type: 'text',
              value: formData.workTime,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'e.g., 9:00 AM - 5:00 PM',
              label: 'Preferred Work Time',
              className: 'md:col-span-2'
            })}
          </div>

          {/* Skills Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skillsList.map((skill) => (
                <div key={skill} className="flex items-center">
                  <input
                    id={`skill-${skill.toLowerCase().replace(' ', '-')}`}
                    name={skill}
                    type="checkbox"
                    checked={formData.skills?.includes(skill) || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    aria-label={`Skill: ${skill}`}
                  />
                  <Label htmlFor={`skill-${skill.toLowerCase().replace(' ', '-')}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Address Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact & Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput({
              id: 'email',
              name: 'email',
              type: 'email',
              value: formData.email,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter email address',
              required: true,
              label: 'Email *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'phone',
              name: 'phone',
              type: 'tel',
              value: formData.phone,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter phone number',
              required: true,
              label: 'Phone *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'country',
              name: 'country',
              type: 'text',
              value: formData.country,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter country',
              required: true,
              label: 'Country *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'cityState',
              name: 'cityState',
              type: 'text',
              value: formData.cityState,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter city and state',
              required: true,
              label: 'City/State *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'postalCode',
              name: 'postalCode',
              type: 'text',
              value: formData.postalCode,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter postal code',
              required: true,
              label: 'Postal Code *',
              className: 'md:col-span-1'
            })}
            {renderInput({
              id: 'taxId',
              name: 'taxId',
              type: 'text',
              value: formData.taxId,
              onChange: handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
              placeholder: 'Enter tax ID',
              label: 'Tax ID (Optional)',
              className: 'md:col-span-1'
            })}
          </div>
        </div>

        {/* Profile Visibility Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Visibility</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isProfileHidden ? 'Your profile is currently hidden' : 'Your profile is currently visible'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isProfileHidden ? 'Employers cannot find your profile in search results' : 'Employers can find your profile in search results'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileHidden(!isProfileHidden)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                isProfileHidden ? 'bg-gray-200' : 'bg-primary-600'
              }`}
              role="switch"
              aria-checked={!isProfileHidden}
              aria-label={isProfileHidden ? 'Show profile' : 'Hide profile'}
            >
              <span className="sr-only">Toggle profile visibility</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isProfileHidden ? 'translate-x-0' : 'translate-x-5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={toggleEdit}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

  const renderViewMode = () => {
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-700">
            <Image
              src={formData.profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.fullName}</h2>
          <p className="text-gray-600 dark:text-gray-300">{formData.professionalTitle}</p>
          <p className="text-gray-500 dark:text-gray-400">{formData.location}</p>
        </div>

        {/* Profile Visibility Toggle */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Visibility</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isProfileHidden ? 'Your profile is currently hidden from employers' : 'Your profile is visible to employers'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileHidden(!isProfileHidden)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isProfileHidden ? 'bg-gray-200' : 'bg-primary-600'}`}
            role="switch"
            aria-checked={!isProfileHidden}
            aria-label={`Profile is ${isProfileHidden ? 'hidden' : 'visible'}`}
          >
            <span className="sr-only">Toggle profile visibility</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isProfileHidden ? 'translate-x-0' : 'translate-x-5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={toggleEdit}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  </div>
);

const renderViewMode = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      // Update the full name in view mode when saving
      setFormData(prev => ({
        ...prev,
        fullName: `${prev.firstName} ${prev.lastName}`.trim()
      }));
    }, 1000);
  };

  // Render the component
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
}
