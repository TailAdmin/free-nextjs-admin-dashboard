import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DefaultAvatar() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
      <Avatar size="xs">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarImage src="/images/user/user-01.jpg" alt="user one" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
    </div>
  );
}
