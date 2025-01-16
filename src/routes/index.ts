import authRoutes from "./auth.routes";
import propertiesRoutes from "./properties.routes";
import roomTypeRoutes from "./room-types.routes";
import roomRoutes from "./room.routes";
import profileRoutes from "./profiles.routes";
import occupanyRoutes from "./occupancy.routes";
import reservationRoutes from "./reservation.routes";
import paymentRoutes from "./payment.routes";
import propertyFacilityRoutes from "./property-facility.routes";
import mealPlanRoutes from "./meal-plan.routes";
import taxRoutes from "./tax.routes";

const routes = [
  { path: "/api/v1/pmsserver/auth", handler: authRoutes },
  { path: "/api/v1/pmsserver/properties", handler: propertiesRoutes },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/facilities",
    handler: propertyFacilityRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/room-types",
    handler: roomTypeRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/meal-plans",
    handler: mealPlanRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/rooms",
    handler: roomRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/taxes",
    handler: taxRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/profiles",
    handler: profileRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/check-availability",
    handler: occupanyRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/reservation",
    handler: reservationRoutes,
  },
  {
    path: "/api/v1/pmsserver/properties/:propertyId/reservation/:reservationId/payments",
    handler: paymentRoutes,
  },
];

export default routes;
