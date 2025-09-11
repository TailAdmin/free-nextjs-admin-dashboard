"use client";
import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { useProfile } from "../../context/ProfileContext";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profileImage, setProfileImage, userName, setUserName } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Handle image file selection (used by both card and modal)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isModal = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setProfileImage(imageUrl);

      // Update form data with the new image
      if (formData) {
        setFormData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  interface FormData {
    fullName: string;
    bio: string;
    location: string;
    profileImage: string;
  }

  const [formData, setFormData] = useState<FormData>(() => ({
    fullName: userName,
    bio: "Professional Housemaid",
    location: "Arizona, United States",
    profileImage: profileImage || ""
  }));
  
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        // Update the profile image in the form data
        setFormData(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Removed unused handleCheckboxChange function

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Update the profile image in context
      if (formData.profileImage) {
        setProfileImage(formData.profileImage);
      }
      
      // Update the user name in context
      setUserName(formData.fullName);
      
      // In a real app, you would save to Supabase here
      console.log('Saving profile data:', {
        ...formData,
        isProfileHidden
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close the modal on success
      closeModal();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSaving(false);
    }
    closeModal();
  };

  if (!profileImage) return null;
  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col items-center w-full gap-4 xl:flex-row">
            <div className="relative w-11 h-11 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700 group hover:border-primary transition-colors">
              <div className="relative w-full h-full">
                <Image
                  width={44}
                  height={44}
                  src={formData.profileImage || profileImage || '/images/avatar/avatar-1.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <label 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:opacity-100 opacity-0 transition-opacity cursor-pointer"
                title="Change profile photo"
                htmlFor="profile-photo-upload"
              >
                <span className="text-white text-xs text-center p-1">Change Photo</span>
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                aria-label="Upload profile photo"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {formData.fullName}
              </h4>
              <div className="flex flex-col w-full gap-1 text-center xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.bio || 'Professional Housemaid'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.location || 'Location not set'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 xl:justify-start">
                <button
                  type="button"
                  onClick={() => setIsProfileHidden(!isProfileHidden)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${isProfileHidden ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                  role="switch"
                  aria-checked={isProfileHidden}
                >
                  <span className="sr-only">Toggle profile visibility</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isProfileHidden ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </button>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Hide my profile from search results
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isProfileHidden ? 'Profile is hidden' : 'Profile is visible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-4 xl:mt-0 xl:w-auto">
            <button
              onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary shadow-theme-xs transition-all hover:bg-primary/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-primary dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30 xl:w-auto"
              aria-label="Edit profile"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
          <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Maid Profile
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update your profile information to help clients find you.
              </p>
            </div>
            <form onSubmit={handleSave} className="flex flex-col">
              <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-2 pb-3">
                {/* Profile Photo Upload */}
                <div className="mb-8 text-center">
                  <div className="relative inline-block group">
                    <div className="w-32 h-32 overflow-hidden border-2 border-dashed border-gray-300 rounded-full dark:border-gray-700">
                      <Image
                        width={128}
                        height={128}
                        src={profileImage}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <label 
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 p-2 text-white bg-primary rounded-full hover:bg-primary-dark cursor-pointer"
                      title="Change profile photo"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Change profile photo</span>
                      <input
                        id="profile-upload"
                        type="file"
                        ref={modalFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        aria-label="Upload profile photo"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Click on the camera icon to change photo</p>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Personal Information
                  </h5>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <Label>Full Name</Label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label>Role / Title</Label>
                      <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="e.g. Professional Housemaid"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={closeModal}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="px-6"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
