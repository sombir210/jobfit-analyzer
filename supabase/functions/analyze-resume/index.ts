import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JobRole {
  id: string;
  title: string;
  domain: string;
  required_skills: string[];
  preferred_skills: string[];
  description: string;
}

interface ResumeAnalysis {
  skills: string[];
  education: string[];
  experienceYears: number;
  summary: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, domain, fileName } = await req.json();

    if (!resumeText || !domain) {
      return new Response(
        JSON.stringify({ error: "Resume text and domain are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (resumeText.length < 50) {
      return new Response(
        JSON.stringify({ error: "Resume text too short for analysis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ✅ Fetch job roles for selected domain
    const { data: jobRoles, error: rolesError } = await supabase
      .from("job_roles")
      .select("*")
      .eq("domain", domain);

    if (rolesError || !jobRoles) {
      throw new Error("Failed to fetch job roles");
    }

    // =====================================================
    // ✅ RULE-BASED RESUME ANALYSIS (NO AI, NO CREDITS)
    // =====================================================

    const skillKeywords = [
      "python",
      "java",
      "javascript",
      "react",
      "sql",
      "html",
      "css",
      "node",
      "networking",
      "rf",
      "telecom",
      "routing",
      "switching",
      "4g",
      "5g",
      "management",
      "communication",
      "operations",
      "support",
    ];

    const lowerText = resumeText.toLowerCase();

    const extractedSkills = skillKeywords.filter((skill) =>
      lowerText.includes(skill)
    );

    const analysis: ResumeAnalysis = {
      skills: extractedSkills,
      education: [],
      experienceYears: 0,
      summary:
        "Resume analyzed using rule-based skill extraction and matching logic.",
    };

    const normalizedSkills = analysis.skills.map((s) => s.toLowerCase());

    // =====================================================
    // ✅ JOB ROLE MATCHING & SCORING
    // =====================================================

    const roleMatches = (jobRoles as JobRole[]).map((role) => {
      const requiredSkills = role.required_skills.map((s) => s.toLowerCase());
      const preferredSkills = role.preferred_skills.map((s) => s.toLowerCase());

      const matchedRequired = requiredSkills.filter((skill) =>
        normalizedSkills.includes(skill)
      );

      const matchedPreferred = preferredSkills.filter((skill) =>
        normalizedSkills.includes(skill)
      );

      const missingRequired = requiredSkills.filter(
        (skill) => !normalizedSkills.includes(skill)
      );

      const requiredScore =
        requiredSkills.length > 0
          ? (matchedRequired.length / requiredSkills.length) * 70
          : 35;

      const preferredScore =
        preferredSkills.length > 0
          ? (matchedPreferred.length / preferredSkills.length) * 30
          : 15;

      const totalScore = Math.round(requiredScore + preferredScore);

      return {
        roleId: role.id,
        roleTitle: role.title,
        description: role.description,
        matchScore: totalScore,
        matchedSkills: [...matchedRequired, ...matchedPreferred],
        missingSkills: missingRequired,
      };
    });

    roleMatches.sort((a, b) => b.matchScore - a.matchScore);

    const bestMatch = roleMatches[0];
    const overallScore = bestMatch?.matchScore || 0;

    let suitability: "suitable" | "partially_suitable" | "not_suitable";

    if (overallScore >= 70) suitability = "suitable";
    else if (overallScore >= 40) suitability = "partially_suitable";
    else suitability = "not_suitable";

    const recommendedRoles = roleMatches.slice(0, 3);

    // =====================================================
    // ✅ SAVE RESULT TO DATABASE
    // =====================================================

    const { data: savedAnalysis } = await supabase
      .from("resume_analyses")
      .insert({
        file_name: fileName || "uploaded_resume",
        domain,
        extracted_skills: normalizedSkills,
        education: analysis.education,
        experience_years: analysis.experienceYears,
        match_score: overallScore,
        suitability,
        missing_skills: bestMatch?.missingSkills || [],
        recommended_roles: recommendedRoles,
        raw_analysis: {
          summary: analysis.summary,
          roleMatches,
        },
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        analysisId: savedAnalysis?.id,
        results: {
          matchScore: overallScore,
          suitability,
          extractedSkills: normalizedSkills,
          summary: analysis.summary,
          missingSkills: bestMatch?.missingSkills || [],
          recommendedRoles,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("resume-analysis error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
