export function CommunityGuidelinesContent() {
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
      <Section number="1" title="Welcome to Qaliye">
        <p>
          Qaliye is a dating and relationship platform designed primarily for
          Habesha communities, including Ethiopian and Eritrean people and
          members of the global diaspora.
        </p>
        <p>
          Our goal is to help adults form genuine, respectful, and meaningful
          connections while respecting the cultures, traditions, values,
          languages, and diversity of our communities.
        </p>
        <p>Everyone using Qaliye must follow these Community Guidelines.</p>
        <p>These Guidelines apply to:</p>
        <List
          items={[
            "profiles and biographies;",
            "profile photographs;",
            "Likes, Super Likes, and matches;",
            "text messages;",
            "image messages;",
            "interactions with Qaliye support;",
            "reports and appeals;",
            "behaviour during meetings arranged through Qaliye; and",
            "any other activity connected with the Services.",
          ]}
        />
        <p>
          These Guidelines form part of the Qaliye{" "}
          <a href="/terms" className="text-primary hover:underline">Terms of Use</a>{" "}
          and should be read alongside our{" "}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
        <p>
          By creating an account, uploading content, or interacting with
          another user, you agree to follow these Guidelines.
        </p>
      </Section>

      {/* Section 2 */}
      <Section number="2" title="Adults Only">
        <p>Qaliye is strictly for people aged 18 and over.</p>
        <p>You must not:</p>
        <List
          items={[
            "create an account if you are under 18;",
            "provide a false date of birth;",
            "create or operate an account for a person under 18;",
            "allow a person under 18 to use your account;",
            "pretend to be an adult;",
            "use Qaliye to contact or pursue a person you know or suspect is under 18; or",
            "upload content that sexually depicts, exploits, endangers, or targets a child.",
          ]}
        />
        <p>
          Profile photographs must clearly represent the adult account holder.
          Do not use a photograph of a child as your primary profile
          photograph.
        </p>
        <p>
          Any sexual content involving a person under 18 is strictly prohibited
          and may be reported to the relevant safeguarding or law-enforcement
          authorities.
        </p>
        <p>
          If you believe someone using Qaliye is under 18, report the account
          immediately through the in-app reporting feature or contact{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
        </p>
      </Section>

      {/* Section 3 */}
      <Section number="3" title="Treat Everyone With Respect">
        <p>
          Qaliye is a community of real people. Treat others with dignity,
          patience, and respect.
        </p>
        <p>You must not:</p>
        <List
          items={[
            "insult, humiliate, or deliberately embarrass another person;",
            "bully or intimidate someone;",
            "make degrading comments about a person&rsquo;s appearance or background;",
            "repeatedly contact someone who has asked you to stop;",
            "pressure someone to reply, match, meet, or continue a relationship;",
            "encourage others to target or harass a user;",
            "use aggressive, threatening, or abusive language; or",
            "retaliate against someone for rejecting, unmatching, blocking, or reporting you.",
          ]}
        />
        <p>
          Rejection is part of dating. A Like, match, conversation, date, or
          previous relationship does not create an obligation to continue
          communicating.
        </p>
        <p>
          Respect another person&rsquo;s decision to say no, stop replying,
          unmatch, block, or end contact.
        </p>
      </Section>

      {/* Section 4 */}
      <Section number="4" title="Respect Habesha Cultures and Traditions">
        <p>
          Qaliye celebrates Ethiopian and Eritrean cultures and the wider
          Habesha community.
        </p>
        <p>Users may have different:</p>
        <List
          items={[
            "ethnic backgrounds;",
            "national identities;",
            "religions;",
            "languages;",
            "traditions;",
            "political views;",
            "family expectations;",
            "lifestyles; and",
            "approaches to dating and marriage.",
          ]}
        />
        <p>Cultural pride is welcome. Cultural hostility is not.</p>
        <p>You must not:</p>
        <List
          items={[
            "insult or degrade Ethiopian or Eritrean ethnic groups;",
            "promote conflict between national, ethnic, religious, or linguistic communities;",
            "use ethnic slurs or dehumanising language;",
            "shame users for speaking or not speaking a particular language;",
            "attack someone for being from Ethiopia, Eritrea, or the diaspora;",
            "mock someone&rsquo;s accent, immigration history, refugee history, or cultural background;",
            "use culture, religion, or tradition to justify harassment or control; or",
            "pressure someone to follow beliefs or customs they do not share.",
          ]}
        />
        <p>
          Respecting culture also means respecting individual choice, personal
          boundaries, and consent.
        </p>
      </Section>

      {/* Section 5 */}
      <Section number="5" title="No Hate Speech or Discrimination">
        <p>
          Qaliye does not permit hatred, abuse, exclusion, or dehumanisation
          based on a person&rsquo;s actual or perceived:
        </p>
        <List
          items={[
            "race;",
            "ethnicity;",
            "nationality;",
            "religion;",
            "language;",
            "gender;",
            "sexual orientation;",
            "disability;",
            "age;",
            "immigration status;",
            "social background; or",
            "other legally protected characteristic.",
          ]}
        />
        <p>You must not:</p>
        <List
          items={[
            "use hateful slurs;",
            "promote racial, ethnic, or religious superiority;",
            "call for exclusion, segregation, violence, or harm;",
            "praise organisations or individuals associated with hate or violent extremism;",
            "mock a disability or medical condition;",
            "compare a protected group to animals, diseases, or criminals; or",
            "target a user with degrading stereotypes.",
          ]}
        />
        <p>
          You may express lawful personal dating preferences through
          Qaliye&rsquo;s available preference controls. You must not use those
          preferences as a reason to insult, shame, or harass other people.
        </p>
      </Section>

      {/* Section 6 */}
      <Section number="6" title="Be Genuine">
        <p>Qaliye is for authentic adult dating and relationship-building.</p>
        <p>You must:</p>
        <List
          items={[
            "use your genuine age;",
            "use photographs that accurately represent you;",
            "provide information that is substantially truthful;",
            "correct important information that becomes inaccurate; and",
            "use your own account.",
          ]}
        />
        <p>You must not:</p>
        <List
          items={[
            "impersonate another person;",
            "use another person&rsquo;s photographs without permission;",
            "pretend to be a celebrity, public figure, business, or Qaliye employee;",
            "create a fictional or deceptive identity;",
            "misrepresent your age, gender, relationship status, intentions, location, profession, or identity;",
            "use heavily altered, stolen, AI-generated, or misleading photographs to deceive users;",
            "use AI-generated text, voice, or video content to impersonate a real person or deceive users (including deepfakes);",
            "create multiple accounts to manipulate or deceive people;",
            "create an account on behalf of someone else without permission;",
            "share, sell, rent, or transfer an account; or",
            "return using a new account after being banned.",
          ]}
        />
        <p>
          Minor photo adjustments such as cropping, brightness correction, or
          colour correction may be acceptable. Editing that materially changes
          your face, body, age, or identity may be treated as misleading.
        </p>
        <p>
          Verification does not guarantee that a user is safe, trustworthy, or
          truthful in every respect.
        </p>
      </Section>

      {/* Section 7 */}
      <Section number="7" title="Use Recent and Appropriate Profile Photographs">
        <p>
          Your profile photographs should help other users understand who they
          are communicating with.
        </p>
        <p>Profile photographs must:</p>
        <List
          items={[
            "show the adult account holder;",
            "be reasonably clear and recognisable;",
            "belong to you or be used with permission;",
            "avoid exposing another person&rsquo;s private information; and",
            "comply with these Guidelines.",
          ]}
        />
        <p>You must not upload:</p>
        <List
          items={[
            "photographs that do not include you while presenting them as your identity;",
            "photographs of another person intended to mislead users;",
            "explicit nudity;",
            "pornographic or sexually graphic images;",
            "photographs focused on genitalia, buttocks, or breasts;",
            "sexually suggestive images intended primarily to solicit sexual activity;",
            "images involving exploitation, coercion, or abuse;",
            "images of illegal activity;",
            "violent or disturbing images;",
            "photographs displaying private identifying documents;",
            "photographs taken in private without the subject&rsquo;s consent; or",
            "images that infringe another person&rsquo;s copyright or privacy.",
          ]}
        />
        <p>
          Group photographs may be permitted, but other people must not be
          presented misleadingly as the account holder.
        </p>
        <p>
          Do not use a photograph of a child as your main profile photograph or
          upload photographs that expose a child&rsquo;s private or identifying
          information.
        </p>
      </Section>

      {/* Section 8 */}
      <Section number="8" title="No Nudity, Pornography, or Explicit Sexual Content">
        <p>
          Qaliye is a dating platform, not an adult-content or pornography
          platform.
        </p>
        <p>You must not upload, send, request, promote, or distribute:</p>
        <List
          items={[
            "nudity;",
            "pornography;",
            "sexually explicit photographs or recordings;",
            "images of sexual acts;",
            "genital images;",
            "unsolicited intimate images;",
            "fetish content intended primarily for sexual gratification;",
            "sexual violence;",
            "non-consensual sexual content;",
            "secretly recorded intimate content; or",
            "manipulated or AI-generated sexual images of a real person.",
          ]}
        />
        <p>This restriction applies to:</p>
        <List
          items={[
            "profile photographs;",
            "biographies;",
            "private messages;",
            "image messages; and",
            "links to content hosted elsewhere.",
          ]}
        />
        <p>
          Qaliye uses automated photo-moderation technology, including Amazon
          Rekognition, to check photographs for suspected nudity and sexual
          content.
        </p>
        <p>
          A photograph may be rejected, hidden, removed, or referred for
          additional review. You may be asked to upload a different photograph.
        </p>
        <p>
          Attempting to bypass photo moderation may result in account
          restrictions or removal.
        </p>
      </Section>

      {/* Section 9 */}
      <Section number="9" title="Consent and Sexual Boundaries">
        <p>All romantic and sexual communication must be consensual.</p>
        <p>You must not:</p>
        <List
          items={[
            "send sexual messages without reasonable indication that they are welcome;",
            "send an intimate image without clear consent;",
            "pressure someone to send photographs or recordings;",
            "pressure someone to discuss sexual topics;",
            "continue sexual communication after being asked to stop;",
            "threaten to share intimate content;",
            "use private content to control, shame, or blackmail someone;",
            "record an intimate interaction without consent;",
            "distribute another person&rsquo;s intimate content without permission; or",
            "attempt to obtain sexual content through deception, threats, or manipulation.",
          ]}
        />
        <p>A match is not consent.</p>
        <p>
          Past consent does not mean ongoing consent. A person may withdraw
          consent at any time.
        </p>
      </Section>

      {/* Section 10 */}
      <Section number="10" title="No Sexual Services, Exploitation, or Compensated Dating">
        <p>Qaliye must not be used to advertise, request, provide, arrange, or promote:</p>
        <List
          items={[
            "prostitution;",
            "escort services;",
            "sexual services;",
            "sex trafficking;",
            "sexual exploitation;",
            "compensated sexual arrangements;",
            "\u201Csugar dating\u201D arrangements;",
            "relationships in which money, gifts, accommodation, immigration support, or financial assistance are expected in exchange for sexual or romantic access; or",
            "recruitment for pornography or adult entertainment.",
          ]}
        />
        <p>
          Users must not exploit another person&rsquo;s financial, immigration,
          employment, housing, or personal circumstances for sexual or romantic
          purposes.
        </p>
      </Section>

      {/* Section 11 */}
      <Section number="11" title="No Harassment, Stalking, or Threats">
        <p>You must not:</p>
        <List
          items={[
            "repeatedly message someone after they ask you to stop;",
            "create another account to contact someone who blocked you;",
            "follow, monitor, or track someone without permission;",
            "threaten violence, exposure, deportation, job loss, family consequences, or reputational harm;",
            "publish or threaten to publish private information;",
            "organise others to intimidate or target a user;",
            "appear unexpectedly at someone&rsquo;s home, workplace, school, or regular location;",
            "use location information to monitor someone;",
            "make credible threats of self-harm to manipulate another user; or",
            "use Qaliye to facilitate domestic abuse or coercive control.",
          ]}
        />
        <p>
          Immediate threats should be reported to local emergency services.
          Qaliye&rsquo;s reporting system is not an emergency service.
        </p>
      </Section>

      {/* Section 12 */}
      <Section number="12" title="No Violence or Dangerous Conduct">
        <p>You must not post, send, threaten, encourage, praise, or organise:</p>
        <List
          items={[
            "physical violence;",
            "murder or serious injury;",
            "terrorism or violent extremism;",
            "kidnapping;",
            "human trafficking;",
            "forced marriage;",
            "honour-based violence;",
            "female genital mutilation;",
            "dangerous challenges;",
            "animal cruelty; or",
            "criminal activity that may cause harm.",
          ]}
        />
        <p>
          Discussion of difficult personal experiences may be allowed when it is
          shared safely and does not promote or threaten harm.
        </p>
        <p>
          Content may be removed where it creates a credible safety risk, even
          when presented as a joke.
        </p>
      </Section>

      {/* Section 13 */}
      <Section number="13" title="No Scams or Financial Exploitation">
        <p>Never use Qaliye to deceive or financially exploit another person.</p>
        <p>You must not:</p>
        <List
          items={[
            "request money from users through false or manipulative stories;",
            "ask for bank details, passwords, PINs, verification codes, or payment credentials;",
            "promote fake investments or cryptocurrency schemes;",
            "offer fraudulent employment or business opportunities;",
            "run romance, inheritance, visa, immigration, emergency, or travel scams;",
            "request gift cards, mobile-money transfers, cryptocurrency, or loans under suspicious circumstances;",
            "impersonate a charity or person in need;",
            "sell fake products or services;",
            "conduct pyramid, referral, or multi-level marketing schemes;",
            "use stolen payment methods;",
            "perform payment fraud or chargeback abuse; or",
            "manipulate a user into providing financial support.",
          ]}
        />
        <p>Do not send money to someone you have met only through Qaliye.</p>
        <p>Report suspected scams immediately.</p>
      </Section>

      {/* Section 14 */}
      <Section number="14" title="No Spam, Advertising, or Unauthorised Commercial Use">
        <p>Qaliye is intended for personal dating and relationships.</p>
        <p>Without written permission from Qaliye, you must not:</p>
        <List
          items={[
            "advertise products or services;",
            "promote a business, event, political campaign, social-media account, or commercial website;",
            "recruit users for employment, investment, sales, or religious organisations;",
            "send repetitive or mass-produced messages;",
            "collect contact details for marketing;",
            "promote referral codes;",
            "solicit donations;",
            "buy or sell accounts;",
            "sell access to users or profile information; or",
            "use Qaliye primarily to gain followers or traffic on another platform.",
          ]}
        />
        <p>
          Mentioning your genuine profession or business in your profile is
          generally acceptable when it is relevant personal information and is
          not used as advertising or solicitation.
        </p>
      </Section>

      {/* Section 15 */}
      <Section number="15" title="Protect Privacy and Confidentiality">
        <p>Respect the privacy of other users.</p>
        <p>You must not share, publish, sell, or misuse another person&rsquo;s:</p>
        <List
          items={[
            "home address;",
            "workplace address;",
            "telephone number;",
            "email address;",
            "financial information;",
            "identification documents;",
            "immigration documents;",
            "private photographs;",
            "intimate content;",
            "medical information;",
            "private messages;",
            "live location; or",
            "other confidential information",
          ]}
        />
        <p>without permission or another lawful reason.</p>
        <p>You must not:</p>
        <List
          items={[
            "threaten to expose someone;",
            "encourage harassment outside Qaliye;",
            "secretly record calls or meetings where prohibited;",
            "post screenshots to shame or identify another user;",
            "share information received through Qaliye for commercial purposes; or",
            "attempt to discover information that another user has chosen not to share.",
          ]}
        />
        <p>
          Protect your own privacy as well. Avoid sharing sensitive personal or
          financial information with people you have not established trust
          with.
        </p>
      </Section>

      {/* Section 16 */}
      <Section number="16" title="Respect Intellectual Property">
        <p>Only upload content that you own or have permission to use.</p>
        <p>You must not:</p>
        <List
          items={[
            "use another person&rsquo;s photographs without permission;",
            "upload copyrighted images, audio, text, or artwork unlawfully;",
            "copy another user&rsquo;s profile;",
            "misuse Qaliye&rsquo;s name, logo, designs, or software;",
            "falsely claim ownership of another person&rsquo;s work; or",
            "distribute content in violation of copyright, trademark, privacy, or publicity rights.",
          ]}
        />
        <p>
          Rights holders may contact{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>{" "}
          to report suspected infringement.
        </p>
      </Section>

      {/* Section 17 */}
      <Section number="17" title="Do Not Misuse the Platform">
        <p>
          You must not interfere with the operation, safety, or integrity of
          Qaliye.
        </p>
        <p>Prohibited activity includes:</p>
        <List
          items={[
            "using bots, scripts, crawlers, or automated accounts;",
            "scraping profiles, photographs, messages, or other data;",
            "attempting to access another user&rsquo;s account;",
            "testing or exploiting security vulnerabilities without authorisation;",
            "distributing malware or harmful links;",
            "interfering with servers, APIs, databases, or authentication systems;",
            "reverse engineering the application except where expressly permitted by law;",
            "manipulating Likes, matches, views, reports, rankings, or subscriptions;",
            "abusing free trials, refunds, credits, Boosts, or promotional offers;",
            "falsifying device, location, payment, or verification information;",
            "creating accounts to evade blocks or bans;",
            "submitting knowingly false reports;",
            "encouraging others to violate these Guidelines; or",
            "helping another person evade enforcement.",
          ]}
        />
        <p>
          Report suspected security vulnerabilities privately to{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
          Do not publicly disclose a vulnerability in a way that puts users at
          risk.
        </p>
      </Section>

      {/* Section 18 */}
      <Section number="18" title="Offline Behaviour Matters">
        <p>
          These Guidelines may apply to behaviour outside Qaliye when it
          involves someone you met through Qaliye or creates a serious risk to
          the community.
        </p>
        <p>We may take action based on credible information concerning:</p>
        <List
          items={[
            "violence or threats;",
            "sexual assault or coercion;",
            "stalking;",
            "fraud or theft;",
            "hate-motivated conduct;",
            "non-consensual sharing of intimate content;",
            "exploitation;",
            "conduct involving children;",
            "repeated harassment; or",
            "another serious safety concern.",
          ]}
        />
        <p>
          Qaliye does not investigate every personal disagreement or decide
          ordinary relationship disputes.
        </p>
        <p>
          We may act where off-platform conduct demonstrates that a user may
          pose a serious risk to others or has materially violated these
          Guidelines.
        </p>
      </Section>

      {/* Section 19 */}
      <Section number="19" title="Dating Safety">
        <p>When meeting someone from Qaliye:</p>
        <List
          items={[
            "take time to get to know them;",
            "keep early communication within Qaliye where practical;",
            "do not send money or financial information;",
            "avoid sharing your home or workplace address too early;",
            "meet for the first time in a populated public place;",
            "tell a trusted person where you are going;",
            "arrange your own transport;",
            "keep control of your food and drinks;",
            "avoid becoming impaired;",
            "keep your telephone charged;",
            "leave if you feel uncomfortable; and",
            "contact emergency services if you are in immediate danger.",
          ]}
        />
        <p>
          Verification, matching, or long conversations do not guarantee that
          someone is safe.
        </p>
        <p>
          Trust your judgement and use Qaliye&rsquo;s block and report tools
          when necessary.
        </p>
      </Section>

      {/* Section 20 */}
      <Section number="20" title="Reporting a User or Content">
        <p>
          Use the in-app <strong>Report</strong> feature when you believe a
          profile, photograph, message, or user violates these Guidelines.
        </p>
        <p>Reports may include concerns such as:</p>
        <List
          items={[
            "suspected underage user;",
            "fake profile or impersonation;",
            "nudity or sexual content;",
            "harassment or threats;",
            "hate speech;",
            "scam or financial solicitation;",
            "spam;",
            "inappropriate messages;",
            "stolen photographs;",
            "violence or dangerous behaviour; or",
            "another safety concern.",
          ]}
        />
        <p>
          Provide accurate information and relevant evidence where possible.
        </p>
        <p>
          Do not submit reports that are knowingly false, malicious,
          discriminatory, retaliatory, or intended to manipulate another user.
        </p>
        <p>For additional support, contact:</p>
        <p>
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
        </p>
        <p>
          For an immediate danger or suspected crime, contact your local
          emergency services or law-enforcement authority. Do not rely only on
          an in-app report during an emergency.
        </p>
        <p>
          Qaliye takes seriously its obligations under the UK Online Safety Act
          2023 to address illegal content and protect users. You can report
          illegal content through the in-app reporting feature or by contacting{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
          Further information about our safety policies is available in our
          Transparency Report, where published.
        </p>
      </Section>

      {/* Section 21 */}
      <Section number="21" title="Blocking a User">
        <p>
          You may use the in-app <strong>Block</strong> feature when you do not
          want another user to interact with you.
        </p>
        <p>Blocking may prevent the blocked user from:</p>
        <List
          items={[
            "viewing or discovering your profile;",
            "sending Likes or Super Likes;",
            "matching with you;",
            "sending messages;",
            "viewing your activity; or",
            "otherwise interacting with you through Qaliye.",
          ]}
        />
        <p>You do not need to warn someone before blocking them.</p>
        <p>
          A blocked user must not create another account or use another
          person&rsquo;s account to contact you.
        </p>
        <p>
          Blocking and reporting are separate actions. Blocking stops or limits
          contact, while reporting alerts Qaliye to a possible violation.
        </p>
        <p>Where appropriate, consider both blocking and reporting the user.</p>
      </Section>

      {/* Section 22 */}
      <Section number="22" title="How Qaliye Moderates Content">
        <p>Qaliye uses moderation methods that may include:</p>
        <List
          items={[
            "automated photo moderation;",
            "Amazon Rekognition;",
            "user reports;",
            "account and activity signals;",
            "technical fraud and safety controls;",
            "review by authorised personnel; and",
            "investigation of relevant profiles, photographs, and messages.",
          ]}
        />
        <p>
          Automated moderation may not always be accurate. Acceptable content
          may occasionally be flagged, and prohibited content may occasionally
          avoid detection.
        </p>
        <p>Qaliye may review reported or relevant content when reasonably necessary to:</p>
        <List
          items={[
            "investigate a report;",
            "protect users;",
            "respond to a support request;",
            "detect fraud or abuse;",
            "enforce these Guidelines;",
            "comply with law; or",
            "prevent serious harm.",
          ]}
        />
        <p>
          Do not assume that private messages are exempt from these Guidelines.
        </p>
      </Section>

      {/* Section 23 */}
      <Section number="23" title="Enforcement">
        <p>The action taken will depend on factors including:</p>
        <List
          items={[
            "the nature of the violation;",
            "its seriousness;",
            "the risk of harm;",
            "the surrounding context;",
            "whether the conduct was intentional;",
            "previous violations;",
            "cooperation with an investigation; and",
            "applicable legal requirements.",
          ]}
        />
        <p>Qaliye may:</p>
        <List
          items={[
            "provide guidance or a warning;",
            "reject an uploaded photograph;",
            "hide or remove content;",
            "restrict a feature;",
            "remove a Like or match;",
            "prevent communication;",
            "require additional verification;",
            "temporarily suspend an account;",
            "permanently ban an account;",
            "prevent the creation of replacement accounts;",
            "preserve relevant evidence;",
            "notify an app store, payment provider, or service provider;",
            "report suspected unlawful activity to authorities; or",
            "take another proportionate safety measure.",
          ]}
        />
        <p>
          Severe violations may result in immediate permanent removal without a
          previous warning.
        </p>
        <p>Examples include:</p>
        <List
          items={[
            "child sexual exploitation;",
            "credible threats of serious violence;",
            "sexual assault or coercion;",
            "trafficking or exploitation;",
            "non-consensual intimate content;",
            "serious fraud;",
            "repeated ban evasion; or",
            "conduct creating an immediate safety risk.",
          ]}
        />
        <p>
          Qaliye may take no action where available evidence does not establish
          a violation.
        </p>
        <p>
          For privacy and safety reasons, we may not disclose all information
          considered during an investigation or the complete action taken
          against another user.
        </p>
      </Section>

      {/* Section 24 */}
      <Section number="24" title="Appeals">
        <p>You may request a review if:</p>
        <List
          items={[
            "your photograph was rejected;",
            "your content was removed;",
            "a feature was restricted;",
            "your account was suspended; or",
            "your account was permanently banned.",
          ]}
        />
        <p>Send your appeal to:</p>
        <p>
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
        </p>
        <p>Include:</p>
        <List
          items={[
            "the email address or telephone number associated with your account;",
            "a clear explanation of the decision you are appealing;",
            "any relevant context or evidence; and",
            "why you believe the decision should be changed.",
          ]}
        />
        <p>Appeals must be respectful and truthful.</p>
        <p>
          Submitting an appeal does not guarantee that a decision will be
          reversed.
        </p>
        <p>
          We may decline repeated appeals that provide no new information or
          contain threats, harassment, or abuse.
        </p>
      </Section>

      {/* Section 25 */}
      <Section number="25" title="Changes to These Guidelines">
        <p>We may update these Guidelines to reflect:</p>
        <List
          items={[
            "changes to Qaliye;",
            "new safety risks;",
            "user feedback;",
            "changes in law;",
            "app-store requirements; or",
            "improvements to our moderation practices.",
          ]}
        />
        <p>
          The updated version will show a revised &ldquo;Last updated&rdquo;
          date.
        </p>
        <p>
          Where changes are material, we may notify you through the app,
          website, email, or another appropriate method.
        </p>
        <p>
          Continued use of Qaliye after updated Guidelines take effect means
          that you must follow the updated rules.
        </p>
      </Section>

      {/* Section 26 */}
      <Section number="26" title="Contact Us">
        <p>
          For questions, reports, appeals, or concerns relating to these
          Community Guidelines, contact:
        </p>
        <div className="space-y-1">
          <p><strong>Qaliye</strong></p>
          <p>Operated by <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong></p>
          <p><strong>Business address:</strong> [YOUR BUSINESS ADDRESS]</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="http://www.qaliye.com" className="text-primary hover:underline">www.qaliye.com</a>
          </p>
        </div>
      </Section>

      <p className="text-text-secondary italic text-sm pt-4 border-t border-border">
        These Community Guidelines are provided for informational purposes and
        do not constitute legal advice. You should have a qualified solicitor
        review this document before publication.
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
