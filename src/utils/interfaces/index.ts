export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  username: string;
  identityCard?: string;
  position?: string;
}
export interface TablePersons extends Pick<
  Person,
  "id" | "firstName" | "secondName" | "mothersLastName" | "lastName" | "identityCard" | "gender"
> {}

export interface Person {
  id: number;
  uuidColumn?: string;
  cityBirth: string | null;
  pensionEntity: PensionEntity | number;
  financialEntity: FinancialEntity | number;
  firstName: string;
  secondName: string | null;
  lastName: string;
  mothersLastName: string;
  surnameHusband: string | null;
  identityCard: string;
  dueDate: Date | null;
  isDuedateUndefined: boolean | null;
  gender: string;
  civilStatus: string;
  birthDate: Date | string;
  dateDeath: Date | null;
  deathCertificateNumber: string | null;
  reasonDeath: string | null;
  phoneNumber: string | null;
  cellPhoneNumber: string | null;
  nua: number | null;
  accountNumber: string | null;
  sigepStatus: string | null;
  idPersonalSenasir: number | null;
  dateLastContribution: Date | string | null; //Eliminar
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;

  personAffiliate?: PersonAffiliate[];
}

export interface Column {
  id: number;
  key?: string;
  name: string;
  sortable?: boolean;
}

interface SubMenuItem {
  key: string | number;
  icon?: React.JSX.Element;
  title: string;
  topTitle?: string;
  path: string;
}

export interface SidebarItem {
  title: string;
  topTitle: string;
  subMenu?: SubMenuItem[];
  description: string;
  icon?: React.ReactNode;
  customKey: string | number;
  path: string;
  selectedPath?: string;
  handleAction: (path: string) => void;
  activeItem?: string | number;
  setActiveItem?: any;
}

export interface FinancialEntity {
  id: number;
  name: string;
  serviceStatus: boolean | null;
}

export interface PensionEntity {
  id: number;
  type: string;
  name: string;
  isActive: boolean;
}

export interface PersonAffiliate {
  typeId: number;
  kinship: Kinship;
  state?: boolean;
}

export interface Kinship {
  id: number;
  name: string;
}

export interface Affiliate {
  id: number | null;
  registration: string | null;
  type: string | null;
  dateEntry: Date | string | null;
  dateDerelict: Date | string | null;
  reasonDerelict: string | null;
  serviceYears: number | null;
  serviceMonths: number | null;
  unitPoliceDescription: string | null;
  official: string | null;
  book: string | null;
  departure: string | null;
  marriageDate: Date | string | null;
}

export interface AffiliateState {
  id: number | null;
  name: string | null;
  stateType: StateType | null;
}

export interface StateType {
  id: number | null;
  name: string | null;
}

export interface Degree {
  id: number | null;
  name: string | null;
  serviceStatus: boolean | null;
}

export interface Unit {
  id: number | null;
  district: string | null;
  name: string | null;
  serviceStatus: boolean | null;
}

export interface Category {
  id: number | null;
  name: string | null;
  percentage: string | null;
  serviceStatus: boolean | null;
}

export interface Features {
  isPolice: boolean;
  hasBeneficiaries: boolean;
  hasAffiliates: boolean;
}

export interface TabSidebar {
  name: string;
  key: string;
  icon: string;
}

export interface AffiliateDocument {
  affiliateId: number | null;
  procedureDocumentId: number;
  name: string | null;
  shortened: string | null;
}

export interface FileDossier {
  id: number | null;
  name: string | null;
  shortened: string | null;
}

export interface Document {
  id: number | null;
  name: string | null;
  shortened: string | null;
}

export interface AffiliateFileDossier {
  affiliateId: number | null;
  fileDossierId: number;
  name: string | null;
  shortened: string | null;
}

export interface Fingerprint {
  fingerprintTypeId: number;
  wsq: string;
  quality: number;
}

export interface CityBirth {
  id: number | null;
  name: string | null;
  firstShortened: string | null;
  serviceStatus: boolean | null;
}

export interface FingerprintCore {
  id: number | string;
  name: string;
}
