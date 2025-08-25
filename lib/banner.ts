import { createServerClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/client"

export async function getBanner() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("banners")
      .select("banner_url")
      .single()

    if (error) {
      console.error("Error fetching banner:", error)
      return null
    }

    return data?.banner_url || null
  } catch (error) {
    console.error("Error in getBanner:", error)
    return null
  }
}

export async function getBannerClient() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("banners")
      .select("banner_url")
      .single()

    if (error) {
      console.error("Error fetching banner:", error)
      return null
    }

    return data?.banner_url || null
  } catch (error) {
    console.error("Error in getBannerClient:", error)
    return null
  }
}
