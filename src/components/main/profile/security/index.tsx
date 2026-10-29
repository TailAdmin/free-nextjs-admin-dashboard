"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PencilIcon } from "@/icons";
import { cn } from "@/utils";
import { useState } from "react";
import ChangePasswordModal from "./change-password-modal";
import { defaultSecuritySettings } from "./data";
import SecurityItem from "./security-item";
import type { ChangePasswordFormData, SecurityProps } from "./types";

export default function SecuritySection({
  initialSettings = defaultSecuritySettings,
  className,
  onPasswordChange,
  onTwoFactorChange,
}: SecurityProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialSettings.twoFactorEnabled,
  );

  const handleTwoFactorChange = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    onTwoFactorChange?.(checked);
  };

  const handlePasswordSubmit = (data: ChangePasswordFormData) => {
    onPasswordChange?.(data);
  };

  return (
    <>
      <Card
        className={cn(
          "rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-700 dark:bg-white/3",
          className,
        )}
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Security
        </h4>

        <div className="mt-1">
          <SecurityItem
            title="Change Password"
            description="Receive real-time notifications and team alerts."
            hasDivider
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="gap-2"
              >
                <PencilIcon className="size-5" />
                <span>Change Password</span>
              </Button>
            }
          />

          <SecurityItem
            title="Two-factor authentication (2FA)"
            description="Keep your account secure by enabling 2FA"
            action={
              <Switch
                size="sm"
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorChange}
                aria-label="Toggle two-factor authentication"
              />
            }
          />
        </div>
      </Card>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmitSuccess={handlePasswordSubmit}
      />
    </>
  );
}
