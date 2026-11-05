import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("saved_connections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, data, source: "supabase" });
    }

    return NextResponse.json({
      success: true,
      data: [],
      source: "demo-client-managed",
      notice: "Supabase not connected. Client local persistence is active.",
    });
  } catch (error) {
    console.error("Connections GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      entityId,
      entityType,
      entityName,
      entityCompany,
      entityRole,
      entityAvatar,
      status = "Saved",
      notes = "",
      matchScore = 0,
      entityData = {},
    } = body;

    if (!entityId || !entityType || !entityName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("saved_connections")
        .upsert(
          {
            entity_id: entityId,
            entity_type: entityType,
            entity_name: entityName,
            entity_company: entityCompany,
            entity_role: entityRole,
            entity_avatar: entityAvatar,
            status,
            notes,
            match_score: matchScore,
            entity_data: entityData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,entity_id,entity_type" }
        )
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0], source: "supabase" });
    }

    // In demo mode, acknowledge with formatted record
    return NextResponse.json({
      success: true,
      data: {
        id: `demo-${entityId}-${Date.now()}`,
        entityId,
        entityType,
        entityName,
        entityCompany,
        entityRole,
        entityAvatar,
        status,
        notes,
        matchScore,
        entityData,
        createdAt: new Date().toISOString(),
      },
      source: "demo",
    });
  } catch (error) {
    console.error("Connections POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
