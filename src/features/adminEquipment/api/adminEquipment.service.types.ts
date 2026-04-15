export interface AdminEquipmentListItem {
  readonly id: number;
  readonly name: string;
  readonly category: "AV" | "FURNITURE" | "COMPUTING" | "OTHER";
  readonly assetCode: string;
  readonly globalStock: number;
  readonly assignedRooms: number;
  readonly health: "OPTIMAL" | "CHECKING" | "CRITICAL";
}

export interface AdminEquipmentService {
  list: () => Promise<readonly AdminEquipmentListItem[]>;
}

