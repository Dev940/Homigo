import { Router } from "express";
import { createTableController, type TableConfig } from "../controllers/tableController.js";

export const tableConfigs: TableConfig[] = [
  { table: "users", primaryKey: "user_id", searchable: ["full_name", "email", "phone"], defaultOrder: "created_at", trackUpdatedAt: true },
  { table: "seeker_profiles", primaryKey: "seeker_id", searchable: ["occupation", "bio"], trackUpdatedAt: true },
  { table: "seeker_preferred_locations", primaryKey: "location_id", searchable: ["location_name"] },
  { table: "owner_profiles", primaryKey: "owner_id", searchable: ["business_name", "bio"], trackUpdatedAt: true },
  { table: "kyc_documents", primaryKey: "kyc_id" },
  { table: "current_room_details", primaryKey: "room_id", searchable: ["location", "description"], defaultOrder: "created_at", trackUpdatedAt: true },
  { table: "current_room_amenities", primaryKey: "id", searchable: ["amenity"] },
  { table: "current_room_images", primaryKey: "id" },
  { table: "properties", primaryKey: "property_id", searchable: ["title", "description", "address", "city", "state"], defaultOrder: "created_at", trackUpdatedAt: true },
  { table: "property_amenities", primaryKey: "id", searchable: ["amenity"] },
  { table: "property_images", primaryKey: "id" },
  { table: "roommate_matches", primaryKey: "match_id", defaultOrder: "created_at" },
  { table: "saved_items", primaryKey: "id", defaultOrder: "saved_at" },
  { table: "conversations", primaryKey: "conversation_id", defaultOrder: "created_at", trackUpdatedAt: true },
  { table: "messages", primaryKey: "message_id", searchable: ["body"], defaultOrder: "sent_at" },
  { table: "inquiries", primaryKey: "inquiry_id", searchable: ["message"], defaultOrder: "created_at" },
  { table: "notifications", primaryKey: "notification_id", searchable: ["title", "body"], defaultOrder: "created_at" },
  { table: "property_views", primaryKey: "view_id", defaultOrder: "viewed_at" },
  { table: "property_analytics", primaryKey: "id" },
];

export function createCrudRouter() {
  const router = Router();

  for (const config of tableConfigs) {
    const controller = createTableController(config);
    router.get(`/${config.table}`, controller.list);
    router.post(`/${config.table}`, controller.create);
    router.get(`/${config.table}/:id`, controller.get);
    router.patch(`/${config.table}/:id`, controller.update);
    router.delete(`/${config.table}/:id`, controller.remove);
  }

  return router;
}
