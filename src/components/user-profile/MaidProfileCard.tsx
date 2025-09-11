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
  // Personal Information
  firstName: string;
  lastName: string;
  age: number | '';
  gender: Gender | '';
  education: Education | '';
  religion: Religion | '';
  experience: string;
  skills: Skill[];
  workTime: string;
  
  // Contact Information
  email: string;
  phone: string;
  country: string;
  cityState: string;
  
  // View mode only
  fullName?: string;
  professionalTitle?: string;
  location?: string;
  profileImage?: string;
  
  // Removed fields
  // postalCode: string;
  // taxId: string;
}

export default function MaidProfileCard() {
  const { profileImage, setProfileImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    firstName: "Sarah",
    lastName: "Johnson",
    age: 32,
    gender: "Female",
    education: "Bachelor or More",
    religion: "Not to Say",
    experience: "5 years in housekeeping and childcare",
    skills: ["Cooking", "Cleaning", "Babysitting"],
    workTime: "9:00 AM - 5:00 PM",
    
    // Contact Information
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    cityState: "Phoenix, Arizona",
    
    // View mode fields (computed)
    fullName: "Sarah Johnson",
    professionalTitle: "Professional Housekeeper & Childcare Specialist",
    location: "Phoenix, United States",
    profileImage: profileImage || "/images/placeholder-avatar.png"
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      // Update view mode fields
      setFormData(prev => ({
        ...prev,
        fullName: `${prev.firstName} ${prev.lastName}`.trim(),
        location: `${prev.cityState}, ${prev.country}`
      }));
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
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

  const renderViewMode = () => {
    return (
      <div className="space-y-6">
        {/* Profile Header - Removed duplicate title */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-700">
            <Image
              src={formData.profileImage || "/images/placeholder-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.fullName || `${formData.firstName} ${formData.lastName}`}</h2>
          <p className="text-gray-600 dark:text-gray-300">{formData.professionalTitle || 'Professional Housekeeper'}</p>
          <p className="text-gray-500 dark:text-gray-400">{formData.location || `${formData.cityState}, ${formData.country}`}</p>
        </div>

        {/* Profile Visibility */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile {isProfileHidden ? 'Hidden' : 'Visible'}
          </span>
          <button
            type="button"
            onClick={() => setIsProfileHidden(!isProfileHidden)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isProfileHidden ? 'bg-gray-200' : 'bg-primary-600'}`}
            role="switch"
            aria-checked={!isProfileHidden}
            aria-label={`Profile visibility is ${isProfileHidden ? 'hidden' : 'visible'}`}
          >
            <span className="sr-only">Toggle profile visibility</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isProfileHidden ? 'translate-x-0' : 'translate-x-5'}`}
            />
          </button>
        </div>
      </div>
    );
  };

  const renderEditMode = () => {
    return (
      <div className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField("First Name *", "firstName", "text", "Enter first name")}
              {renderInputField("Last Name *", "lastName", "text", "Enter last name")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderInputField("Age", "age", "number", "Enter age")}
              {renderSelectField("Gender", "gender", [
                { value: "", label: "Select gender" },
                { value: "Female", label: "Female" },
                { value: "Male", label: "Male" },
                { value: "Other", label: "Other" }
              ])}
              {renderSelectField("Education", "education", [
                { value: "", label: "Select education" },
                { value: "Under SEE", label: "Under SEE" },
                { value: "SEE", label: "SEE" },
                { value: "Plus 2", label: "Plus 2" },
                { value: "Bachelor or More", label: "Bachelor or More" }
              ])}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {renderSelectField("Religion", "religion", [
                { value: "", label: "Select religion" },
                { value: "Hindu", label: "Hindu" },
                { value: "Muslim", label: "Muslim" },
                { value: "Christian", label: "Christian" },
                { value: "Buddhist", label: "Buddhist" },
                { value: "Not to Say", label: "Not to Say" }
              ])}
              {renderInputField("Experience", "experience", "text", "e.g., 4 years in housekeeping")}
              {renderInputField("Preferred Work Time", "workTime", "text", "e.g., 9:00 AM - 5:00 PM")}
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skills
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Cooking", "Cleaning", "Babysitting", "Elder Care", "Postnatal", "Sick Care", "Pet Care", "Gardening"].map(skill => (
                  <div key={skill} className="flex items-center">
                    {renderCheckboxField(skill, `skill-${skill.toLowerCase().replace(' ', '-')}`, skill)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact & Address Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact & Address</h3>
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField("Email *", "email", "email", "Enter email")}
              {renderInputField("Phone *", "phone", "tel", "Enter phone number")}
              {renderInputField("Country *", "country", "text", "Enter country")}
              {renderInputField("City/State *", "cityState", "text", "Enter city/state")}
            </div>
          </div>
        </div>
        
        {/* Profile Visibility Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Profile Status</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isProfileHidden 
                    ? 'Your profile is hidden and not visible to employers.' 
                    : 'Your profile is visible to potential employers.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileHidden(!isProfileHidden)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isProfileHidden ? 'bg-gray-200' : 'bg-primary-600'}`}
                role="switch"
                aria-checked={!isProfileHidden}
              >
                <span className="sr-only">Toggle profile visibility</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isProfileHidden ? 'translate-x-0' : 'translate-x-5'}`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maid Profile</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isEditing 
                  ? 'Update your profile information' 
                  : 'View and manage your profile'}
              </p>
            </div>
            
            {!isEditing && (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-2"
                aria-label="Edit profile"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6">
              {renderEditMode()}
            </form>
          ) : (
            <div className="p-6">
              {renderViewMode()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
