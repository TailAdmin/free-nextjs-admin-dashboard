// src/icons/index.tsx
import React, { SVGProps } from "react";

// Import SVG as React Component
import PlusSvg from "./plus.svg";
import CloseSvg from "./close.svg";
import BoxSvg from "./box.svg";
import CheckCircleSvg from "./check-circle.svg";
import AlertSvg from "./alert.svg";
import InfoSvg from "./info.svg";
import ErrorSvg from "./info-hexa.svg";
import BoltSvg from "./bolt.svg";
import ArrowUpSvg from "./arrow-up.svg";
import ArrowDownSvg from "./arrow-down.svg";
import FolderSvg from "./folder.svg";
import VideoSvg from "./videos.svg";
import AudioSvg from "./audio.svg";
import GridSvg from "./grid.svg";
import FileSvg from "./file.svg";
import DownloadSvg from "./download.svg";
import ArrowRightSvg from "./arrow-right.svg";
import GroupSvg from "./group.svg";
import BoxLineSvg from "./box-line.svg";
import ShootingStarSvg from "./shooting-star.svg";
import DollarLineSvg from "./dollar-line.svg";
import TrashSvg from "./trash.svg";
import AngleUpSvg from "./angle-up.svg";
import AngleDownSvg from "./angle-down.svg";
import PencilSvg from "./pencil.svg";
import CheckLineSvg from "./check-line.svg";
import CloseLineSvg from "./close-line.svg";
import ChevronDownSvg from "./chevron-down.svg";
import ChevronUpSvg from "./chevron-up.svg";
import PaperPlaneSvg from "./paper-plane.svg";
import LockSvg from "./lock.svg";
import EnvelopeSvg from "./envelope.svg";
import UserSvg from "./user-line.svg";
import CalenderSvg from "./calender-line.svg";
import EyeSvg from "./eye.svg";
import EyeCloseSvg from "./eye-close.svg";
import TimeSvg from "./time.svg";
import CopySvg from "./copy.svg";
import ChevronLeftSvg from "./chevron-left.svg";
import UserCircleSvg from "./user-circle.svg";
import TaskSvg from "./task-icon.svg";
import ListSvg from "./list.svg";
import TableSvg from "./table.svg";
import PageSvg from "./page.svg";
import PieChartSvg from "./pie-chart.svg";
import BoxCubeSvg from "./box-cube.svg";
import PlugInSvg from "./plug-in.svg";
import DocsSvg from "./docs.svg";
import MailSvg from "./mail-line.svg";
import HorizontalDotsSvg from "./horizontal-dots.svg";
import ChatSvg from "./chat.svg";
import MoreDotSvg from "./more-dot.svg";
import BellSvg from "./bell.svg";

// Definisi type untuk props ikon
// Perubahan: Menambahkan properti `title?: string;`
type IconProps = SVGProps<SVGSVGElement> & {
    title?: string; // Menambahkan properti title (opsional)
};

// Wrapper untuk setiap SVG agar menjadi komponen React yang menerima props
const createIconComponent = (SvgComponent: React.ComponentType<SVGProps<SVGSVGElement>>) => {
  const IconComponent: React.FC<IconProps> = (props) => <SvgComponent {...props} />;
  IconComponent.displayName = SvgComponent.displayName || SvgComponent.name;
  return IconComponent;
};

// Ekspor komponen ikon yang sudah di-wrap
export const PlusIcon = createIconComponent(PlusSvg);
export const CloseIcon = createIconComponent(CloseSvg);
export const BoxIcon = createIconComponent(BoxSvg);
export const CheckCircleIcon = createIconComponent(CheckCircleSvg);
export const AlertIcon = createIconComponent(AlertSvg);
export const InfoIcon = createIconComponent(InfoSvg);
export const ErrorIcon = createIconComponent(ErrorSvg);
export const BoltIcon = createIconComponent(BoltSvg);
export const ArrowUpIcon = createIconComponent(ArrowUpSvg);
export const ArrowDownIcon = createIconComponent(ArrowDownSvg);
export const FolderIcon = createIconComponent(FolderSvg);
export const VideoIcon = createIconComponent(VideoSvg);
export const AudioIcon = createIconComponent(AudioSvg);
export const GridIcon = createIconComponent(GridSvg);
export const FileIcon = createIconComponent(FileSvg);
export const DownloadIcon = createIconComponent(DownloadSvg);
export const ArrowRightIcon = createIconComponent(ArrowRightSvg);
export const GroupIcon = createIconComponent(GroupSvg);
export const BoxIconLine = createIconComponent(BoxLineSvg);
export const ShootingStarIcon = createIconComponent(ShootingStarSvg);
export const DollarLineIcon = createIconComponent(DollarLineSvg);
export const TrashBinIcon = createIconComponent(TrashSvg);
export const AngleUpIcon = createIconComponent(AngleUpSvg);
export const AngleDownIcon = createIconComponent(AngleDownSvg);
export const PencilIcon = createIconComponent(PencilSvg);
export const CheckLineIcon = createIconComponent(CheckLineSvg);
export const CloseLineIcon = createIconComponent(CloseLineSvg);
export const ChevronDownIcon = createIconComponent(ChevronDownSvg);
export const ChevronUpIcon = createIconComponent(ChevronUpSvg);
export const PaperPlaneIcon = createIconComponent(PaperPlaneSvg);
export const LockIcon = createIconComponent(LockSvg);
export const EnvelopeIcon = createIconComponent(EnvelopeSvg);
export const UserIcon = createIconComponent(UserSvg);
export const CalenderIcon = createIconComponent(CalenderSvg);
export const EyeIcon = createIconComponent(EyeSvg);
export const EyeCloseIcon = createIconComponent(EyeCloseSvg);
export const TimeIcon = createIconComponent(TimeSvg);
export const CopyIcon = createIconComponent(CopySvg);
export const ChevronLeftIcon = createIconComponent(ChevronLeftSvg);
export const UserCircleIcon = createIconComponent(UserCircleSvg);
export const TaskIcon = createIconComponent(TaskSvg);
export const ListIcon = createIconComponent(ListSvg);
export const TableIcon = createIconComponent(TableSvg);
export const PageIcon = createIconComponent(PageSvg);
export const PieChartIcon = createIconComponent(PieChartSvg);
export const BoxCubeIcon = createIconComponent(BoxCubeSvg);
export const PlugInIcon = createIconComponent(PlugInSvg);
export const DocsIcon = createIconComponent(DocsSvg);
export const MailIcon = createIconComponent(MailSvg);
export const HorizontaLDots = createIconComponent(HorizontalDotsSvg);
export const ChatIcon = createIconComponent(ChatSvg);
export const MoreDotIcon = createIconComponent(MoreDotSvg);
export const BellIcon = createIconComponent(BellSvg);