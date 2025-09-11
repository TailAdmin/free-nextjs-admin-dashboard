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
  
}

export default function MaidProfileCard() {
  const { profileImage, setProfileImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const { setUserName } = useProfile();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Update the user's full name in the context
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    setUserName(fullName);
    
    // Simulate API call
    setTimeout(() => {
      // Update view mode fields
      setFormData(prev => ({
        ...prev,
        fullName,
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
    const fieldId = `input-${name}-${Date.now()}`;
    const isRequired = label.endsWith('*');
    const displayLabel = isRequired ? label.slice(0, -1) : label;
    
    return (
      <div className="mb-4">
        <label 
          htmlFor={fieldId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {displayLabel} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          id={fieldId}
          type={type}
          name={name as string}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || `Enter ${displayLabel.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required={isRequired}
          aria-label={displayLabel}
        />
      </div>
    );
  };

  const renderSelectField = (label: string, name: keyof FormData, options: {value: string, label: string}[]) => {
    const value = formData[name] as string;
    const selectId = `select-${name}-${Date.now()}`;
    const isRequired = label.endsWith('*');
    const displayLabel = isRequired ? label.slice(0, -1) : label;
    
    return (
      <div className="mb-4">
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          id={`${selectId}-label`}
        >
          {displayLabel} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <select
          id={selectId}
          name={name as string}
          value={value}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required={isRequired}
          aria-labelledby={`${selectId}-label`}
          title={`Select ${displayLabel.toLowerCase()}`}
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
        {/* Profile Header */}
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData.fullName || `${formData.firstName} ${formData.lastName}`}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {formData.professionalTitle || 'Professional Housekeeper'}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            {formData.location || `${formData.cityState}, ${formData.country}`}
          </p>
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
        
        {/* Action buttons have been moved to the main form to prevent duplication */}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update your profile information</h2>
              </div>
              
              {/* Profile Header in Edit Mode */}
              <div className="mb-8">
                <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-700">
                  <Image
                    src={formData.profileImage || "/images/placeholder-avatar.png"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                  {`${formData.firstName} ${formData.lastName}`.trim() || 'Your Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {formData.experience || 'Update your professional title'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {formData.cityState ? `${formData.cityState}, ${formData.country}` : 'Your location'}
                </p>
              </div>
              
              {renderEditMode()}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maid Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your profile</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 shadow-sm"
                  aria-label="Edit profile"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
              {renderViewMode()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
