import { Link } from "@/i18n/navigation";

export function ChildSafetyContent() {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="space-y-1">
        <p className="text-text-secondary">
          <strong>Effective date:</strong> [INSERT EFFECTIVE DATE]
        </p>
        <p className="text-text-secondary">
          <strong>Last updated:</strong> [INSERT LAST-UPDATED DATE]
        </p>
      </div>

      {/* Section 1 */}
      <Section number="1" title="Our Commitment to Child Safety">
        <p>
          Qal Dating is a dating and relationship platform designed primarily for
          Habesha communities, including Ethiopian and Eritrean people and
          members of the global diaspora.
        </p>
        <p>
          Qal Dating has zero tolerance for child sexual abuse and exploitation
          (CSAE). We are committed to keeping our platform free of any content
          or behaviour that sexually exploits, abuses, or endangers children.
        </p>
        <p>
          These Child Safety Standards set out the rules, controls, and
          reporting processes Qal Dating applies to prevent, detect, and respond
          to CSAE. They form part of the Qal Dating{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms of Use</Link>{" "}
          and should be read alongside our{" "}
          <Link href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</Link>,{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
          <Link href="/safety-tips" className="text-primary hover:underline">Dating Safety Tips</Link>.
        </p>
      </Section>

      {/* Section 2 */}
      <Section number="2" title="Qal Dating Is Strictly Adults Only">
        <p>
          Qal Dating is strictly for people aged 18 and over. No child is
          permitted to create or use a Qal Dating account.
        </p>
        <p>You must not:</p>
        <List
          items={[
            "create an account if you are under 18;",
            "provide a false date of birth;",
            "create or operate an account for a person under 18;",
            "allow a person under 18 to use your account;",
            "use Qal Dating to contact, pursue, or arrange a meeting with a person you know or suspect is under 18; or",
            "use a photograph of a child as your primary profile photograph.",
          ]}
        />
        <p>
          Any account reasonably believed to belong to, or be operated for, a
          person under 18 will be removed.
        </p>
      </Section>

      {/* Section 3 */}
      <Section number="3" title="What We Mean by CSAE and CSAM">
        <p>
          <strong>Child sexual abuse and exploitation (CSAE)</strong> means
          any content or behaviour that sexually exploits, abuses, or
          endangers a child. This includes, without limitation:
        </p>
        <List
          items={[
            "grooming a child for sexual exploitation;",
            "sextortion of a child;",
            "trafficking of a child for sex;",
            "sexualised depiction or sexualisation of a child; and",
            "otherwise sexually exploiting or endangering a child.",
          ]}
        />
        <p>
          <strong>Child sexual abuse material (CSAM)</strong> means any visual
          depiction — including photographs, videos, and computer-generated
          imagery — of a minor engaging in sexually explicit conduct. CSAM is
          illegal and is categorically prohibited on Qal Dating.
        </p>
        <p>
          A child or minor means any person under the age of 18.
        </p>
      </Section>

      {/* Section 4 */}
      <Section number="4" title="Prohibited Content and Conduct">
        <p>
          The following are strictly prohibited on Qal Dating, across profiles,
          biographies, photographs, messages, image messages, links, and any
          other activity connected with the Services:
        </p>
        <List
          items={[
            "creating, uploading, sending, requesting, sharing, or storing CSAM;",
            "any content that sexually depicts, exploits, endangers, or targets a child;",
            "grooming or attempting to groom a child, including building trust with a child for sexual purposes;",
            "sextortion, blackmail, or coercion of a child for sexual content, money, or favours;",
            "facilitating, promoting, or arranging the sexual exploitation or trafficking of a child;",
            "advertising, requesting, or offering sexual contact with a minor;",
            "sexualised comments about, or sexualisation of, a child;",
            "AI-generated, manipulated, or computer-generated sexual imagery involving a child;",
            "links to external content that sexually exploits or abuses children;",
            "obtaining, or attempting to obtain, the personal information of a child for exploitation; or",
            "any other conduct constituting CSAE under applicable law.",
          ]}
        />
        <p>
          A violation of this section is a severe violation and may result in
          immediate permanent removal of the account without warning, in
          addition to the actions described in these Standards.
        </p>
      </Section>

      {/* Section 5 */}
      <Section number="5" title="Reporting and In-App Feedback Mechanism">
        <p>
          Qal Dating provides an in-app mechanism for users to communicate child
          safety concerns directly to us without leaving the app.
        </p>
        <p>
          Use the in-app <strong>Report</strong> feature on any profile,
          photograph, or message you believe involves a child or constitutes
          CSAE. Reports may include concerns such as a suspected underage
          user, grooming, sexual content involving a child, or any other child
          safety issue.
        </p>
        <p>
          You may also contact us at any time through in-app support or by
          email at{" "}
          <a href="mailto:support@qaldating.com" className="text-primary hover:underline">support@qaldating.com</a>.
        </p>
        <p>
          If you believe a child is in immediate danger, contact your local
          emergency services or law-enforcement authority first. Do not rely
          only on an in-app report during an emergency.
        </p>
      </Section>

      {/* Section 6 */}
      <Section number="6" title="How Qal Dating Addresses CSAM">
        <p>
          Qal Dating takes appropriate action to address CSAM in accordance with
          these Standards and applicable law.
        </p>
        <p>
          We use moderation methods that may include automated photo
          moderation (including Amazon Rekognition), user reports, account and
          activity signals, and review by authorised personnel to detect and
          prevent CSAE-related content.
        </p>
        <p>
          When we obtain actual knowledge of suspected CSAM on Qal Dating, we may:
        </p>
        <List
          items={[
            "immediately remove or disable access to the content;",
            "permanently ban the account responsible and prevent replacement accounts;",
            "preserve relevant evidence as permitted or required by law;",
            "review associated accounts, content, and activity; and",
            "report the content and the responsible account to the appropriate authorities, including the National Center for Missing & Exploited Children (NCMEC) or the relevant local law-enforcement or child-protection authority.",
          ]}
        />
        <p>
          We cooperate with lawful requests from law-enforcement and child
          protection authorities investigating child sexual abuse and
          exploitation.
        </p>
      </Section>

      {/* Section 7 */}
      <Section number="7" title="Compliance with Child Safety Laws">
        <p>
          Qal Dating is committed to complying with applicable child safety laws
          and regulations in the jurisdictions where we operate, including
          obligations concerning the reporting and removal of CSAM.
        </p>
        <p>
          This includes, where applicable, our obligations under the UK Online
          Safety Act 2023 to address illegal content and protect users, and
          requirements to report apparent CSAM to the relevant authorities.
        </p>
        <p>
          Our standards are informed by recognised industry good practices for
          combating online child sexual exploitation and abuse, including the
          Tech Coalition&rsquo;s best practices.
        </p>
      </Section>

      {/* Section 8 */}
      <Section number="8" title="Enforcement">
        <p>
          Violations of these Child Safety Standards are treated as among the
          most serious breaches of our rules. Depending on the nature and
          seriousness of the violation, Qal Dating may:
        </p>
        <List
          items={[
            "remove or disable content;",
            "temporarily suspend or permanently ban an account;",
            "prevent the creation of replacement accounts;",
            "preserve relevant evidence;",
            "notify an app store, payment provider, or service provider;",
            "report suspected unlawful activity to law-enforcement or child-protection authorities; or",
            "take any other proportionate safety measure.",
          ]}
        />
        <p>
          Severe violations — including any CSAE or CSAM violation — may
          result in immediate permanent removal without a previous warning.
        </p>
        <p>
          If you believe a moderation decision was made in error, you may
          appeal by contacting{" "}
          <a href="mailto:support@qaldating.com" className="text-primary hover:underline">support@qaldating.com</a>{" "}
          as described in our{" "}
          <Link href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</Link>.
        </p>
      </Section>

      {/* Section 9 */}
      <Section number="9" title="Child Safety Point of Contact">
        <p>
          Qal Dating has designated a child safety point of contact responsible
          for responding to questions and notifications concerning CSAE
          prevention, CSAM, and compliance with these Standards.
        </p>
        <p>
          <strong>Child Safety Contact:</strong>{" "}
          <a href="mailto:support@qaldating.com" className="text-primary hover:underline">support@qaldating.com</a>
        </p>
        <p>
          Please include &ldquo;Child Safety&rdquo; in the subject line so
          your report reaches the responsible team quickly. This contact is
          monitored for reports relating to CSAE, CSAM, suspected underage
          users, and related child safety matters.
        </p>
        <p>
          This inbox is not an emergency service. If a child is in immediate
          danger, contact your local emergency services or law-enforcement
          authority.
        </p>
      </Section>

      {/* Section 10 */}
      <Section number="10" title="Changes to These Standards">
        <p>We may update these Standards to reflect:</p>
        <List
          items={[
            "changes to Qal Dating;",
            "new safety risks;",
            "user feedback;",
            "changes in law;",
            "app-store requirements; or",
            "improvements to our moderation and child-protection practices.",
          ]}
        />
        <p>
          The updated version will show a revised &ldquo;Last updated&rdquo;
          date. Where changes are material, we may notify you through the app,
          website, email, or another appropriate method.
        </p>
      </Section>

      {/* Section 11 */}
      <Section number="11" title="Contact Us">
        <p>
          For questions, reports, or concerns relating to these Child Safety
          Standards, contact:
        </p>
        <div className="space-y-1">
          <p><strong>Qal Dating</strong></p>
          <p>Operated by <strong>[YOUR FULL LEGAL NAME], trading as Qal Dating</strong></p>
          <p><strong>Business address:</strong> [YOUR BUSINESS ADDRESS]</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaldating.com" className="text-primary hover:underline">support@qaldating.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="http://www.qaldating.com" className="text-primary hover:underline">www.qaldating.com</a>
          </p>
        </div>
      </Section>

      <p className="text-text-secondary italic text-sm pt-4 border-t border-border">
        These Child Safety Standards are provided for informational purposes
        and do not constitute legal advice. You should have a qualified
        solicitor review this document before publication.
      </p>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 mb-8">
      <h2 className="text-xl font-bold text-text-primary">
        {number}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
