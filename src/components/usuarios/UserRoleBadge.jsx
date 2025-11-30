"use client";

import { Badge } from "@/components/ui/badge";

const ROLE_CONFIG = {
  sabio_admin: {
    label: "Administrador",
    variant: "default",
    className: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  sabio_vendedor: {
    label: "Vendedor",
    variant: "secondary",
    className: "bg-green-600 hover:bg-green-700 text-white"
  },
  sabio_tecnico: {
    label: "Técnico",
    variant: "secondary",
    className: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  sabio_laboratorio: {
    label: "Laboratorio",
    variant: "secondary",
    className: "bg-orange-600 hover:bg-orange-700 text-white"
  },
  cliente_owner: {
    label: "Cliente Owner",
    variant: "outline",
    className: "border-gray-400 text-gray-700"
  },
  cliente_corporate: {
    label: "Cliente Corporate",
    variant: "outline",
    className: "border-gray-400 text-gray-700"
  }
};

export default function UserRoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || {
    label: role,
    variant: "secondary",
    className: ""
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
