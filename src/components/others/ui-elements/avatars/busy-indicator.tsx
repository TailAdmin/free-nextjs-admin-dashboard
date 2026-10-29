import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function BusyIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
      <Avatar size="xs">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
      <Avatar size="sm">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge variant="busy" />
      </Avatar>
    </div>
  );
}
