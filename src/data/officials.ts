import type { Official } from "@/lib/types";
import { politicians } from "./politicians";

// Existing politicians (ministers, MPs, mayors, deputies, bureaucrats) are
// mapped into the unified Official model. MPs are attached to parliament.
const mappedPoliticians: Official[] = politicians.map((p) => ({
  id: p.id,
  name: p.name,
  partyId: p.partyId,
  role: p.role,
  institutionId:
    p.ministryId ?? (p.role === "Member of Parliament" ? "tbmm" : undefined),
  province: p.region,
  since: p.since,
  bio: p.bio,
}));

// Appointed (non-partisan) governors and district governors, plus the
// additional metropolitan mayors. NOTE: all fictional sample data.
const appointedAndMayors: Official[] = [
  // Governors (vali) — appointed, no party
  {
    id: "vali-istanbul",
    name: "Rıza Demir",
    role: "Governor",
    institutionId: "gov-istanbul",
    province: "İstanbul",
    since: "2022-08-01",
    bio: "İstanbul Valisi; il genelinde idari koordinasyon ve afet yönetiminden sorumlu.",
  },
  {
    id: "vali-ankara",
    name: "Sevda Yalçın",
    role: "Governor",
    institutionId: "gov-ankara",
    province: "Ankara",
    since: "2023-01-15",
    bio: "Ankara Valisi; başkentteki kamu hizmetlerinin il düzeyinde eşgüdümünü yürütür.",
  },
  {
    id: "vali-izmir",
    name: "Cem Aktaş",
    role: "Governor",
    institutionId: "gov-izmir",
    province: "İzmir",
    since: "2022-11-10",
    bio: "İzmir Valisi; bölgesel güvenlik ve kamu yatırımları koordinasyonundan sorumlu.",
  },
  {
    id: "vali-diyarbakir",
    name: "Halil Sönmez",
    role: "Governor",
    institutionId: "gov-diyarbakir",
    province: "Diyarbakır",
    since: "2023-03-20",
    bio: "Diyarbakır Valisi; il idaresi ve kalkınma programlarını yürütür.",
  },

  // District governors (kaymakam)
  {
    id: "kaymakam-kadikoy",
    name: "Ebru Taş",
    role: "District Governor",
    institutionId: "dist-kadikoy",
    province: "İstanbul",
    district: "Kadıköy",
    since: "2023-09-01",
    bio: "Kadıköy Kaymakamı; ilçe düzeyinde kamu hizmetleri ve sosyal yardımlardan sorumlu.",
  },
  {
    id: "kaymakam-uskudar",
    name: "Volkan Eren",
    role: "District Governor",
    institutionId: "dist-uskudar",
    province: "İstanbul",
    district: "Üsküdar",
    since: "2023-09-01",
    bio: "Üsküdar Kaymakamı; ilçe idaresi ve yerel koordinasyonu yürütür.",
  },
  {
    id: "kaymakam-cankaya",
    name: "Aslı Korkut",
    role: "District Governor",
    institutionId: "dist-cankaya",
    province: "Ankara",
    district: "Çankaya",
    since: "2022-12-05",
    bio: "Çankaya Kaymakamı; ilçedeki kamu hizmetlerinin eşgüdümünden sorumlu.",
  },

  // Additional metropolitan mayors (elected)
  {
    id: "mayor-istanbul",
    name: "Sinan Aktürk",
    partyId: "dhh",
    role: "Mayor",
    institutionId: "mun-istanbul",
    province: "İstanbul",
    since: "2024-04-01",
    bio: "İstanbul Büyükşehir Belediye Başkanı; kentsel ulaşım ve altyapı yatırımlarından sorumlu.",
  },
  {
    id: "mayor-ankara",
    name: "Derya Ulus",
    partyId: "dhh",
    role: "Mayor",
    institutionId: "mun-ankara",
    province: "Ankara",
    since: "2024-04-01",
    bio: "Ankara Büyükşehir Belediye Başkanı; başkentin belediye hizmetlerini yönetir.",
  },
  {
    id: "mayor-diyarbakir",
    name: "Rojda Aslan",
    partyId: "oap",
    role: "Mayor",
    institutionId: "mun-diyarbakir",
    province: "Diyarbakır",
    since: "2024-04-01",
    bio: "Diyarbakır Büyükşehir Belediye Başkanı; yerel altyapı ve sosyal hizmetlerden sorumlu.",
  },
];

export const officials: Official[] = [...mappedPoliticians, ...appointedAndMayors];

export const officialById = (id: string) => officials.find((o) => o.id === id);

export const officialRoleLabels: Record<Official["role"], string> = {
  Minister: "Bakan",
  "Deputy Minister": "Bakan Yardımcısı",
  "Member of Parliament": "Milletvekili",
  Mayor: "Belediye Başkanı",
  Governor: "Vali",
  "District Governor": "Kaymakam",
  Bureaucrat: "Bürokrat",
  "Council Member": "Meclis Üyesi",
};
