import type { FieldErrors, UseFormRegister } from "react-hook-form";

export interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  facebook: string;
  x: string;
  linkedin: string;
  instagram: string;
  avatarUrl: string;
}

export interface PersonalDetailsFieldsProps {
  register: UseFormRegister<PersonalInfoFormData>;
  errors: FieldErrors<PersonalInfoFormData>;
}

export interface SocialLinksFieldsProps {
  register: UseFormRegister<PersonalInfoFormData>;
  errors: FieldErrors<PersonalInfoFormData>;
}


