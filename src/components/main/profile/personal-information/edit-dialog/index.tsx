"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PersonalInfo } from "../types";
import AvatarUploadSection from "./avatar-upload-section";
import PersonalDetailsFields from "./personal-details-fields";
import { personalInfoSchema, type PersonalInfoFormData } from "./schema";
import SocialLinksFields from "./social-links-fields";

interface EditPersonalInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: PersonalInfo;
  onSave: (data: PersonalInfo) => void;
}

export default function EditPersonalInfoDialog({
  isOpen,
  onOpenChange,
  initialData,
  onSave,
}: EditPersonalInfoDialogProps) {
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null);

  const previewAvatarUrl =
    avatarFileUrl || initialData.avatarUrl || "/images/user/user-01.jpg";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    values: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phone: initialData.phone,
      bio: initialData.bio,
      facebook: initialData.socialLinks.facebook,
      x: initialData.socialLinks.x,
      linkedin: initialData.socialLinks.linkedin,
      instagram: initialData.socialLinks.instagram,
      avatarUrl: initialData.avatarUrl,
    },
    mode: "onTouched",
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAvatarFileUrl(null);
    }
    onOpenChange(open);
  };

  const onSubmit = (formData: PersonalInfoFormData) => {
    const updatedFullName =
      `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    onSave({
      ...initialData,
      avatarUrl: previewAvatarUrl,
      fullName: updatedFullName || initialData.fullName,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      bio: formData.bio?.trim() ?? "",
      socialLinks: {
        facebook: formData.facebook?.trim() ?? "",
        x: formData.x?.trim() ?? "",
        linkedin: formData.linkedin?.trim() ?? "",
        instagram: formData.instagram?.trim() ?? "",
      },
    });
    handleOpenChange(false);
  };

  const initialLetter = initialData.firstName?.trim()
    ? initialData.firstName.trim()[0].toUpperCase()
    : "M";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-full overflow-hidden p-0 sm:max-w-2xl">
        <ScrollArea scrollbars="vertical" className="max-h-[90vh]">
          <div className="p-6 sm:p-8">
            <DialogHeader className="gap-1 sm:gap-2">
              <DialogTitle className="text-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">
                Edit Personal Information
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Update your details to keep your profile up-to-date.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-6"
              noValidate
            >
              <AvatarUploadSection
                previewAvatarUrl={previewAvatarUrl}
                fullName={initialData.fullName}
                fallbackLetter={initialLetter}
                onAvatarChange={setAvatarFileUrl}
              />

              <PersonalDetailsFields register={register} errors={errors} />

              <SocialLinksFields register={register} errors={errors} />

              {/* Footer Actions */}
              <div className="flex flex-col-reverse justify-end gap-3 pt-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
