import type { Institution } from "@/lib/types";
import { ministries } from "./ministries";

// Ministry institutions are derived from the existing ministry dataset so the
// budget figures and ids stay in one place.
const ministryInstitutions: Institution[] = ministries.map((m) => ({
  id: m.id,
  type: "ministry",
  name: m.name,
  nameEn: m.nameEn,
  shortName: m.shortName,
  province: "Ankara",
  headOfficialId: m.ministerId,
}));

// Governorships (valilik), district governorships (kaymakamlık), metropolitan
// municipalities (büyükşehir belediyesi) and parliament (TBMM).
const otherInstitutions: Institution[] = [
  // Parliament
  {
    id: "tbmm",
    type: "parliament",
    name: "Türkiye Büyük Millet Meclisi",
    nameEn: "Grand National Assembly of Türkiye",
    shortName: "TBMM",
    province: "Ankara",
  },

  // Governorships
  {
    id: "gov-istanbul",
    type: "governorship",
    name: "İstanbul Valiliği",
    nameEn: "Governorship of İstanbul",
    shortName: "İstanbul Valiliği",
    province: "İstanbul",
    headOfficialId: "vali-istanbul",
  },
  {
    id: "gov-ankara",
    type: "governorship",
    name: "Ankara Valiliği",
    nameEn: "Governorship of Ankara",
    shortName: "Ankara Valiliği",
    province: "Ankara",
    headOfficialId: "vali-ankara",
  },
  {
    id: "gov-izmir",
    type: "governorship",
    name: "İzmir Valiliği",
    nameEn: "Governorship of İzmir",
    shortName: "İzmir Valiliği",
    province: "İzmir",
    headOfficialId: "vali-izmir",
  },
  {
    id: "gov-diyarbakir",
    type: "governorship",
    name: "Diyarbakır Valiliği",
    nameEn: "Governorship of Diyarbakır",
    shortName: "Diyarbakır Valiliği",
    province: "Diyarbakır",
    headOfficialId: "vali-diyarbakir",
  },

  // District governorships
  {
    id: "dist-kadikoy",
    type: "district-governorship",
    name: "Kadıköy Kaymakamlığı",
    nameEn: "District Governorship of Kadıköy",
    shortName: "Kadıköy Kaymakamlığı",
    parentId: "gov-istanbul",
    province: "İstanbul",
    district: "Kadıköy",
    headOfficialId: "kaymakam-kadikoy",
  },
  {
    id: "dist-uskudar",
    type: "district-governorship",
    name: "Üsküdar Kaymakamlığı",
    nameEn: "District Governorship of Üsküdar",
    shortName: "Üsküdar Kaymakamlığı",
    parentId: "gov-istanbul",
    province: "İstanbul",
    district: "Üsküdar",
    headOfficialId: "kaymakam-uskudar",
  },
  {
    id: "dist-cankaya",
    type: "district-governorship",
    name: "Çankaya Kaymakamlığı",
    nameEn: "District Governorship of Çankaya",
    shortName: "Çankaya Kaymakamlığı",
    parentId: "gov-ankara",
    province: "Ankara",
    district: "Çankaya",
    headOfficialId: "kaymakam-cankaya",
  },

  // Metropolitan municipalities
  {
    id: "mun-istanbul",
    type: "municipality",
    name: "İstanbul Büyükşehir Belediyesi",
    nameEn: "İstanbul Metropolitan Municipality",
    shortName: "İstanbul BB",
    province: "İstanbul",
    headOfficialId: "mayor-istanbul",
  },
  {
    id: "mun-ankara",
    type: "municipality",
    name: "Ankara Büyükşehir Belediyesi",
    nameEn: "Ankara Metropolitan Municipality",
    shortName: "Ankara BB",
    province: "Ankara",
    headOfficialId: "mayor-ankara",
  },
  {
    id: "mun-izmir",
    type: "municipality",
    name: "İzmir Büyükşehir Belediyesi",
    nameEn: "İzmir Metropolitan Municipality",
    shortName: "İzmir BB",
    province: "İzmir",
    headOfficialId: "pol-19",
  },
  {
    id: "mun-diyarbakir",
    type: "municipality",
    name: "Diyarbakır Büyükşehir Belediyesi",
    nameEn: "Diyarbakır Metropolitan Municipality",
    shortName: "Diyarbakır BB",
    province: "Diyarbakır",
    headOfficialId: "mayor-diyarbakir",
  },
  {
    id: "mun-kayseri",
    type: "municipality",
    name: "Kayseri Büyükşehir Belediyesi",
    nameEn: "Kayseri Metropolitan Municipality",
    shortName: "Kayseri BB",
    province: "Kayseri",
    headOfficialId: "pol-20",
  },
];

export const institutions: Institution[] = [
  ...ministryInstitutions,
  ...otherInstitutions,
];

export const institutionById = (id: string) =>
  institutions.find((i) => i.id === id);

export const institutionsByType = (type: Institution["type"]) =>
  institutions.filter((i) => i.type === type);

export const institutionTypeLabels: Record<Institution["type"], string> = {
  ministry: "Bakanlık",
  municipality: "Belediye",
  governorship: "Valilik",
  "district-governorship": "Kaymakamlık",
  parliament: "Meclis",
  agency: "Kurum",
};
