export function SafetyTipsContent() {
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
      <Section number="1" title="Your Safety Comes First">
        <p>
          Qaliye is designed to help adults in Ethiopian, Eritrean, and wider
          Habesha communities form genuine and meaningful connections.
        </p>
        <p>
          These safety tips are provided for general guidance and do not
          guarantee your safety. They should be read alongside our{" "}
          <a href="/terms" className="text-primary hover:underline">Terms of Use</a>,{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, and{" "}
          <a href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</a>.
        </p>
        <p>
          Most people use dating apps with good intentions, but meeting someone
          new always requires care. Take your time, protect your personal
          information, respect your instincts, and use Qaliye&rsquo;s reporting
          and blocking tools whenever necessary.
        </p>
        <p>
          No Like, match, message, cultural connection, family connection, or
          shared background guarantees that someone is safe or trustworthy.
        </p>
      </Section>

      {/* Section 2 */}
      <Section number="2" title="Take Time to Get to Know Someone">
        <p>Do not feel pressured to move quickly.</p>
        <p>Before meeting someone in person:</p>
        <List
          items={[
            "spend time talking through Qaliye;",
            "ask reasonable questions about their life and intentions;",
            "look for consistency in what they tell you;",
            "consider having a voice or video call;",
            "pay attention to behaviour that feels controlling or suspicious; and",
            "avoid making major emotional or financial commitments too early.",
          ]}
        />
        <p>Be cautious if someone:</p>
        <List
          items={[
            "declares strong feelings immediately;",
            "pressures you to leave Qaliye quickly;",
            "avoids reasonable questions;",
            "repeatedly refuses voice or video calls;",
            "gives inconsistent information;",
            "becomes angry when you set boundaries; or",
            "pressures you to meet before you feel ready.",
          ]}
        />
        <p>You are never required to continue a conversation or relationship.</p>
      </Section>

      {/* Section 3 */}
      <Section number="3" title="Keep Early Conversations on Qaliye">
        <p>
          Keeping early communication within Qaliye may make it easier to
          report inappropriate behaviour and provide relevant information
          during a safety investigation.
        </p>
        <p>Be cautious if someone immediately asks you to move to:</p>
        <List
          items={[
            "WhatsApp;",
            "Telegram;",
            "another messaging application;",
            "personal email;",
            "social media; or",
            "private telephone calls.",
          ]}
        />
        <p>
          Moving to another platform is not automatically unsafe, but do not do
          so until you feel comfortable.
        </p>
        <p>
          Once communication leaves Qaliye, our ability to review or respond to
          harmful behaviour may be limited.
        </p>
      </Section>

      {/* Section 4 */}
      <Section number="4" title="Protect Your Personal Information">
        <p>Avoid sharing sensitive information too early.</p>
        <p>This includes:</p>
        <List
          items={[
            "your full home address;",
            "your exact workplace;",
            "your daily routine;",
            "your child&rsquo;s school or childcare location;",
            "passport or identification documents;",
            "immigration documents;",
            "bank details;",
            "payment-card information;",
            "passwords;",
            "verification codes;",
            "national insurance or tax information;",
            "private medical information; and",
            "information that could be used to answer security questions.",
          ]}
        />
        <p>Think carefully before sharing your:</p>
        <List
          items={[
            "full legal name;",
            "telephone number;",
            "personal email address;",
            "social-media accounts;",
            "workplace details;",
            "live location; or",
            "family information.",
          ]}
        />
        <p>Review photographs before uploading them. A photograph may unintentionally reveal:</p>
        <List
          items={[
            "your home address;",
            "car registration;",
            "workplace;",
            "child&rsquo;s school;",
            "identification documents; or",
            "another person&rsquo;s private information.",
          ]}
        />
      </Section>

      {/* Section 5 */}
      <Section number="5" title="Never Send Money">
        <p>
          Never send money or provide financial information to someone you have
          met through Qaliye, especially someone you have not met in person.
        </p>
        <p>Be suspicious of requests involving:</p>
        <List
          items={[
            "emergency expenses;",
            "medical bills;",
            "travel costs;",
            "visas or immigration fees;",
            "legal fees;",
            "family emergencies;",
            "customs charges;",
            "loans;",
            "mobile-money transfers;",
            "gift cards;",
            "cryptocurrency;",
            "investments;",
            "business opportunities;",
            "packages that supposedly require payment; or",
            "money needed to visit or marry you.",
          ]}
        />
        <p>
          Scammers may spend weeks or months building trust before asking for
          money.
        </p>
        <p>Do not provide:</p>
        <List
          items={[
            "bank-account details;",
            "card numbers;",
            "PINs;",
            "passwords;",
            "one-time verification codes;",
            "online banking access; or",
            "copies of financial documents.",
          ]}
        />
        <p>
          A genuine romantic relationship should not depend on secret, urgent,
          or repeated financial requests.
        </p>
        <p>
          If someone asks you for money, stop the transaction and report the
          account.
        </p>
      </Section>

      {/* Section 6 */}
      <Section number="6" title="Be Alert to Romance Scams">
        <p>
          Romance scammers may create convincing profiles and pretend to be
          emotionally committed.
        </p>
        <p>Warning signs may include someone who:</p>
        <List
          items={[
            "says they are in love unusually quickly;",
            "claims to live nearby but is always unable to meet;",
            "claims to work abroad, in the military, on an oil rig, or in another difficult-to-verify role;",
            "repeatedly experiences emergencies;",
            "asks you to receive or transfer money;",
            "asks you to open a bank or cryptocurrency account;",
            "asks you to accept deliveries or packages;",
            "sends suspicious links;",
            "requests intimate photographs and later threatens to share them;",
            "pressures you to keep the relationship secret; or",
            "discourages you from discussing the relationship with family or friends.",
          ]}
        />
        <p>
          Do not allow someone to use your bank account to receive or transfer
          money. You could unknowingly become involved in fraud or money
          laundering.
        </p>
      </Section>

      {/* Section 7 */}
      <Section number="7" title="Confirm That the Person Is Genuine">
        <p>
          Before meeting, consider taking reasonable steps to confirm the
          person&rsquo;s identity.
        </p>
        <p>You may:</p>
        <List
          items={[
            "request a live voice or video call;",
            "check that their appearance matches their photographs;",
            "ask normal questions about their profile;",
            "look for major inconsistencies; and",
            "use Qaliye&rsquo;s verification information where available.",
          ]}
        />
        <p>
          Verification can reduce some risks, but it does not guarantee that a
          person is safe, truthful, or suitable for you.
        </p>
        <p>
          Do not carry out harassment, stalking, unauthorised background
          checks, or invasive searches.
        </p>
      </Section>

      {/* Section 8 */}
      <Section number="8" title="Do Not Share Intimate Content">
        <p>Think carefully before sending intimate photographs or videos.</p>
        <p>Once content has been sent, the recipient may:</p>
        <List
          items={[
            "take a screenshot;",
            "record it;",
            "save it;",
            "copy it; or",
            "share it outside Qaliye.",
          ]}
        />
        <p>Never send intimate content under pressure.</p>
        <p>
          Do not include your face, address, workplace, identification
          documents, or other identifying details in sensitive content.
        </p>
        <p>If someone threatens to share your private or intimate content:</p>
        <List
          items={[
            "do not pay them;",
            "save available evidence;",
            "stop communicating where safe;",
            "block and report the account;",
            "contact the relevant platform;",
            "contact local law enforcement where appropriate; and",
            "seek support from a trusted person or specialist organisation.",
          ]}
        />
        <p>
          Threatening to share intimate content is abusive and may be unlawful.
        </p>
        <p>
          Qaliye prohibits nudity, pornography, unsolicited sexual content, and
          non-consensual intimate content.
        </p>
      </Section>

      {/* Section 9 */}
      <Section number="9" title="Respect Consent and Boundaries">
        <p>A match does not create consent.</p>
        <p>Consent must be:</p>
        <List
          items={[
            "freely given;",
            "specific;",
            "informed;",
            "mutual; and",
            "capable of being withdrawn at any time.",
          ]}
        />
        <p>Someone may change their mind at any stage.</p>
        <p>Never pressure another person to:</p>
        <List
          items={[
            "reply;",
            "share their telephone number;",
            "send photographs;",
            "discuss sexual topics;",
            "meet in person;",
            "drink alcohol;",
            "go to a private location;",
            "enter a relationship; or",
            "engage in physical or sexual activity.",
          ]}
        />
        <p>
          Clearly communicate your own boundaries and respect the other
          person&rsquo;s boundaries.
        </p>
        <p>
          Silence, hesitation, fear, intoxication, or previous consent should
          not be treated as current consent.
        </p>
      </Section>

      {/* Section 10 */}
      <Section number="10" title="Plan the First Meeting Carefully">
        <p>For your first meetings, choose a populated public place such as:</p>
        <List
          items={[
            "a caf\u00E9;",
            "a restaurant;",
            "a shopping centre;",
            "a museum;",
            "a public park during busy daylight hours; or",
            "another public venue.",
          ]}
        />
        <p>Avoid meeting for the first time:</p>
        <List
          items={[
            "at your home;",
            "at their home;",
            "in an isolated location;",
            "in a hotel room;",
            "in a private vehicle;",
            "late at night in an unfamiliar place; or",
            "somewhere without reliable transport or mobile reception.",
          ]}
        />
        <p>
          Do not allow cultural expectations, family pressure, embarrassment, or
          fear of appearing rude to override your safety.
        </p>
        <p>You may cancel or leave a meeting at any time.</p>
      </Section>

      {/* Section 11 */}
      <Section number="11" title="Tell Someone About Your Plans">
        <p>Before meeting someone, tell a trusted friend or family member:</p>
        <List
          items={[
            "the person&rsquo;s name;",
            "their Qaliye profile information;",
            "where you are meeting;",
            "the date and time;",
            "when you expect to return; and",
            "how you plan to travel.",
          ]}
        />
        <p>Consider:</p>
        <List
          items={[
            "sharing a screenshot of the profile;",
            "arranging a check-in time;",
            "agreeing on a code word;",
            "sharing your live location with a trusted person; and",
            "asking someone to call you during the meeting.",
          ]}
        />
        <p>Do not rely on the person you are meeting for your only way home.</p>
      </Section>

      {/* Section 12 */}
      <Section number="12" title="Arrange Your Own Transportation">
        <p>Travel to and from the meeting independently where possible.</p>
        <p>Avoid allowing someone you have just met to:</p>
        <List
          items={[
            "collect you from your home;",
            "learn your home address;",
            "drive you to an unfamiliar place;",
            "control when you can leave; or",
            "take possession of your telephone, keys, or belongings.",
          ]}
        />
        <p>Keep enough money and battery power to return home safely.</p>
        <p>
          Know the location of nearby transport, taxis, public areas, or staff
          who can help.
        </p>
      </Section>

      {/* Section 13 */}
      <Section number="13" title="Protect Your Food and Drinks">
        <p>During an in-person meeting:</p>
        <List
          items={[
            "keep your food and drinks with you;",
            "do not accept an opened drink from someone you do not trust;",
            "avoid leaving a drink unattended;",
            "watch staff prepare or serve drinks where possible;",
            "be cautious about drinking too much alcohol; and",
            "do not use substances that reduce your awareness or judgement.",
          ]}
        />
        <p>If you suddenly feel unusually:</p>
        <List
          items={[
            "dizzy;",
            "confused;",
            "sleepy;",
            "sick; or",
            "physically unwell,",
          ]}
        />
        <p>
          seek help from venue staff, a trusted person, emergency services, or
          medical professionals.
        </p>
        <p>Do not leave with the person if you feel unsafe.</p>
      </Section>

      {/* Section 14 */}
      <Section number="14" title="Trust Your Instincts">
        <p>
          You do not need proof that something is wrong before ending an
          interaction.
        </p>
        <p>Pay attention if someone:</p>
        <List
          items={[
            "ignores your boundaries;",
            "becomes possessive or controlling;",
            "monitors your location;",
            "demands access to your telephone;",
            "insults or humiliates you;",
            "threatens you;",
            "pressures you for sex, marriage, money, or immigration support;",
            "attempts to isolate you from friends or family;",
            "uses culture or religion to control you;",
            "refuses to accept rejection; or",
            "makes you feel afraid or uncomfortable.",
          ]}
        />
        <p>You may:</p>
        <List
          items={[
            "stop responding;",
            "unmatch;",
            "block;",
            "report;",
            "cancel a meeting; or",
            "leave immediately.",
          ]}
        />
        <p>Your safety is more important than being polite.</p>
      </Section>

      {/* Section 15 */}
      <Section number="15" title="Cultural and Family Considerations">
        <p>
          Qaliye respects the importance that culture, religion, tradition, and
          family may have in Habesha relationships.
        </p>
        <p>However, no cultural or family expectation justifies:</p>
        <List
          items={[
            "forced marriage;",
            "coercion;",
            "threats;",
            "surveillance;",
            "emotional abuse;",
            "financial exploitation;",
            "sexual pressure;",
            "honour-based abuse;",
            "violence; or",
            "controlling behaviour.",
          ]}
        />
        <p>You have the right to decide:</p>
        <List
          items={[
            "who you communicate with;",
            "whether you meet;",
            "whether you continue a relationship;",
            "whether you involve family;",
            "whether you marry; and",
            "when you end contact.",
          ]}
        />
        <p>
          Seek confidential professional help if you believe you are facing
          forced marriage, honour-based abuse, domestic abuse, or family
          coercion.
        </p>
      </Section>

      {/* Section 16 */}
      <Section number="16" title="Long-Distance and International Relationships">
        <p>Be particularly careful when communicating across different countries.</p>
        <p>International dating may involve additional risks involving:</p>
        <List
          items={[
            "false identity;",
            "travel scams;",
            "visa or immigration scams;",
            "requests for sponsorship;",
            "money-transfer fraud;",
            "fake shipping or customs charges;",
            "legal and cultural differences; and",
            "difficulty verifying personal information.",
          ]}
        />
        <p>Do not:</p>
        <List
          items={[
            "pay for someone&rsquo;s visa without careful independent verification;",
            "send identification or immigration documents unnecessarily;",
            "agree to sponsor someone under pressure;",
            "enter a marriage solely to assist immigration;",
            "accept suspicious packages;",
            "transfer money on someone&rsquo;s behalf; or",
            "rely only on documents sent by the person.",
          ]}
        />
        <p>
          Seek independent legal advice before making significant immigration,
          financial, or marriage commitments.
        </p>
      </Section>

      {/* Section 17 */}
      <Section number="17" title="Protect Children and Family Members">
        <p>Qaliye is for adults aged 18 and over.</p>
        <p>Do not:</p>
        <List
          items={[
            "allow a child to use your account;",
            "create a profile for a child;",
            "involve children in adult dating conversations;",
            "share a child&rsquo;s address, school, routine, or identifying information;",
            "use children to pressure another user; or",
            "send inappropriate content involving children.",
          ]}
        />
        <p>
          Be careful about introducing a new partner to your children. Take time
          to establish trust and consider the child&rsquo;s wellbeing.
        </p>
        <p>Report any account that appears to belong to someone under 18.</p>
        <p>
          Any suspected sexual exploitation or endangerment of a child should be
          reported immediately to the appropriate authorities.
        </p>
      </Section>

      {/* Section 18 */}
      <Section number="18" title="Health and Sexual Safety">
        <p>Before sexual activity, communicate openly about:</p>
        <List
          items={[
            "consent;",
            "contraception;",
            "sexually transmitted infections;",
            "testing;",
            "protection;",
            "pregnancy intentions; and",
            "personal boundaries.",
          ]}
        />
        <p>
          Use appropriate protection and seek advice from qualified healthcare
          professionals.
        </p>
        <p>Do not rely only on another person&rsquo;s statements about their health.</p>
        <p>
          Never remove or interfere with contraception or protection without
          the other person&rsquo;s knowledge and consent.
        </p>
        <p>Qaliye does not provide medical advice.</p>
      </Section>

      {/* Section 19 */}
      <Section number="19" title="If Someone Harasses or Threatens You">
        <p>When safe to do so:</p>
        <OrderedList
          items={[
            "stop communicating;",
            "save relevant evidence;",
            "use Qaliye&rsquo;s Block feature;",
            "submit an in-app report;",
            "tell a trusted person;",
            "review your privacy and location settings; and",
            "contact law enforcement or emergency services where appropriate.",
          ]}
        />
        <p>Evidence may include:</p>
        <List
          items={[
            "screenshots;",
            "messages;",
            "profile information;",
            "dates and times;",
            "payment requests;",
            "telephone numbers; and",
            "external account details.",
          ]}
        />
        <p>Do not put yourself at additional risk to collect evidence.</p>
      </Section>

      {/* Section 20 */}
      <Section number="20" title="Blocking and Reporting on Qaliye">
        <p>
          Use <strong>Block</strong> when you do not want another person to
          contact or interact with you.
        </p>
        <p>
          Use <strong>Report</strong> when you believe someone has violated
          Qaliye&rsquo;s Community Guidelines.
        </p>
        <p>You can report concerns such as:</p>
        <List
          items={[
            "suspected underage users;",
            "fake profiles;",
            "impersonation;",
            "harassment;",
            "threats;",
            "hate speech;",
            "nudity or sexual content;",
            "unsolicited intimate images;",
            "scams;",
            "requests for money;",
            "spam;",
            "stalking;",
            "violence; or",
            "other unsafe behaviour.",
          ]}
        />
        <p>
          Blocking and reporting are separate actions. Where appropriate, use
          both.
        </p>
        <p>You do not need to inform someone before blocking or reporting them.</p>
        <p>
          Qaliye may review relevant account information, profile content, and
          messages where reasonably necessary to investigate a report.
        </p>
      </Section>

      {/* Section 21 */}
      <Section number="21" title="If You Are in Immediate Danger">
        <p>Qaliye is not an emergency service.</p>
        <p>If you or another person is in immediate danger:</p>
        <List
          items={[
            "move to a safe public place if possible;",
            "contact your local emergency services;",
            "alert venue staff, security personnel, or someone nearby;",
            "contact a trusted friend or family member; and",
            "seek medical assistance where necessary.",
          ]}
        />
        <p>
          In the United Kingdom, call <strong>999</strong> or{" "}
          <strong>112</strong> in an emergency.
        </p>
        <p>
          Do not wait for Qaliye support to respond before contacting emergency
          services.
        </p>
      </Section>

      {/* Section 22 */}
      <Section number="22" title="Contact Qaliye">
        <p>
          For non-emergency safety concerns, reports, or questions, use the
          reporting tools inside the application or contact:
        </p>
        <div className="space-y-1">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="http://www.qaliye.com" className="text-primary hover:underline">www.qaliye.com</a>
          </p>
        </div>
        <p>
          When contacting us, provide relevant details without sending
          unnecessary sensitive information.
        </p>
      </Section>

      {/* Section 23 */}
      <Section number="23" title="Final Reminder">
        <p>Take your time.</p>
        <p>Protect your personal and financial information.</p>
        <p>
          Never send money to someone you have met through a dating platform.
        </p>
        <p>
          Meet in public, tell someone where you are going, arrange your own
          transportation, respect consent, and leave whenever you feel unsafe.
        </p>
        <p>
          You are always allowed to say no, stop communicating, unmatch, block,
          report, or ask for help.
        </p>
      </Section>

      <p className="text-text-secondary italic text-sm pt-4 border-t border-border">
        These Safety Tips are provided for informational purposes and do not
        constitute legal advice. You should have a qualified solicitor review
        this document before publication.
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

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal list-inside text-text-secondary leading-relaxed space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}
