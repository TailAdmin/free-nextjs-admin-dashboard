import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function OfflineIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
      <Avatar size="xs">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
      <Avatar size="sm">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="offline" />
      </Avatar>
    </div>
  );
}
