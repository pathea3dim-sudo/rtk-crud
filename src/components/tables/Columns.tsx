// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
// import Image from "next/image"
// import { Button } from "../ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { DataTableColumnHeader } from "../ui/data-table-column-header"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

// // This type is used to define the shape of our data.
// export type ProductHeader = {
//   uuid: string
//   name: string
//   thumbnail: string
//   priceOut: number
// }

// type ColumnsProps = {
//   onViewDetail: (uuid: string) => void;
//   handleUpdateProductByUUID: (uuid: string) => void;
//   handleDeleteProductByUUID: (uuid: string) => void;
// }

// export const columns = ({ 
//   onViewDetail, 
//   handleUpdateProductByUUID, 
//   handleDeleteProductByUUID 
// }: ColumnsProps): ColumnDef<ProductHeader>[] => [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "uuid",
//     header: "UUID",
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <DataTableColumnHeader column={column} title="Name" />
//       )
//     },
//   },
//   {
//     accessorKey: "thumbnail",
//     header: ({ column }) => {
//       return (
//         <DataTableColumnHeader column={column} title="Thumbnail" />
//       )
//     },
//     cell: ({ getValue }) => {
//       const url = getValue();
//       return <Image
//         loading="eager"
//         height={75}
//         width={75}
//         src={url as string}
//         alt="Product thumbnail"
//       />
//     }
//   },
//   {
//     accessorKey: "priceOut",
//     header: ({ column }) => {
//       return (
//         <DataTableColumnHeader column={column} title="Price$" />
//       )
//     },
//     cell: ({ getValue }) => {
//       const price = getValue();
//       return <h1 className="text-red-500 font-bold">{price as number}$</h1>
//     }
//   }, 
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const product = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-12 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="overflow p-0">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(product.uuid)}
//             >
//               Copy Product UUID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => onViewDetail(product?.uuid)}>
//               View Product Detail
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleUpdateProductByUUID(product?.uuid)}>
//               Update Product
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleDeleteProductByUUID(product?.uuid)}>
//               Delete Product
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// ========== 1. Product Header Type ==========
export type ProductHeader = {
  uuid: string;
  name: string;
  thumbnail: string;
  priceOut: number;
};

// ========== 2. Columns Props Type ==========
type ColumnsProps = {
  onViewDetail: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  onUpdate: (uuid: string, row: ProductHeader) => void;
};

// ========== 3. Columns Definition ==========
export const columns = ({
  onViewDetail,
  onDelete,
  onUpdate,
}: ColumnsProps): ColumnDef<ProductHeader>[] => [
  // ===== Select Column =====
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ===== UUID Column =====
  {
    accessorKey: "uuid",
    header: "UUID",
  },

  // ===== Name Column =====
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },

  // ===== Thumbnail Column =====
  {
    accessorKey: "thumbnail",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Thumbnail" />;
    },
    cell: ({ getValue }) => {
      const url = getValue();
      const safeUrl =
        typeof url === "string" && url.startsWith("http")
          ? url
          : "/placeholder.png";

      return (
        <Image
          src={safeUrl}
          loading="eager"
          height={75}
          width={75}
          alt="product image"
        />
      );
    },
  },

  // ===== Price Column =====
  {
    accessorKey: "priceOut",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price$" />;
    },
    cell: ({ getValue }) => {
      const price = getValue();
      return <h1 className="text-red-500 font-bold">{price as number}$</h1>;
    },
  },

  // ===== Actions Column =====
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-12 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="overflow p-0">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            {/* Copy UUID */}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.uuid)}
            >
              Copy Product UUID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* View Detail */}
            <DropdownMenuItem onClick={() => onViewDetail(product?.uuid)}>
              View Product Detail
            </DropdownMenuItem>

            {/* Update Product */}
            <DropdownMenuItem onClick={() => onUpdate(product.uuid, product)}>
              Update Product
            </DropdownMenuItem>

            {/* Delete Product */}
            <DropdownMenuItem onClick={() => onDelete(product.uuid)}>
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];