import supabase from "@/utils/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { NextRequest } from "next/server";

function mutateQueryWithFilter(
  query: PostgrestFilterBuilder<any, any, any[], "expenses", unknown>,
  filter: string | null,
  startDate: string | null,
  endDate: string | null,
) {
  const now = new Date();
  switch (filter) {
    case "week": {
      query = query.gte(
        "date",
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      );
      break;
    }
    case "month": {
      query = query.gte(
        "date",
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        ).toISOString(),
      );
    }
    case "3months": {
      query = query.gte(
        "date",
        new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate(),
        ).toISOString(),
      );
      break;
    }
    case "custom": {
      if (startDate)
        query = query.gte("date", new Date(startDate).toISOString());
      if (endDate) query = query.lte("date", new Date(endDate).toISOString());
      break;
    }
    default: {
      break;
    }
  }
  return query;
}

async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  },
) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const { userId } = params;

  let getExpensesQuery = supabase
    .from("expenses")
    .select()
    .eq("user_id", userId);

  // TODO: how do we deep copy builder....
  getExpensesQuery = mutateQueryWithFilter(
    getExpensesQuery,
    filter,
    startDate,
    endDate,
  );

  const { data, error } = await getExpensesQuery;

  if (error) {
    console.log("error: ", error);
    return Response.json({ message: "Error" }, { status: 500 });
  }

  return Response.json({ message: "success", data });
}

export { GET };
