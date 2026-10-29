export interface SocialLinks {
  facebook: string;
  x: string;
  linkedin: string;
  instagram: string;
}

export interface PersonalInfo {
  avatarUrl: string;
  fullName: string;
  role: string;
  location: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  socialLinks: SocialLinks;
}

export interface PersonalInfoCardProps {
  data?: PersonalInfo;
  className?: string;
}

export interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

export interface SocialLinksProps {
  socialLinks: SocialLinks;
  className?: string;
}
