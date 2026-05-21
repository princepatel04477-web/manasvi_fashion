import { supabase } from "./supabase";
import { readJson, writeJson } from "./db-helper";

export interface HomepageCmsConfig {
  heroBanner: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionTunicImage: string;
  sectionTunicLink: string;
  sectionTunicAlt: string;
  sectionKurtiImage: string;
  sectionKurtiLink: string;
  sectionKurtiAlt: string;
}

const CMS_FILE = "homepage-cms-db.json";

const defaultConfig: HomepageCmsConfig = {
  heroBanner: "/manasvi-hero.png",
  heroTitle: "MANASVI",
  heroSubtitle: "FASHION",
  sectionTunicImage: "/photos/9ba35110773d4f9f8f2bfcffc17bfd3cd034c4679562654196a1c52b120c67d6.png",
  sectionTunicLink: "/tunic-tops",
  sectionTunicAlt: "Freshly picked moments embroidered tunic top",
  sectionKurtiImage: "/photos/red-kurti-carousel.png",
  sectionKurtiLink: "/kurtis",
  sectionKurtiAlt: "Freshly picked moments embroidered red kurti"
};

export async function getCmsConfig(): Promise<HomepageCmsConfig> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("homepage_cms")
        .select("*")
        .eq("id", "singleton")
        .single();

      if (!error && data) {
        return {
          heroBanner: data.hero_banner,
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          sectionTunicImage: data.section_tunic_image,
          sectionTunicLink: data.section_tunic_link,
          sectionTunicAlt: data.section_tunic_alt,
          sectionKurtiImage: data.section_kurti_image,
          sectionKurtiLink: data.section_kurti_link,
          sectionKurtiAlt: data.section_kurti_alt
        };
      }
      console.warn("[db-cms] Supabase single query failed or not seeded:", error?.message);
    } catch (err) {
      console.warn("[db-cms] Supabase get error:", err);
    }
  }

  return readJson<HomepageCmsConfig>(CMS_FILE, defaultConfig);
}

export async function saveCmsConfig(config: HomepageCmsConfig): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from("homepage_cms")
        .upsert({
          id: "singleton",
          hero_banner: config.heroBanner,
          hero_title: config.heroTitle,
          hero_subtitle: config.heroSubtitle,
          section_tunic_image: config.sectionTunicImage,
          section_tunic_link: config.sectionTunicLink,
          section_tunic_alt: config.sectionTunicAlt,
          section_kurti_image: config.sectionKurtiImage,
          section_kurti_link: config.sectionKurtiLink,
          section_kurti_alt: config.sectionKurtiAlt,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        console.log("[db-cms] Homepage CMS saved in Supabase");
      } else {
        console.warn("[db-cms] Supabase upsert failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-cms] Supabase save error:", err);
    }
  }

  await writeJson<HomepageCmsConfig>(CMS_FILE, config);
}
