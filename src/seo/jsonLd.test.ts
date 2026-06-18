/* eslint-disable @typescript-eslint/no-explicit-any -- JSON-LD 블록은 라우트마다 구조가 달라 동적 접근을 위해 any 사용 */
import { describe, it, expect } from "vitest";
import { buildJsonLd } from "./jsonLd";
import { prerenderRoutes, ORIGIN } from "./routeMeta";
import { translations } from "../i18n/translations";

const routeFor = (url: string) => prerenderRoutes.find((r) => r.url === url)!;

describe("buildJsonLd", () => {
  it("home emits Person, WebSite, WebApplication", () => {
    const types = buildJsonLd(routeFor("/")).map((o: any) => o["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Person", "WebSite", "WebApplication"]));
  });

  it("publisher @id is stable and referenced by WebSite", () => {
    const blocks = buildJsonLd(routeFor("/")) as any[];
    const person = blocks.find((b) => b["@type"] === "Person");
    const website = blocks.find((b) => b["@type"] === "WebSite");
    expect(person["@id"]).toBe(`${ORIGIN}/#publisher`);
    expect(website.publisher["@id"]).toBe(`${ORIGIN}/#publisher`);
  });

  it("Person carries no credential jobTitle (no certification claim)", () => {
    const person = (buildJsonLd(routeFor("/")) as any[]).find((b) => b["@type"] === "Person");
    expect(person.jobTitle ?? "").not.toMatch(/2급|consultant|certified|자격/i);
    expect(person.knowsAbout).toBeDefined();
  });

  it("/types emits a DefinedTermSet of 8 terms", () => {
    const set = (buildJsonLd(routeFor("/types")) as any[]).find(
      (b) => b["@type"] === "DefinedTermSet",
    );
    expect(set.hasDefinedTerm).toHaveLength(8);
  });

  it("type detail emits DefinedTerm + BreadcrumbList with 3 crumbs", () => {
    const blocks = buildJsonLd(routeFor("/types/spring-light")) as any[];
    expect(blocks.find((b) => b["@type"] === "DefinedTerm").name).toBe("봄 라이트");
    expect(blocks.find((b) => b["@type"] === "BreadcrumbList").itemListElement).toHaveLength(3);
  });

  it("en route uses en inLanguage and en origin paths", () => {
    const set = (buildJsonLd(routeFor("/en/types")) as any[]).find(
      (b) => b["@type"] === "DefinedTermSet",
    );
    expect(set.inLanguage).toBe("en");
  });

  it("returns [] for an unknown non-slug route instead of throwing", () => {
    const fake = {
      url: "/bogus",
      lang: "ko",
      logical: "/bogus",
      title: "x",
      description: "y",
      alternates: { ko: "/bogus", en: "/en/bogus" },
    } as any;
    expect(buildJsonLd(fake)).toEqual([]);
  });

  it("/about emits a FAQPage block with mainEntity Questions matching translations", () => {
    const blocks = buildJsonLd(routeFor("/about")) as any[];
    const faq = blocks.find((b) => b["@type"] === "FAQPage");
    expect(faq).toBeDefined();
    const expectedCount = translations.ko.about.faq.items.length;
    expect(faq.mainEntity).toHaveLength(expectedCount);
    expect(faq.mainEntity[0]["@type"]).toBe("Question");
    expect(faq.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });
});
