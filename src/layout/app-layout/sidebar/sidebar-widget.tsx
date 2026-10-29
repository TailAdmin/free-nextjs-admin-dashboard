import { useTranslations } from "next-intl";

export default function SidebarWidget() {
  const t = useTranslations("sidebar.widget");

  return (
    <div className="mx-auto rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3">
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        {t("title")}
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {t("description")}
      </p>
      <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center rounded-lg bg-brand-500 p-3 text-sm font-medium text-white hover:bg-brand-600"
      >
        {t("purchasePlan")}
      </a>
    </div>
  );
}
