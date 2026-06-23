import { NextResponse } from "next/server";

import { searchWorkspace } from "@/features/search/queries";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const results = await searchWorkspace(query);

  return NextResponse.json(results);
};