export const routes = {
  login: "/login",
  tickets: "/tickets",
  equipments: "/equipments",
  technicians: "/technicians",
} as const;

export const HOME_ROUTE = routes.tickets;
