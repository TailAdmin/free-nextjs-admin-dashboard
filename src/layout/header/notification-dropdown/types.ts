export interface NotificationItem {
  id: string;
  name: string;
  avatar: string;
  actionKey: "requestsPermission";
  project: string;
  timeKey: "minAgo" | "hrAgo";
  timeCount: number;
  status: "online" | "offline" | "busy";
}
