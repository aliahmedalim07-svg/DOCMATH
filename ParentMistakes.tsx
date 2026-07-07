import { clsx, type ClassValue } from "clsx";
import { AccountType, type Language, type Role } from "./types";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const dashboardPathForRole = (role: Role) => role === "admin" ? "/teacher/dashboard" : "/student/dashboard";

export const hasAdminRole = (roles: string[]) => roles.some((role) => role.toLowerCase() === "admin");

export const dashboardPathForAccountType = (accountType: AccountType) =>
  accountType === AccountType.Parent ? "/parent/dashboard" : "/student/dashboard";

export const dashboardPathForAccess = (accountType: AccountType, roles: string[]) =>
  hasAdminRole(roles) ? "/teacher/dashboard" : dashboardPathForAccountType(accountType);

export const formatDate = (value: string, language: Language = "en") => {
  if (!value) return "";
  const date = new Date(value + (value.length === 10 ? "T00:00:00" : ""));
  return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (value: string, language: Language = "en") =>
  new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

export const formatCountdown = (targetDate?: string | null) => {
  if (!targetDate) return "";
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const getExpiryStatus = (targetDate?: string | null) => {
  if (!targetDate) return { expired: false, withinSevenDays: false, daysLeft: null as number | null };
  const diffMs = new Date(targetDate).getTime() - Date.now();
  const daysLeft = Math.ceil(diffMs / 86400000);
  return {
    expired: diffMs <= 0,
    withinSevenDays: diffMs > 0 && daysLeft <= 7,
    daysLeft,
  };
};

export const to800 = (value: number) => Math.round(value * 8);

export const percentClass = (value: number) => {
  if (value >= 640) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (value >= 440) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
