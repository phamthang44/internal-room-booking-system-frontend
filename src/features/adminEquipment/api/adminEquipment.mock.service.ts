import type { AdminEquipmentService } from "./adminEquipment.service.types";

export const adminEquipmentMockService: AdminEquipmentService = {
  list: async () => [
    {
      id: 1,
      name: 'Sony Bravia 4K 75"',
      category: "AV",
      assetCode: "AV-75-004",
      globalStock: 42,
      assignedRooms: 38,
      health: "OPTIMAL",
    },
    {
      id: 2,
      name: "Herman Miller Aeron",
      category: "FURNITURE",
      assetCode: "FR-HM-991",
      globalStock: 112,
      assignedRooms: 12,
      health: "OPTIMAL",
    },
    {
      id: 3,
      name: "Mac Studio M2 Ultra",
      category: "COMPUTING",
      assetCode: "CP-MS-002",
      globalStock: 18,
      assignedRooms: 3,
      health: "CHECKING",
    },
    {
      id: 4,
      name: "Crestron NVX E30",
      category: "AV",
      assetCode: "AV-CR-110",
      globalStock: 65,
      assignedRooms: 62,
      health: "CRITICAL",
    },
  ],
};

