import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ data }) {
  return (
    <Link href={`/shop/${data.id}`}>
      <Card className="border-none cursor-pointer bg-gray-cs p-0">
        <Image
          src={data.image}
          alt={"image"}
          width={300}
          height={260}
          className="w-full h-65 object-cover block rounded-t-lg"
        />
        <CardContent className="pb-4">
          <p className="text-gray-400">My shop</p>
          <h2 className="text-lg text-white font-semibold truncate">
            {data.name}
          </h2>
          <p className="text-gray-400 truncate">{data.description}</p>

          <p className="text-green-500 font-bold text-xl mt-2">
          {(data.price || 0).toLocaleString()}₫
          </p>

          <div className="flex items-center text-sm text-gray-400 mt-2">
            <span className="flex items-center mr-4">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
              {data.rating ?? 0}
            </span>
            <span>{(data.total_sale || 0).toLocaleString()} sold</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
