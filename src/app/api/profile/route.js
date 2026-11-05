import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { DEFAULT_USER_PROFILE } from "@/data/samplePersonas";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, profile: data, source: "supabase" });
      }
    }

    return NextResponse.json({
      success: true,
      profile: DEFAULT_USER_PROFILE,
      source: "demo",
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      profile: DEFAULT_USER_PROFILE,
      source: "fallback",
    });
  }
}

export async function POST(req) {
  try {
    const profile = await req.json();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, profile: data[0], source: "supabase" });
    }

    return NextResponse.json({
      success: true,
      profile,
      source: "demo-client",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
