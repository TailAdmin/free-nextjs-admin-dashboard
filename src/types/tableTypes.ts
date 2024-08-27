export type LinkType = "none" | "internal" | "external";

export type ColumnType<T> = {
    key: keyof T;
    label: string;
    link_type?: LinkType;
    link?: string | ((row: T) => string);
};