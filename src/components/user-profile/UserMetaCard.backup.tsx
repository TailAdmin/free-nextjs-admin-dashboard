"use client";
import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import Select from "../form/Select";
import Checkbox from "../form/input/Checkbox";

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;


const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
];

const EDUCATION_OPTIONS = [
  { label: "Under SEE Pass", value: "under_see" },
  { label: "SEE Pass", value: "see_pass" },
  { label: "Plus 2 Pass", value: "plus_2" },
  { label: "Bachelor Pass or More", value: "bachelor_plus" },
];

const RELIGION_OPTIONS = [
  { label: "Hindu", value: "hindu" },
  { label: "Muslim", value: "muslim" },
  { label: "Christian", value: "christian" },
  { label: "Buddhist", value: "buddhist" },
  { label: "Not to Say", value: "not_to_say" },
];

const SKILLS_OPTIONS = [
  { label: "Cooking", value: "cooking" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Babysitting", value: "babysitting" },
  { label: "Elder Care", value: "elder_care" },
  { label: "Postnatal Services", value: "postnatal" },
  { label: "Sick Care", value: "sick_care" },
  { label: "Pet Care", value: "pet_care" },
  { label: "Gardening", value: "gardening" },
];

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [profileImage, setProfileImage] = useState("/images/user/owner.jpg");
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  interface SocialLinks {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  }

  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    country: string;
    cityState: string;
    postalCode: string;
    taxId: string;
    isProfileHidden: boolean;
    socialLinks: SocialLinks;
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: "LK",
    lastName: "Pandey",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
    country: "United States",
    cityState: "Phoenix, Arizona, United States",
    postalCode: "ERT 2489",
    taxId: "AS4568384",
    isProfileHidden: false,
    socialLinks: {
      facebook: 'https://www.facebook.com/PimjoHQ',
      twitter: 'https://x.com/PimjoHQ',
      linkedin: 'https://www.linkedin.com/company/pimjo',
      instagram: 'https://instagram.com/PimjoHQ'
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Save the preview image if a new one was selected
    if (previewImage) {
      setProfileImage(previewImage);
      setPreviewImage("");
    }
    // Here you would typically send the data to your backend
    console.log("Saving changes...", formData);
    closeModal();
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
              <div className="relative w-24 h-24 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 group">
                <Image
                  width={96}
                  height={96}
                  src={previewImage || profileImage}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                <label 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  htmlFor="profile-upload"
                  title="Change profile photo"
                >
                  <span className="text-white text-xs text-center p-1">Change Photo</span>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {formData.bio}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {formData.cityState}
                </p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.793.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-6 p-6 bg-gray-50 rounded-xl dark:bg-gray-800/50 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
                  <p className="text-gray-800 dark:text-white">{formData.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
                  <p className="text-gray-800 dark:text-white">{formData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</p>
                  <p className="text-gray-800 dark:text-white">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-800 dark:text-white">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-gray-800 dark:text-white">{formData.bio}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Address</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                  <p className="text-gray-800 dark:text-white">{formData.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City/State</p>
                  <p className="text-gray-800 dark:text-white">{formData.cityState}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</p>
                  <p className="text-gray-800 dark:text-white">{formData.postalCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">TAX ID</p>
                  <p className="text-gray-800 dark:text-white">{formData.taxId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl">
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
            Edit Personal Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    defaultValue={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    defaultValue={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  defaultValue={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  defaultValue={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <Label>Bio</Label>
                <textarea
                  name="bio"
                  defaultValue={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Address Information</h3>
              
              <div>
                <Label>Country</Label>
                <Input
                  name="country"
                  defaultValue={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>

              <div>
                <Label>City/State</Label>
                <Input
                  name="cityState"
                  defaultValue={formData.cityState}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </div>

              <div>
                <Label>Postal Code</Label>
                <Input
                  name="postalCode"
                  defaultValue={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                />
              </div>

              <div>
                <Label>TAX ID</Label>
                <Input
                  name="taxId"
                  defaultValue={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="TAX ID"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">Social Media Links</h3>
            <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <div>
                <Label>Facebook</Label>
                <Input 
                  type="url" 
                  name="facebook"
                  defaultValue={formData.socialLinks.facebook}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        facebook: value
                      }
                    }));
                  }}
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <Label>X (Twitter)</Label>
                <Input 
                  type="url" 
                  name="twitter"
                  defaultValue={formData.socialLinks.twitter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        twitter: value
                      }
                    }));
                  }}
                  placeholder="https://x.com/username"
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input 
                  type="url" 
                  name="linkedin"
                  defaultValue={formData.socialLinks.linkedin}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        linkedin: value
                      }
                    }));
                  }}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input 
                  type="url" 
                  name="instagram"
                  defaultValue={formData.socialLinks.instagram}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        instagram: value
                      }
                    }));
                  }}
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
                                facebook: value
                              }
                            }));
                          }}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div>
                        <Label>X (Twitter)</Label>
                        <Input 
                          type="url" 
                          name="twitter"
                          defaultValue={formData.socialLinks.twitter}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                twitter: value
                              }
                            }));
                          }}
                          placeholder="https://x.com/username"
                        />
                      </div>
                      <div>
                        <Label>LinkedIn</Label>
                        <Input 
                          type="url" 
                          name="linkedin"
                          defaultValue={formData.socialLinks.linkedin}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                linkedin: value
                              }
                            }));
                          }}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label>Instagram</Label>
                        <Input 
                          type="url" 
                          name="instagram"
                          defaultValue={formData.socialLinks.instagram}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              socialLinks: {
                                ...prev.socialLinks,
                                instagram: value
                              }
                            }));
                          }}
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label>Bio / About Me</Label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Tell us about yourself and your experienceience..."
                    />
                  </div>

                  <div className="col-span-2 pt-2">
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          id="hide-profile"
                          name="isProfileHidden"
                          type="checkbox"
                          checked={formData.isProfileHidden}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isProfileHidden: e.target.checked
                          }))}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <label htmlFor="hide-profile" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Hide my profile from search results
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.isProfileHidden 
                        ? "Your profile is currently hidden and won't appear in search results." 
                        : "Your profile is visible to potential clients."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-2 mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I confirm that all information provided is accurate
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={closeModal}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="px-6"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
