import articlesLocal from "@/shared/data/articles.json";
import sectionsLocal from "@/shared/data/sections.json";
import subSectionsLocal from "@/shared/data/subSections.json";



const isLocal = process.env.NEXT_PUBLIC_STATIC_BACKEND === "true";

type DataType = "articles" | "sections" | "subSections" | "all";

export default async function getData(type: DataType) {

  if (true) {
    if (type === "sections") return sectionsLocal;
    if (type === "subSections") return subSectionsLocal;
    if (type === "articles") return articlesLocal;
    if (type === "all") {
      return {
        articles: articlesLocal,
        sections: sectionsLocal,
        subSections: subSectionsLocal,
      };
    }
    throw new Error(`Unknown type: ${type}`);
  }

  // Серверный режим (fetch)
  const base = "http://localhost:3000";

  if (type === "sections") {
    return fetch(`${base}/sections`).then(r => r.json());
  }
  if (type === "subSections") {
    return fetch(`${base}/subSections`).then(r => r.json());
  }
  if (type === "articles") {
    return fetch(`${base}/articles`).then(r => r.json());
  }
  if (type === "all") {
    const [sections, subSections, articles, ] = await Promise.all([
      fetch(`${base}/sections`).then(r => r.json()),
      fetch(`${base}/subSections`).then(r => r.json()),
      fetch(`${base}/articles`).then(r => r.json()),
    ]);
    return { sections, subSections, articles,};
  }

  throw new Error(`Unknown type: ${type}`);
}