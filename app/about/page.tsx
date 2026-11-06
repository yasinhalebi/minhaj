import type { Metadata } from "next";
import { BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageIntro } from "@/components/catalog-ui";

export const metadata: Metadata = { title: "عن منهاج", description: "تعرف إلى فهرس منهاج المستقل وطريقة تنظيمه للمحتوى التعليمي." };
export default function AboutPage() {
  return <><SiteHeader /><main id="main-content"><PageIntro eyebrow="عن المشروع" title="منهاج، طريق أوضح للمعرفة" description="فهرس مستقل يساعد على اكتشاف المحتوى التعليمي المنشور للشيخ أحمد السيد وتنظيمه." /><div className="about-grid section-wrap"><article><span className="empty-orbit"><BookOpen size={22} /></span><h2>الوصول للمصدر</h2><p>يجمع الفهرس بيانات المواد وروابطها لتصل إلى المصدر الأصلي بسهولة، وتتم المشاهدة عبر المنصة الناشرة.</p></article><article><span className="empty-orbit"><ShieldCheck size={22} /></span><h2>محتوى مراجع</h2><p>لا تظهر المواد للزوار إلا بعد مراجعتها ونشرها. تبقى البيانات غير المكتملة خارج الفهرس العام.</p></article></div><p className="about-disclaimer section-wrap">منهاج مشروع مستقل وغير رسمي، ولا يمثّل الشيخ أحمد السيد أو أي جهة مرتبطة به.</p><p className="section-wrap"><a className="text-link" href="https://www.youtube.com/channel/UC7AbKZa30XPMInZIsViiBOQ" target="_blank" rel="noreferrer">قناة المصدر على YouTube <ExternalLink size={15} /></a></p></main><SiteFooter /></>;
}
