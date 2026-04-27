/**
 * Admin Equipment — API Types
 *
 * Contract source: documents/docs/equipment_api_integration.md
 * Base: /api/v1/admin/equipment (our axios baseURL typically already includes /api/v1)
 */

export interface ApiResult<T> {
  data: T;
  meta: {
    serverTime: number;
    apiVersion: string;
    traceId: string;
    message?: string;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    traceId: string;
    details?: unknown;
  };
}

export interface AuditInfo {
  createdBy: string;
  createdDate: string; // ISO-8601
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO-8601
}

export interface EquipmentListItem {
  id: number;
  nameKey: string;
  nameVi: string;
  nameEn: string;
  isActive: boolean;
  classroomCount: number;
}

export interface EquipmentDetail extends EquipmentListItem {
  descVi: string;
  descEn: string;
  audit: AuditInfo;
}

export interface EquipmentRequest {
  nameVi: string;
  nameEn: string;
  descVi?: string;
  descEn?: string;
}

/**
 * Spring-like page wrapper (shape varies by backend); keep fields optional.
 */
export interface Page<T> {
  content?: T[];
  number?: number; // 0-indexed
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

